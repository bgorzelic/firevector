import { ObservationForm } from '@/components/observation-form';

interface EditObservationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditObservationPage({ params }: EditObservationPageProps) {
  // params is a Promise in Next.js 15+ App Router
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Edit Observation</h1>
      <p className="mb-6 text-sm text-muted-foreground">ID: {id}</p>
      {/* Render empty form for now — data loading wired after auth */}
      <ObservationForm />
    </div>
  );
}
