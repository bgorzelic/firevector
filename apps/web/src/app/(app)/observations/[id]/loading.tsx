import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function FormSectionSkeleton({ fieldCount = 3 }: { fieldCount?: number }) {
  return (
    <section className="py-6">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-3.5 w-64" />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: fieldCount }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function EditObservationLoading() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Page heading */}
      <Skeleton className="mb-1 h-8 w-44" />
      {/* Sub-label (Observation ID) */}
      <Skeleton className="mb-6 h-4 w-32" />

      {/* Incident Overview */}
      <FormSectionSkeleton fieldCount={4} />
      <Separator />

      {/* Environmental Conditions */}
      <FormSectionSkeleton fieldCount={3} />
      <Separator />

      {/* Wind & Slope */}
      <section className="py-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-72" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-4">
          <Skeleton className="h-16 flex-1 rounded-md" />
          <Skeleton className="h-16 flex-1 rounded-md" />
          <Skeleton className="h-16 flex-1 rounded-md" />
        </div>
      </section>
      <Separator />

      {/* Rate of Spread */}
      <FormSectionSkeleton fieldCount={3} />
      <Separator />

      {/* Observation Log */}
      <section className="py-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-56" />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      </section>
      <Separator />

      {/* Safety / LCES */}
      <section className="py-6">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3.5 w-64" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="size-4 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 -mx-6 mt-4 border-t border-border bg-background/90 px-6 py-4 backdrop-blur-sm md:mx-0 md:rounded-b-lg">
        <div className="flex items-center justify-end gap-3">
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}
