import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { NewObservationClient } from './client';

export default async function NewObservationPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Observation</h1>
      <NewObservationClient userId={session.user.id} />
    </div>
  );
}
