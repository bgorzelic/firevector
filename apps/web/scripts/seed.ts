import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from '../src/lib/db/schema';
import { recompute } from '@firevector/engine';
import type { WindSlope, RateOfSpread } from '@firevector/schema';

const connectionString = process.env.POSTGRES_URL!;
const client = postgres(connectionString, { prepare: false });
const db = drizzle(client, { schema });

function computeAndMerge(obs: {
  observedMidflameWs: number | null;
  observedSlopeContribution: number | null;
  observedEyeLevelWs: number | null;
  predictedMidflameWs: number | null;
  predictedSlopeContribution: number | null;
  predictedEyeLevelWs: number | null;
  observedRos: number | null;
  rosDirection: 'faster' | 'slower' | null;
}) {
  const windSlope: WindSlope = {
    observed: {
      eye_level_ws: obs.observedEyeLevelWs,
      midflame_ws: obs.observedMidflameWs,
      slope_contribution: obs.observedSlopeContribution,
      total_ews: null,
    },
    predicted: {
      eye_level_ws: obs.predictedEyeLevelWs,
      midflame_ws: obs.predictedMidflameWs,
      slope_contribution: obs.predictedSlopeContribution,
      total_ews: null,
    },
    ews_ratio: null,
  };
  const ros: RateOfSpread = {
    observed_ros: obs.observedRos,
    ros_direction: obs.rosDirection,
    calculated_ros: null,
  };
  return recompute(windSlope, ros);
}

async function seed() {
  // Find the first user in the database
  const [user] = await db.select().from(schema.users).limit(1);
  if (!user) {
    console.error('No users found. Log in to the app first, then re-run this script.');
    process.exit(1);
  }
  console.log(`Seeding observations for user: ${user.name} (${user.email})`);

  const userId = user.id;

  // ── Observation 1: Park Fire (Butte County) - Complete ──────────────────
  const obs1Raw = {
    observedEyeLevelWs: 15,
    observedMidflameWs: 8,
    observedSlopeContribution: 4,
    predictedEyeLevelWs: 20,
    predictedMidflameWs: 12,
    predictedSlopeContribution: 5,
    observedRos: 120 as number | null,
    rosDirection: 'faster' as const,
  };
  const obs1Computed = computeAndMerge(obs1Raw);

  const [obs1] = await db.insert(schema.observations).values({
    userId,
    status: 'complete',
    incidentName: 'Park Fire',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-07-24T14:30:00-07:00'),
    latitude: 39.9147,
    longitude: -121.6012,
    perimeterNotes: 'Fire perimeter expanding NE toward Cohasset Ridge. Spot fires observed 0.5mi ahead of main front. Dozer line holding on southern flank.',
    growthNotes: 'Rapid uphill runs in timber litter with 40-60% slopes. Crowning in dense mixed conifer stands. Growth rate accelerating with afternoon heating.',
    relativeHumidity: 12,
    fuelLitter: true,
    fuelGrass: false,
    fuelCrown: true,
    ...obs1Raw,
    observedTotalEws: obs1Computed.windSlope.observed.total_ews,
    predictedTotalEws: obs1Computed.windSlope.predicted.total_ews,
    ewsRatio: obs1Computed.windSlope.ews_ratio,
    calculatedRos: obs1Computed.ros.calculated_ros,
    safetyLookouts: true,
    safetyCommunications: true,
    safetyEscapeRoutes: true,
    safetyZones: true,
    createdAt: new Date('2025-07-24T14:30:00-07:00'),
    updatedAt: new Date('2025-07-24T16:45:00-07:00'),
  }).returning({ id: schema.observations.id });

  await db.insert(schema.observationLogEntries).values([
    {
      observationId: obs1.id,
      time: '1430',
      fireBehaviorNotes: 'Active crown fire on NE slope. Flame lengths 60-80ft in mixed conifer. Spotting up to 0.5mi.',
      weatherTrends: 'Temp 98F, RH 12%, winds SW 15-20 gusting 30. Haines index 6.',
      sortOrder: 0,
    },
    {
      observationId: obs1.id,
      time: '1515',
      fireBehaviorNotes: 'Fire made significant run toward Cohasset. Plume-dominated behavior observed. Evacuation warnings upgraded to orders.',
      weatherTrends: 'RH dropping to 9%. Wind shift expected 1700.',
      sortOrder: 1,
    },
    {
      observationId: obs1.id,
      time: '1600',
      fireBehaviorNotes: 'Rate of spread increasing. Fire crossed Hwy 32. Structure threat imminent in Cohasset subdivision.',
      weatherTrends: 'Temp peaked 102F. Thunderstorm cells visible to east — monitoring for outflow winds.',
      sortOrder: 2,
    },
  ]);

  // ── Observation 2: Palisades Fire (LA County) - Complete ────────────────
  const obs2Raw = {
    observedEyeLevelWs: 45,
    observedMidflameWs: 30,
    observedSlopeContribution: 8,
    predictedEyeLevelWs: 55,
    predictedMidflameWs: 35,
    predictedSlopeContribution: 10,
    observedRos: 300 as number | null,
    rosDirection: 'faster' as const,
  };
  const obs2Computed = computeAndMerge(obs2Raw);

  const [obs2] = await db.insert(schema.observations).values({
    userId,
    status: 'complete',
    incidentName: 'Palisades Fire',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-01-07T10:15:00-08:00'),
    latitude: 34.0522,
    longitude: -118.5270,
    perimeterNotes: 'Fire burning through Pacific Palisades toward Malibu. Extreme fire behavior in chaparral and urban interface. Multiple structures lost on Sunset Blvd corridor.',
    growthNotes: 'Santa Ana wind-driven fire with extreme ROS. Running downslope through Temescal Canyon. Ember transport 1-2mi ahead of flame front into residential areas.',
    relativeHumidity: 6,
    fuelLitter: true,
    fuelGrass: true,
    fuelCrown: true,
    ...obs2Raw,
    observedTotalEws: obs2Computed.windSlope.observed.total_ews,
    predictedTotalEws: obs2Computed.windSlope.predicted.total_ews,
    ewsRatio: obs2Computed.windSlope.ews_ratio,
    calculatedRos: obs2Computed.ros.calculated_ros,
    safetyLookouts: true,
    safetyCommunications: true,
    safetyEscapeRoutes: false,
    safetyZones: true,
    createdAt: new Date('2025-01-07T10:15:00-08:00'),
    updatedAt: new Date('2025-01-07T14:30:00-08:00'),
  }).returning({ id: schema.observations.id });

  await db.insert(schema.observationLogEntries).values([
    {
      observationId: obs2.id,
      time: '1015',
      fireBehaviorNotes: 'Extreme fire behavior. Wind-driven runs through chaparral with 100+ ft flame lengths. Structures igniting from ember showers.',
      weatherTrends: 'Santa Ana event: NE winds 45-60mph gusting 80. Temp 72F, RH 6%. Red flag warning in effect.',
      sortOrder: 0,
    },
    {
      observationId: obs2.id,
      time: '1130',
      fireBehaviorNotes: 'Fire reached PCH. Spot fires in Malibu. Multiple neighborhoods fully involved. Evacuation of 30,000 residents underway.',
      weatherTrends: 'Winds sustained 50mph. No relief expected until tomorrow. Humidity critical.',
      sortOrder: 1,
    },
    {
      observationId: obs2.id,
      time: '1300',
      fireBehaviorNotes: 'Fire crossed into Topanga Canyon. Structure protection groups deployed. Air tankers grounded due to wind.',
      weatherTrends: 'Winds gusting to 70mph at ridgetops. RH 4% at some RAWS stations.',
      sortOrder: 2,
    },
  ]);

  // ── Observation 3: Dixie Fire (Plumas County) - Complete ────────────────
  const obs3Raw = {
    observedEyeLevelWs: 10,
    observedMidflameWs: 5,
    observedSlopeContribution: 6,
    predictedEyeLevelWs: 12,
    predictedMidflameWs: 7,
    predictedSlopeContribution: 6,
    observedRos: 80 as number | null,
    rosDirection: 'faster' as const,
  };
  const obs3Computed = computeAndMerge(obs3Raw);

  const [obs3] = await db.insert(schema.observations).values({
    userId,
    status: 'complete',
    incidentName: 'Dixie Fire',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-08-04T11:00:00-07:00'),
    latitude: 40.0389,
    longitude: -121.3933,
    perimeterNotes: 'Fire perimeter encompasses 450,000+ acres. Northern flank active near Greenville. Containment lines holding on western edge along Lake Almanor.',
    growthNotes: 'Moderate fire behavior in timber with terrain-driven upslope runs. Torching in individual trees. Group torching observed in beetle-kill stands.',
    relativeHumidity: 15,
    fuelLitter: true,
    fuelGrass: false,
    fuelCrown: false,
    ...obs3Raw,
    observedTotalEws: obs3Computed.windSlope.observed.total_ews,
    predictedTotalEws: obs3Computed.windSlope.predicted.total_ews,
    ewsRatio: obs3Computed.windSlope.ews_ratio,
    calculatedRos: obs3Computed.ros.calculated_ros,
    safetyLookouts: true,
    safetyCommunications: true,
    safetyEscapeRoutes: true,
    safetyZones: true,
    createdAt: new Date('2025-08-04T11:00:00-07:00'),
    updatedAt: new Date('2025-08-04T15:00:00-07:00'),
  }).returning({ id: schema.observations.id });

  await db.insert(schema.observationLogEntries).values([
    {
      observationId: obs3.id,
      time: '1100',
      fireBehaviorNotes: 'Surface fire in timber litter. Occasional torching in individual ponderosa pine. Backing fire on south-facing slopes.',
      weatherTrends: 'Temp 88F, RH 15%, winds light and variable 5-8mph. Inversion expected to break by 1200.',
      sortOrder: 0,
    },
    {
      observationId: obs3.id,
      time: '1230',
      fireBehaviorNotes: 'Inversion broke. Upslope runs developing. Group torching in beetle-kill ponderosa stands. Spotting 0.25mi.',
      weatherTrends: 'Winds shifted to SW 10-15. RH dropping to 12%. Column building.',
      sortOrder: 1,
    },
  ]);

  // ── Observation 4: Creek Fire (Fresno County) - Draft ───────────────────
  const obs4Raw = {
    observedEyeLevelWs: 8,
    observedMidflameWs: 4,
    observedSlopeContribution: 3,
    predictedEyeLevelWs: null as number | null,
    predictedMidflameWs: null as number | null,
    predictedSlopeContribution: null as number | null,
    observedRos: null as number | null,
    rosDirection: null as 'faster' | 'slower' | null,
  };
  const obs4Computed = computeAndMerge(obs4Raw);

  await db.insert(schema.observations).values({
    userId,
    status: 'draft',
    incidentName: 'Creek Fire Recon',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-09-05T09:00:00-07:00'),
    latitude: 37.2050,
    longitude: -119.3100,
    perimeterNotes: 'Initial reconnaissance of fire origin area near Shaver Lake. Assessing fuel conditions post-suppression.',
    growthNotes: '',
    relativeHumidity: 22,
    fuelLitter: true,
    fuelGrass: true,
    fuelCrown: false,
    ...obs4Raw,
    observedTotalEws: obs4Computed.windSlope.observed.total_ews,
    predictedTotalEws: obs4Computed.windSlope.predicted.total_ews,
    ewsRatio: obs4Computed.windSlope.ews_ratio,
    calculatedRos: obs4Computed.ros.calculated_ros,
    safetyLookouts: true,
    safetyCommunications: false,
    safetyEscapeRoutes: false,
    safetyZones: false,
    createdAt: new Date('2025-09-05T09:00:00-07:00'),
    updatedAt: new Date('2025-09-05T09:00:00-07:00'),
  });

  // ── Observation 5: Cajon Pass (San Bernardino) - Draft ──────────────────
  await db.insert(schema.observations).values({
    userId,
    status: 'draft',
    incidentName: 'Cajon Pass Spot',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-10-15T16:00:00-07:00'),
    latitude: 34.3140,
    longitude: -117.4680,
    perimeterNotes: 'Small spot fire near I-15 corridor. Responding engines on scene.',
    growthNotes: 'Slow spread in grass/brush mix. Monitoring for wind increase.',
    relativeHumidity: 18,
    fuelLitter: false,
    fuelGrass: true,
    fuelCrown: false,
    observedEyeLevelWs: 12,
    observedMidflameWs: 6,
    observedSlopeContribution: 2,
    observedTotalEws: 8,
    predictedEyeLevelWs: null,
    predictedMidflameWs: null,
    predictedSlopeContribution: null,
    predictedTotalEws: null,
    ewsRatio: null,
    observedRos: 40,
    rosDirection: null,
    calculatedRos: null,
    safetyLookouts: true,
    safetyCommunications: true,
    safetyEscapeRoutes: true,
    safetyZones: false,
    createdAt: new Date('2025-10-15T16:00:00-07:00'),
    updatedAt: new Date('2025-10-15T16:00:00-07:00'),
  });

  // ── Observation 6: Mendocino Complex (Lake County) - Complete ───────────
  const obs6Raw = {
    observedEyeLevelWs: 18,
    observedMidflameWs: 10,
    observedSlopeContribution: 5,
    predictedEyeLevelWs: 22,
    predictedMidflameWs: 14,
    predictedSlopeContribution: 5,
    observedRos: 150 as number | null,
    rosDirection: 'faster' as const,
  };
  const obs6Computed = computeAndMerge(obs6Raw);

  const [obs6] = await db.insert(schema.observations).values({
    userId,
    status: 'complete',
    incidentName: 'Mendocino Complex',
    observerName: 'Brian Gorzelic',
    observationDatetime: new Date('2025-07-28T13:00:00-07:00'),
    latitude: 39.2430,
    longitude: -122.9210,
    perimeterNotes: 'Ranch Fire and River Fire burning simultaneously. Ranch Fire expanding north toward Mendocino NF. Active spotting across containment lines on east flank.',
    growthNotes: 'Extreme fire behavior in chamise and manzanita. Running upslope with alignment of wind and terrain. Plume collapse event at 1400 caused erratic behavior.',
    relativeHumidity: 8,
    fuelLitter: true,
    fuelGrass: true,
    fuelCrown: true,
    ...obs6Raw,
    observedTotalEws: obs6Computed.windSlope.observed.total_ews,
    predictedTotalEws: obs6Computed.windSlope.predicted.total_ews,
    ewsRatio: obs6Computed.windSlope.ews_ratio,
    calculatedRos: obs6Computed.ros.calculated_ros,
    safetyLookouts: true,
    safetyCommunications: true,
    safetyEscapeRoutes: true,
    safetyZones: true,
    createdAt: new Date('2025-07-28T13:00:00-07:00'),
    updatedAt: new Date('2025-07-28T17:30:00-07:00'),
  }).returning({ id: schema.observations.id });

  await db.insert(schema.observationLogEntries).values([
    {
      observationId: obs6.id,
      time: '1300',
      fireBehaviorNotes: 'Active running in chamise. Flame lengths 30-50ft on slope. Spotting 0.25mi. Aerial resources working eastern flank.',
      weatherTrends: 'Temp 104F, RH 8%, winds NW 18-25. Extreme fire weather conditions.',
      sortOrder: 0,
    },
    {
      observationId: obs6.id,
      time: '1400',
      fireBehaviorNotes: 'Plume collapse event. Erratic winds at surface 360 degrees. All personnel pulled to safety zones. Burnover reported on Div Alpha.',
      weatherTrends: 'Surface winds erratic 15-40mph variable direction. Pyrocumulus collapse.',
      sortOrder: 1,
    },
    {
      observationId: obs6.id,
      time: '1530',
      fireBehaviorNotes: 'Conditions stabilizing post-collapse. Fire made 2mi run to north during event. Reassessing containment strategy.',
      weatherTrends: 'Winds returning to NW 15-20. RH recovering slightly to 11%. Column rebuilding.',
      sortOrder: 2,
    },
  ]);

  console.log('Seeded 6 observations (4 complete, 2 drafts) with log entries.');
  await client.end();
}

seed().catch(console.error);
