import { pgTable, uuid, text, timestamp, real, boolean, integer } from 'drizzle-orm/pg-core';

// ── Users ──────────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── NextAuth Tables ────────────────────────────────────────────────────────────

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionToken: text('session_token').notNull().unique(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
});

// ── Observations ───────────────────────────────────────────────────────────────

export const observations = pgTable('observations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: text('status', { enum: ['draft', 'complete'] }).notNull().default('draft'),

  // Incident Overview
  incidentName: text('incident_name').notNull().default(''),
  observerName: text('observer_name').notNull().default(''),
  observationDatetime: timestamp('observation_datetime'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  perimeterNotes: text('perimeter_notes').notNull().default(''),
  growthNotes: text('growth_notes').notNull().default(''),

  // Environmental Inputs
  relativeHumidity: real('relative_humidity'),
  fuelLitter: boolean('fuel_litter').notNull().default(false),
  fuelGrass: boolean('fuel_grass').notNull().default(false),
  fuelCrown: boolean('fuel_crown').notNull().default(false),

  // Wind and Slope - Observed
  observedEyeLevelWs: real('observed_eye_level_ws'),
  observedMidflameWs: real('observed_midflame_ws'),
  observedSlopeContribution: real('observed_slope_contribution'),
  observedTotalEws: real('observed_total_ews'),

  // Wind and Slope - Predicted
  predictedEyeLevelWs: real('predicted_eye_level_ws'),
  predictedMidflameWs: real('predicted_midflame_ws'),
  predictedSlopeContribution: real('predicted_slope_contribution'),
  predictedTotalEws: real('predicted_total_ews'),

  // EWS Ratio
  ewsRatio: real('ews_ratio'),

  // Rate of Spread
  observedRos: real('observed_ros'),
  rosDirection: text('ros_direction', { enum: ['faster', 'slower'] }),
  calculatedRos: real('calculated_ros'),

  // Safety Audit (LCES)
  safetyLookouts: boolean('safety_lookouts').notNull().default(false),
  safetyCommunications: boolean('safety_communications').notNull().default(false),
  safetyEscapeRoutes: boolean('safety_escape_routes').notNull().default(false),
  safetyZones: boolean('safety_zones').notNull().default(false),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── Observation Log Entries ────────────────────────────────────────────────────

export const observationLogEntries = pgTable('observation_log_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  observationId: uuid('observation_id').notNull().references(() => observations.id, { onDelete: 'cascade' }),
  time: text('time').notNull().default(''),
  fireBehaviorNotes: text('fire_behavior_notes').notNull().default(''),
  weatherTrends: text('weather_trends').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});
