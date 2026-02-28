'use client';

import { ObservationForm } from '@/components/observation-form';
import { createObservation } from '@/lib/actions/observations';
import type { ObservationFormValues } from '@/lib/validations/observation';

export function NewObservationClient({ userId }: { userId: string }) {
  const handleSubmit = async (data: ObservationFormValues) => {
    await createObservation(userId, data);
  };

  return <ObservationForm onSubmit={handleSubmit} />;
}
