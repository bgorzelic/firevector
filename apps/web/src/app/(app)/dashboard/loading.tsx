import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="size-8 rounded-md" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9 w-16" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-border bg-muted/30 px-4 py-3">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-16 ml-auto" />
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-14" />
      </div>
      {/* Data rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
        >
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-14 rounded-full ml-auto" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="relative h-72 w-full overflow-hidden rounded-lg border border-border bg-muted/20 lg:h-96">
      {/* Shimmer overlay with amber tint */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 via-muted/20 to-amber-500/5" />
      {/* Crosshair-style center marker */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      {/* Fake pin clusters */}
      <Skeleton className="absolute left-[30%] top-[40%] size-3 rounded-full" />
      <Skeleton className="absolute left-[55%] top-[60%] size-3 rounded-full" />
      <Skeleton className="absolute left-[70%] top-[30%] size-3 rounded-full" />
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page header skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Map + Table */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-[60%]">
          <Skeleton className="mb-3 h-4 w-40" />
          <MapSkeleton />
        </div>
        <div className="lg:w-[40%]">
          <Skeleton className="mb-3 h-4 w-36" />
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}
