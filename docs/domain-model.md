# Domain Model

This document explains the fire behavior concepts behind Firevector in plain English. It is written for developers and contributors who may not have a wildfire background.

## Overview

When a wildfire is burning, observers on the ground record structured data about fire behavior, weather conditions, and safety protocols. This data drives critical decisions: where to position crews, when to call for additional resources, whether to issue evacuation orders, and how to set escape routes.

Firevector digitizes the **NWCG Fire Behavior Observation Form**, a standardized worksheet used by fire crews across the United States. The form captures observed conditions and predicted conditions, then uses simple math to project how the fire will behave. Firevector automates that math.

## Effective Wind Speed (EWS)

### What It Is

Effective Wind Speed combines two forces that push fire across the landscape: **wind** and **slope**. Fire burns faster uphill (slope acts like wind) and faster with wind behind it. EWS represents the combined effect of both forces as a single number, measured in miles per hour.

### The Formula

```
Total EWS = Midflame Wind Speed + Slope Contribution
```

- **Midflame Wind Speed** -- Wind speed measured at the height of the flames (typically 4-6 feet above ground), not the standard 20-foot weather station height. Midflame wind is usually estimated as a fraction of the eye-level or 20-foot wind speed, depending on vegetation and canopy cover.
- **Slope Contribution** -- An equivalent wind speed value that represents how much the terrain's slope accelerates fire spread. For example, a steep uphill slope might contribute the equivalent of 3-5 mph of additional wind. This value is looked up from NWCG reference tables based on slope steepness and fuel type.

### Why It Matters

A fire being pushed by 10 mph of effective wind behaves very differently from one with 2 mph. EWS directly determines flame length, fireline intensity, and how quickly the fire spreads. It is one of the most important numbers on the observation form.

## EWS Ratio

### What It Is

The EWS Ratio compares what observers are actually seeing in the field (**observed EWS**) to what the weather forecast predicted (**predicted EWS**). It answers the question: "Is the fire behaving as we expected?"

### The Formula

```
EWS Ratio = max(observed, predicted) / min(observed, predicted)
```

The ratio is always >= 1. A ratio of 1.0 means the fire is behaving exactly as predicted. A ratio of 2.0 means conditions are twice as intense (or half as intense) as expected.

> **Important:** If the smaller value is zero, the ratio is undefined (Firevector returns `null`). You cannot divide by zero, and a zero EWS would mean no wind and no slope, which is a rare edge case.

### Why It Matters

The EWS ratio is the bridge between observation and projection. When the ratio is significantly above 1, it means conditions on the ground are deviating from the forecast -- a signal that fire behavior predictions need to be updated and safety plans may need revision.

## Rate of Spread (ROS)

### What It Is

Rate of Spread is how fast the fire front is advancing, measured in chains per hour (1 chain = 66 feet). An observer estimates this by timing how long it takes the fire to cross a known distance, or by comparing perimeter positions over time.

### The Projection Formula

Firevector projects what the Rate of Spread **will be** based on the EWS ratio:

- **If fire is expected to burn faster** (observed EWS > predicted EWS):
  ```
  Projected ROS = Observed ROS x EWS Ratio
  ```

- **If fire is expected to burn slower** (predicted EWS > observed EWS):
  ```
  Projected ROS = Observed ROS / EWS Ratio
  ```

The observer selects the direction ("faster" or "slower") based on whether conditions are intensifying or diminishing.

### Why It Matters

Projected ROS drives evacuation timing. If a fire is spreading at 20 chains per hour and a community is 100 chains away, responders have roughly 5 hours to execute an evacuation. If conditions change and the projected ROS doubles, that window is cut in half. Getting this number right -- and getting it quickly -- saves lives.

## LCES Safety Protocol

### What It Is

LCES stands for **Lookouts, Communications, Escape Routes, Safety Zones**. It is a mandatory safety protocol that must be established and confirmed before any firefighting operations begin. Firevector includes an LCES checklist on every observation form.

### The Four Elements

| Element | Description |
|---------|-------------|
| **Lookouts** | Designated personnel positioned to observe the fire and warn crews of changes in behavior, weather, or other hazards. Every crew working the fire must have a lookout. |
| **Communications** | Reliable radio or other communication links between lookouts, crews, and overhead (incident command). If communications fail, crews must withdraw to safety zones. |
| **Escape Routes** | Pre-identified paths that crews can use to reach safety zones. Escape routes must be tested, timed, and communicated to all personnel. Multiple routes are preferred. |
| **Safety Zones** | Areas of sufficient size and distance from fire fuels where crews can survive without shelters. Safety zones can be natural (rock outcrops, lakes) or constructed (cleared areas). |

### Why It Matters

LCES is non-negotiable in wildland firefighting. The [Thirty Mile Fire](https://en.wikipedia.org/wiki/Thirtymile_Fire) (2001) and [Yarnell Hill Fire](https://en.wikipedia.org/wiki/Yarnell_Hill_Fire) (2013) are tragic reminders of what happens when LCES protocols break down. By including the checklist on every observation form, Firevector reinforces the habit of verifying safety protocols during every field observation.

## How It All Fits Together

Here is the workflow from field observation to decision-making:

1. **Observer arrives at the fire** and establishes LCES (Lookouts, Communications, Escape Routes, Safety Zones).

2. **Observer records current conditions:**
   - Measures eye-level wind speed with a weather meter
   - Estimates midflame wind speed based on fuel type and canopy cover
   - Looks up slope contribution from NWCG reference tables
   - Records the weather forecast's predicted values for comparison

3. **Firevector calculates derived fields** in real time:
   - Total EWS for both observed and predicted columns
   - EWS Ratio comparing the two
   - Projected ROS based on the ratio and direction

4. **Observer logs fire behavior notes** over time, creating a timeline of conditions.

5. **Decision-makers use the data** to:
   - **Request resources** -- If projected ROS is high, more crews, aircraft, or engines may be needed
   - **Issue evacuations** -- If the fire is advancing toward communities faster than expected
   - **Adjust containment strategy** -- If conditions differ significantly from the forecast
   - **Verify safety protocols** -- LCES must be re-evaluated whenever conditions change

## Environmental Inputs

The observation form also captures:

- **Relative Humidity** -- Lower humidity means drier fuels and faster fire spread
- **Fuel Type** -- Litter (dead leaves/needles on the ground), grass, or crown (tree canopy) fuels each burn differently
- **Weather Trends** -- Timestamped notes on changing conditions

These inputs provide context for the calculations and help identify trends over the observation period.

## References

- [NWCG Fire Behavior Field Reference Guide (PMS 437)](https://www.nwcg.gov/publications/pms437) -- The field reference that defines the observation form and lookup tables
- [NWCG Incident Response Pocket Guide (IRPG, PMS 461)](https://www.nwcg.gov/publications/pms461) -- Contains LCES protocols and safety guidelines
- [S-290 Intermediate Wildland Fire Behavior](https://www.nwcg.gov/course/s-290) -- The NWCG training course covering fire behavior calculations
- [Open-Meteo Weather API](https://open-meteo.com/) -- The weather data source used by Firevector (free, open-source)
