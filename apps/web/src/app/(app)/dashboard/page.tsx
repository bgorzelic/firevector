import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ObservationsTable } from '@/components/dashboard/observations-table';
import { ObservationsMap } from '@/components/dashboard/observations-map';
import { auth } from '@/lib/auth';
import { getObservations, getObservationStats } from '@/lib/actions/observations';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const [obs, stats] = await Promise.all([
    getObservations(session.user.id),
    getObservationStats(session.user.id),
  ]);

  const mapPins = obs
    .filter((o) => o.latitude !== null && o.longitude !== null)
    .map((o) => ({
      id: o.id,
      latitude: o.latitude!,
      longitude: o.longitude!,
      incidentName: o.incidentName,
      ewsRatio: o.ewsRatio,
      calculatedRos: o.calculatedRos,
    }));

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #f59e0b, #ea580c, #ef4444)' }}
            >
              Dashboard
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your wildfire observations at a glance.
          </p>
        </div>
        <Button asChild>
          <Link href="/observations/new">
            <Plus className="mr-1.5 size-4" />
            New Observation
          </Link>
        </Button>
      </div>

      {/* Stats row */}
      <StatsCards total={stats.total} drafts={stats.drafts} completed={stats.completed} />

      {/* Map + Table: side by side on desktop, stacked on mobile */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Map — 60% width on desktop */}
        <div className="lg:w-[60%]">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Observation Locations
          </h2>
          <ObservationsMap observations={mapPins} />
        </div>

        {/* Table — 40% width on desktop */}
        <div className="lg:w-[40%]">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Observations
          </h2>
          <ObservationsTable observations={obs} />
        </div>
      </div>
    </div>
  );
}
