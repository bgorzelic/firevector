import Link from 'next/link';
import { Wind, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center">
      {/* Icon cluster */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="flex size-24 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/5">
          <Wind className="size-10 text-amber-500/70" aria-hidden="true" />
        </div>
        {/* Large faded number behind the icon */}
        <span
          className="pointer-events-none absolute -z-10 select-none font-mono text-9xl font-black tracking-tighter text-amber-500/5"
          aria-hidden="true"
        >
          404
        </span>
      </div>

      {/* Copy */}
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
        Lost in the smoke
      </h1>
      <p className="mb-2 max-w-sm text-base text-muted-foreground">
        This page drifted off course. The observation you're looking for doesn't exist or has been
        moved.
      </p>
      <p className="mb-8 font-mono text-xs text-muted-foreground/50">HTTP 404 — Not Found</p>

      {/* Action */}
      <Button asChild>
        <Link href="/dashboard">
          <Home className="mr-2 size-4" />
          Return to dashboard
        </Link>
      </Button>
    </div>
  );
}
