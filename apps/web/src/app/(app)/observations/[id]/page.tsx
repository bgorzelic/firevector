import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getObservation } from '@/lib/actions/observations';
import { EditObservationClient } from './client';

interface EditObservationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditObservationPage({ params }: EditObservationPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;
  const obs = await getObservation(session.user.id, id);
  if (!obs) notFound();

  const initialData = {
    status: obs.status as 'draft' | 'complete',
    incidentName: obs.incidentName,
    observerName: obs.observerName,
    observationDatetime: obs.observationDatetime?.toISOString().slice(0, 16) ?? '',
    perimeterNotes: obs.perimeterNotes,
    growthNotes: obs.growthNotes,
    latitude: obs.latitude ?? undefined,
    longitude: obs.longitude ?? undefined,
    relativeHumidity: obs.relativeHumidity ?? undefined,
    fuelLitter: obs.fuelLitter,
    fuelGrass: obs.fuelGrass,
    fuelCrown: obs.fuelCrown,
    observedEyeLevelWs: obs.observedEyeLevelWs ?? undefined,
    observedMidflameWs: obs.observedMidflameWs ?? undefined,
    observedSlopeContribution: obs.observedSlopeContribution ?? undefined,
    predictedEyeLevelWs: obs.predictedEyeLevelWs ?? undefined,
    predictedMidflameWs: obs.predictedMidflameWs ?? undefined,
    predictedSlopeContribution: obs.predictedSlopeContribution ?? undefined,
    observedRos: obs.observedRos ?? undefined,
    rosDirection: obs.rosDirection as 'faster' | 'slower' | undefined,
    observationLog: obs.logEntries.length > 0
      ? obs.logEntries.map((e) => ({
          time: e.time,
          fire_behavior_notes: e.fireBehaviorNotes,
          weather_trends: e.weatherTrends,
        }))
      : [{ time: '', fire_behavior_notes: '', weather_trends: '' }],
    lookouts: obs.safetyLookouts,
    communications: obs.safetyCommunications,
    escapeRoutes: obs.safetyEscapeRoutes,
    safetyZones: obs.safetyZones,
  };

  return (
    <div className="max-w-4xl mx-auto">
      <EditObservationClient
        userId={session.user.id}
        observationId={id}
        incidentName={obs.incidentName}
        initialData={initialData}
      />
    </div>
  );
}
