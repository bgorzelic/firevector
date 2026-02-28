# Firevector User Guide

A practical guide to using Firevector for wildfire observation recording and fire behavior calculations.

---

## Getting Started

### Creating an Account

1. Go to [firevector.org](https://firevector.org) and click **Create Account**
2. Sign up with email and password, or use **Sign in with Google**
3. Check your email for a verification link and click it to activate your account
4. Sign in to access your dashboard

### Signing In

- **Email/password** — Enter your credentials on the login page
- **Google OAuth** — Click "Sign in with Google" for one-click access
- **Two-factor authentication** — If enabled, you'll be prompted for a 6-digit code after entering your password (see [Two-Factor Authentication](#two-factor-authentication) below)

---

## Dashboard Overview

After signing in, you land on the command center dashboard with three main sections:

### Stats Cards

At the top, three cards show:
- **Total Observations** — All observations you've recorded
- **Completed** — Observations marked as complete with all required fields
- **Drafts** — In-progress observations you can finish later

### Observation Table

A sortable table of all your observations showing:
- Incident name and observer name
- Status (draft or complete)
- Date/time of observation
- Key calculated values (EWS Ratio, Projected ROS)
- Click any row to view or edit the full observation

### Map View

An interactive dark-themed map with amber pins at each observation's GPS coordinates. Click a pin to see a popup with the incident name, EWS Ratio, and Projected ROS.

---

## Sample Data

When you create a new account, Firevector pre-populates **3 sample observations** so you can see the dashboard in action immediately:

| Observation | Location | Status | Description |
|-------------|----------|--------|-------------|
| **Creek Fire** | Fresno County (37.20, -119.25) | Complete | High EWS scenario with active crown fire, full LCES |
| **Dixie Fire** | Butte/Plumas County (40.05, -121.40) | Complete | Moderate EWS with surface fire, full LCES |
| **Park Fire** | Butte County (39.85, -121.60) | Draft | Partial data, initial size-up in progress |

These use realistic California wildfire data. The observer name is set to "Sample Data" so you can identify them. Feel free to edit or delete them as you start entering your own observations.

---

## Creating an Observation

Click the **New Observation** button on the dashboard. The form has six sections:

### 1. Incident Information

- **Incident Name** — Name of the fire (e.g., "Creek Fire")
- **Observer Name** — Your name or callsign
- **Date/Time** — When the observation was taken
- **GPS Coordinates** — Latitude and longitude (use the auto-locate button to fill from your device's GPS)
- **Perimeter Notes** — Describe the fire perimeter behavior
- **Growth Notes** — Describe fire growth patterns and spread direction

### 2. Environment

- **Relative Humidity (%)** — Current RH reading
- **Fuel Types** — Check the dominant fuel types present: Litter, Grass, and/or Crown

### 3. Wind and Slope

This section has two columns — **Observed** (what you're measuring in the field) and **Predicted** (from weather forecasts or models):

- **Eye-Level Wind Speed** — Wind speed measured at eye level
- **Midflame Wind Speed** — Wind speed at midflame height (typically 1/3 of eye-level in timber)
- **Slope Contribution** — Effective wind equivalent from slope steepness

**Calculated fields** (auto-computed as you type):
- **Total EWS** = Midflame Wind Speed + Slope Contribution
- **EWS Ratio** = max(observed EWS, predicted EWS) / min(observed EWS, predicted EWS)

### 4. Rate of Spread

- **Observed ROS** — Rate of spread you're measuring in the field (chains per hour)
- **Direction** — Whether the fire is moving **faster** or **slower** than predicted
- **Projected ROS** — Auto-calculated from Observed ROS and EWS Ratio

### 5. Safety / LCES Checklist

Check each safety element that is in place:
- **Lookouts** — Are lookouts posted and communicating?
- **Communications** — Is communication established with all units?
- **Escape Routes** — Are escape routes identified and clear?
- **Safety Zones** — Are safety zones identified and accessible?

A green indicator appears when all four LCES elements are confirmed.

### 6. Observation Log

Add timestamped entries to record fire behavior changes over time:
- **Time** — Time of the log entry (e.g., "1430")
- **Fire Behavior Notes** — What the fire is doing
- **Weather Trends** — Weather changes you're observing

Click **Add Entry** to append more log rows.

### Saving

- **Save as Draft** — Save incomplete observations to finish later
- **Mark Complete** — Save with full validation. Complete observations appear with a checkmark in the dashboard

---

## Understanding Calculations

Firevector automatically computes three derived fields using the NWCG fire behavior calculation methodology:

### Effective Wind Speed (EWS)

**Total EWS = Midflame Wind Speed + Slope Contribution**

Calculated separately for both observed and predicted values. Represents the combined effect of wind and slope on fire behavior.

### EWS Ratio

**EWS Ratio = max(observed EWS, predicted EWS) / min(observed EWS, predicted EWS)**

Compares observed vs. predicted conditions. A ratio of 1.0 means perfect alignment. Higher ratios indicate a larger gap between what was forecasted and what's actually happening — a critical safety signal.

If the minimum EWS is zero, the ratio is undefined (shown as blank).

### Projected Rate of Spread

Uses the EWS Ratio to adjust the observed ROS:

- If fire is moving **faster** than predicted: **Projected ROS = Observed ROS x EWS Ratio**
- If fire is moving **slower** than predicted: **Projected ROS = Observed ROS / EWS Ratio**

This gives incident commanders a forward-looking estimate of how fast the fire may spread under predicted conditions.

---

## Editing Observations

Click any observation row in the dashboard table to open it for editing. All fields are editable, and calculations update in real time. Changes are saved when you click Save Draft or Mark Complete.

---

## GPS Auto-Location

When creating or editing an observation, click the **location pin button** next to the GPS coordinates fields. Your browser will request permission to access your location, then auto-fill the latitude and longitude from your device's GPS.

This works on both desktop and mobile. On mobile devices in the field, this uses the device's GPS receiver for accurate coordinates.

---

## Two-Factor Authentication

Firevector supports optional TOTP-based two-factor authentication for additional account security.

### Setup

1. Go to your account settings
2. Click **Enable Two-Factor Authentication**
3. Scan the QR code with an authenticator app (Google Authenticator, Authy, 1Password, etc.)
4. Enter the 6-digit code from your authenticator to confirm setup

### Signing In with 2FA

After entering your email and password, you'll be redirected to a second screen where you enter the 6-digit code from your authenticator app.

### Disabling 2FA

You can disable two-factor authentication from your account settings at any time.

---

## Tips for Field Use

- **Save drafts frequently** — Don't wait until you have all the data. Save a draft with what you have and come back to it
- **Use GPS auto-locate** — Faster and more accurate than manual coordinate entry
- **Check the LCES indicator** — Make sure all four elements are green before committing to operations
- **Watch the EWS Ratio** — A high ratio means conditions are diverging from predictions. Reassess your plan
- **Log entries are timestamped** — Use them to build a timeline of fire behavior changes for the incident report
