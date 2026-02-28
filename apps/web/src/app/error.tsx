'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Flame, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-background px-4 text-center font-sans antialiased">
        {/* Icon */}
        <div className="mb-8 flex size-20 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10">
          <Flame className="size-9 text-amber-500" aria-hidden="true" />
        </div>

        {/* Copy */}
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
          Something went wrong
        </h1>
        <p className="mb-2 max-w-sm text-base text-muted-foreground">
          {error.message || 'An unexpected application error occurred. Our team has been notified.'}
        </p>
        {error.digest && (
          <p className="mb-8 font-mono text-xs text-muted-foreground/50">
            Error ID: {error.digest}
          </p>
        )}
        {!error.digest && <div className="mb-8" />}

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={reset}
            className="border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
            variant="outline"
          >
            <RefreshCw className="mr-2 size-4" />
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard">
              <Home className="mr-2 size-4" />
              Go to dashboard
            </Link>
          </Button>
        </div>
      </body>
    </html>
  );
}
