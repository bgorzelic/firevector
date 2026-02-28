'use client';

import { ObservationForm } from '@/components/observation-form';
import { updateObservation } from '@/lib/actions/observations';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface EditObservationClientProps {
  userId: string;
  observationId: string;
  initialData: ObservationFormValues;
}

export function EditObservationClient({
  userId,
  observationId,
  initialData,
}: EditObservationClientProps) {
  const handleSubmit = async (data: ObservationFormValues) => {
    await updateObservation(userId, observationId, data);
  };

  return <ObservationForm initialData={initialData} onSubmit={handleSubmit} />;
}
