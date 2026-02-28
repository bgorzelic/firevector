'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    // Log the error to the console for debugging
    console.error('[Dashboard Error]', error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center">
      {/* Icon */}
      <div className="flex size-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
        <AlertTriangle className="size-8 text-amber-500" aria-hidden="true" />
      </div>

      {/* Heading and message */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Dashboard failed to load
        </h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {error.message || 'An unexpected error occurred while loading your dashboard data.'}
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground/60">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Retry button */}
      <Button
        variant="outline"
        onClick={reset}
        className="border-amber-500/40 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
      >
        <RefreshCw className="mr-2 size-4" />
        Try again
      </Button>
    </div>
  );
}
