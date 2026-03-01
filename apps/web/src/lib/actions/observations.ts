'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { observations, observationLogEntries } from '@/lib/db/schema';
import { desc, eq, count, and } from 'drizzle-orm';
import { recompute } from '@firevector/engine';
import type { WindSlope, RateOfSpread } from '@firevector/schema';
import type { ObservationFormValues } from '@/lib/validations/observation';

export async function getObservations(userId: string) {
  return db
    .select()
    .from(observations)
    .where(eq(observations.userId, userId))
    .orderBy(desc(observations.updatedAt));
}

export async function getObservationStats(userId: string) {
  const [allResult, draftsResult, completedResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(observations)
      .where(eq(observations.userId, userId)),
    db
      .select({ count: count() })
      .from(observations)
      .where(and(eq(observations.userId, userId), eq(observations.status, 'draft'))),
    db
      .select({ count: count() })
      .from(observations)
      .where(and(eq(observations.userId, userId), eq(observations.status, 'complete'))),
  ]);

  return {
    total: allResult[0]?.count ?? 0,
    drafts: draftsResult[0]?.count ?? 0,
    completed: completedResult[0]?.count ?? 0,
  };
}

export async function getObservation(userId: string, observationId: string) {
  const [obs] = await db
    .select()
    .from(observations)
    .where(and(eq(observations.id, observationId), eq(observations.userId, userId)))
    .limit(1);

  if (!obs) return null;

  const logEntries = await db
    .select()
    .from(observationLogEntries)
    .where(eq(observationLogEntries.observationId, observationId))
    .orderBy(observationLogEntries.sortOrder);

  return { ...obs, logEntries };
}

export async function createObservation(userId: string, data: ObservationFormValues) {
  // Recompute derived fields server-side for integrity
  const windSlope: WindSlope = {
    observed: {
      eye_level_ws: data.observedEyeLevelWs ?? null,
      midflame_ws: data.observedMidflameWs ?? null,
      slope_contribution: data.observedSlopeContribution ?? null,
      total_ews: null,
    },
    predicted: {
      eye_level_ws: data.predictedEyeLevelWs ?? null,
      midflame_ws: data.predictedMidflameWs ?? null,
      slope_contribution: data.predictedSlopeContribution ?? null,
      total_ews: null,
    },
    ews_ratio: null,
  };

  const ros: RateOfSpread = {
    observed_ros: data.observedRos ?? null,
    ros_direction: data.rosDirection ?? null,
    calculated_ros: null,
  };

  const computed = recompute(windSlope, ros);

  const [inserted] = await db
    .insert(observations)
    .values({
      userId,
      status: data.status,
      incidentName: data.incidentName,
      observerName: data.observerName,
      observationDatetime: data.observationDatetime ? new Date(data.observationDatetime) : null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      perimeterNotes: data.perimeterNotes,
      growthNotes: data.growthNotes,
      relativeHumidity: data.relativeHumidity ?? null,
      fuelLitter: data.fuelLitter,
      fuelGrass: data.fuelGrass,
      fuelCrown: data.fuelCrown,
      observedEyeLevelWs: data.observedEyeLevelWs ?? null,
      observedMidflameWs: data.observedMidflameWs ?? null,
      observedSlopeContribution: data.observedSlopeContribution ?? null,
      observedTotalEws: computed.windSlope.observed.total_ews,
      predictedEyeLevelWs: data.predictedEyeLevelWs ?? null,
      predictedMidflameWs: data.predictedMidflameWs ?? null,
      predictedSlopeContribution: data.predictedSlopeContribution ?? null,
      predictedTotalEws: computed.windSlope.predicted.total_ews,
      ewsRatio: computed.windSlope.ews_ratio,
      observedRos: data.observedRos ?? null,
      rosDirection: data.rosDirection ?? null,
      calculatedRos: computed.ros.calculated_ros,
      safetyLookouts: data.lookouts,
      safetyCommunications: data.communications,
      safetyEscapeRoutes: data.escapeRoutes,
      safetyZones: data.safetyZones,
    })
    .returning({ id: observations.id });

  // Save log entries
  if (data.observationLog.length > 0) {
    await db.insert(observationLogEntries).values(
      data.observationLog.map((entry, i) => ({
        observationId: inserted.id,
        time: entry.time,
        fireBehaviorNotes: entry.fire_behavior_notes,
        weatherTrends: entry.weather_trends,
        sortOrder: i,
      })),
    );
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function deleteObservation(userId: string, observationId: string) {
  // Verify ownership before deleting
  const [obs] = await db
    .select({ id: observations.id })
    .from(observations)
    .where(and(eq(observations.id, observationId), eq(observations.userId, userId)))
    .limit(1);

  if (!obs) {
    return { success: false, error: 'Observation not found' };
  }

  // Log entries cascade-delete via FK ON DELETE CASCADE
  await db.delete(observations).where(eq(observations.id, observationId));

  revalidatePath('/dashboard');
  return { success: true };
}

export async function seedSampleObservations(userId: string) {
  try {
    // Creek Fire — Fresno County, complete, high EWS
    const creekWindSlope: WindSlope = {
      observed: { eye_level_ws: 20, midflame_ws: 15, slope_contribution: 8, total_ews: null },
      predicted: { eye_level_ws: 14, midflame_ws: 10, slope_contribution: 5, total_ews: null },
      ews_ratio: null,
    };
    const creekRos: RateOfSpread = {
      observed_ros: 120,
      ros_direction: 'faster',
      calculated_ros: null,
    };
    const creek = recompute(creekWindSlope, creekRos);

    // Dixie Fire — Butte/Plumas County, complete, moderate EWS
    const dixieWindSlope: WindSlope = {
      observed: { eye_level_ws: 12, midflame_ws: 8, slope_contribution: 4, total_ews: null },
      predicted: { eye_level_ws: 16, midflame_ws: 12, slope_contribution: 3, total_ews: null },
      ews_ratio: null,
    };
    const dixieRos: RateOfSpread = {
      observed_ros: 80,
      ros_direction: 'slower',
      calculated_ros: null,
    };
    const dixie = recompute(dixieWindSlope, dixieRos);

    // Park Fire — Butte County, draft, partial data
    const parkWindSlope: WindSlope = {
      observed: { eye_level_ws: 10, midflame_ws: 6, slope_contribution: null, total_ews: null },
      predicted: { eye_level_ws: null, midflame_ws: null, slope_contribution: null, total_ews: null },
      ews_ratio: null,
    };
    const parkRos: RateOfSpread = {
      observed_ros: null,
      ros_direction: null,
      calculated_ros: null,
    };
    const park = recompute(parkWindSlope, parkRos);

    const now = new Date();
    const creekDate = new Date('2024-09-05T14:30:00');
    const dixieDate = new Date('2024-07-14T10:15:00');
    const parkDate = new Date('2024-07-24T16:45:00');

    const [creekObs, dixieObs] = await db
      .insert(observations)
      .values([
        {
          userId,
          status: 'complete' as const,
          incidentName: 'Creek Fire',
          observerName: 'Sample Data',
          observationDatetime: creekDate,
          latitude: 37.2,
          longitude: -119.25,
          perimeterNotes: 'Active crown fire on south flank, spotting 1/4 mile ahead',
          growthNotes: 'Rapid uphill runs in steep terrain, alignment with Stevenson Creek drainage',
          relativeHumidity: 12,
          fuelLitter: true,
          fuelGrass: true,
          fuelCrown: true,
          observedEyeLevelWs: 20,
          observedMidflameWs: 15,
          observedSlopeContribution: 8,
          observedTotalEws: creek.windSlope.observed.total_ews,
          predictedEyeLevelWs: 14,
          predictedMidflameWs: 10,
          predictedSlopeContribution: 5,
          predictedTotalEws: creek.windSlope.predicted.total_ews,
          ewsRatio: creek.windSlope.ews_ratio,
          observedRos: 120,
          rosDirection: 'faster' as const,
          calculatedRos: creek.ros.calculated_ros,
          safetyLookouts: true,
          safetyCommunications: true,
          safetyEscapeRoutes: true,
          safetyZones: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          userId,
          status: 'complete' as const,
          incidentName: 'Dixie Fire',
          observerName: 'Sample Data',
          observationDatetime: dixieDate,
          latitude: 40.05,
          longitude: -121.4,
          perimeterNotes: 'Surface fire backing downslope on east flank',
          growthNotes: 'Moderate spread through mixed conifer, flanking to the north',
          relativeHumidity: 22,
          fuelLitter: true,
          fuelGrass: false,
          fuelCrown: false,
          observedEyeLevelWs: 12,
          observedMidflameWs: 8,
          observedSlopeContribution: 4,
          observedTotalEws: dixie.windSlope.observed.total_ews,
          predictedEyeLevelWs: 16,
          predictedMidflameWs: 12,
          predictedSlopeContribution: 3,
          predictedTotalEws: dixie.windSlope.predicted.total_ews,
          ewsRatio: dixie.windSlope.ews_ratio,
          observedRos: 80,
          rosDirection: 'slower' as const,
          calculatedRos: dixie.ros.calculated_ros,
          safetyLookouts: true,
          safetyCommunications: true,
          safetyEscapeRoutes: true,
          safetyZones: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          userId,
          status: 'draft' as const,
          incidentName: 'Park Fire',
          observerName: 'Sample Data',
          observationDatetime: parkDate,
          latitude: 39.85,
          longitude: -121.6,
          perimeterNotes: '',
          growthNotes: 'Initial size-up, fire moving upslope through grass and oak woodland',
          relativeHumidity: null,
          fuelLitter: false,
          fuelGrass: true,
          fuelCrown: false,
          observedEyeLevelWs: 10,
          observedMidflameWs: 6,
          observedSlopeContribution: null,
          observedTotalEws: park.windSlope.observed.total_ews,
          predictedEyeLevelWs: null,
          predictedMidflameWs: null,
          predictedSlopeContribution: null,
          predictedTotalEws: park.windSlope.predicted.total_ews,
          ewsRatio: park.windSlope.ews_ratio,
          observedRos: null,
          rosDirection: null,
          calculatedRos: park.ros.calculated_ros,
          safetyLookouts: true,
          safetyCommunications: true,
          safetyEscapeRoutes: false,
          safetyZones: false,
          createdAt: now,
          updatedAt: now,
        },
      ])
      .returning({ id: observations.id });

    // Add log entries for the two complete observations
    await db.insert(observationLogEntries).values([
      {
        observationId: creekObs.id,
        time: '1430',
        fireBehaviorNotes: 'Active crown fire, flame lengths 40-60 ft, heavy spotting',
        weatherTrends: 'Temp 98F, RH dropping, winds gusting SW 20-25 mph',
        sortOrder: 0,
      },
      {
        observationId: creekObs.id,
        time: '1500',
        fireBehaviorNotes: 'Torching in timber, running upslope through drainage',
        weatherTrends: 'RH at 10%, wind shift expected by 1700',
        sortOrder: 1,
      },
      {
        observationId: dixieObs.id,
        time: '1015',
        fireBehaviorNotes: 'Surface fire with occasional torching, 4-8 ft flame lengths',
        weatherTrends: 'Morning inversion breaking, winds increasing from NW',
        sortOrder: 0,
      },
    ]);

    console.log(`Seeded 3 sample observations for user ${userId}`);
  } catch (error) {
    console.error('Failed to seed sample observations:', error);
  }
}

export async function updateObservation(
  userId: string,
  observationId: string,
  data: ObservationFormValues
) {
  // Verify ownership
  const [existing] = await db
    .select({ id: observations.id })
    .from(observations)
    .where(and(eq(observations.id, observationId), eq(observations.userId, userId)))
    .limit(1);

  if (!existing) throw new Error('Observation not found');

  // Recompute derived fields server-side
  const windSlope: WindSlope = {
    observed: {
      eye_level_ws: data.observedEyeLevelWs ?? null,
      midflame_ws: data.observedMidflameWs ?? null,
      slope_contribution: data.observedSlopeContribution ?? null,
      total_ews: null,
    },
    predicted: {
      eye_level_ws: data.predictedEyeLevelWs ?? null,
      midflame_ws: data.predictedMidflameWs ?? null,
      slope_contribution: data.predictedSlopeContribution ?? null,
      total_ews: null,
    },
    ews_ratio: null,
  };

  const ros: RateOfSpread = {
    observed_ros: data.observedRos ?? null,
    ros_direction: data.rosDirection ?? null,
    calculated_ros: null,
  };

  const computed = recompute(windSlope, ros);

  await db
    .update(observations)
    .set({
      status: data.status,
      incidentName: data.incidentName,
      observerName: data.observerName,
      observationDatetime: data.observationDatetime ? new Date(data.observationDatetime) : null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      perimeterNotes: data.perimeterNotes,
      growthNotes: data.growthNotes,
      relativeHumidity: data.relativeHumidity ?? null,
      fuelLitter: data.fuelLitter,
      fuelGrass: data.fuelGrass,
      fuelCrown: data.fuelCrown,
      observedEyeLevelWs: data.observedEyeLevelWs ?? null,
      observedMidflameWs: data.observedMidflameWs ?? null,
      observedSlopeContribution: data.observedSlopeContribution ?? null,
      observedTotalEws: computed.windSlope.observed.total_ews,
      predictedEyeLevelWs: data.predictedEyeLevelWs ?? null,
      predictedMidflameWs: data.predictedMidflameWs ?? null,
      predictedSlopeContribution: data.predictedSlopeContribution ?? null,
      predictedTotalEws: computed.windSlope.predicted.total_ews,
      ewsRatio: computed.windSlope.ews_ratio,
      observedRos: data.observedRos ?? null,
      rosDirection: data.rosDirection ?? null,
      calculatedRos: computed.ros.calculated_ros,
      safetyLookouts: data.lookouts,
      safetyCommunications: data.communications,
      safetyEscapeRoutes: data.escapeRoutes,
      safetyZones: data.safetyZones,
      updatedAt: new Date(),
    })
    .where(eq(observations.id, observationId));

  // Replace log entries
  await db
    .delete(observationLogEntries)
    .where(eq(observationLogEntries.observationId, observationId));

  if (data.observationLog.length > 0) {
    await db.insert(observationLogEntries).values(
      data.observationLog.map((entry, i) => ({
        observationId,
        time: entry.time,
        fireBehaviorNotes: entry.fire_behavior_notes,
        weatherTrends: entry.weather_trends,
        sortOrder: i,
      })),
    );
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}
