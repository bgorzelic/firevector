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
