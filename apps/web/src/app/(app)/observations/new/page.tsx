import { ObservationForm } from '@/components/observation-form';

export default function NewObservationPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Observation</h1>
      <ObservationForm />
    </div>
  );
}
