'use client';

import { useState, useEffect, useCallback } from 'react';
import { resendVerificationEmail } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function ResendVerification({ email }: { email: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    setIsLoading(true);
    setSent(false);

    try {
      await resendVerificationEmail(email);
      setSent(true);
      setCooldown(60);
    } catch {
      // Silently handle — server action already returns success for security
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400">
          Verification email sent!
        </div>
        {cooldown > 0 && (
          <p className="text-xs text-zinc-500">
            You can resend in {cooldown}s
          </p>
        )}
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isLoading || cooldown > 0}
      onClick={handleResend}
      className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Sending...
        </>
      ) : cooldown > 0 ? (
        `Resend in ${cooldown}s`
      ) : (
        'Resend verification email'
      )}
    </Button>
  );
}
