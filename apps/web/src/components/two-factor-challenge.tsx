'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Shield } from 'lucide-react';
import { verifyTwoFactorLogin } from '@/lib/actions/two-factor';

export function TwoFactorChallenge({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Invalid authentication request. Please{' '}
          <a href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            sign in
          </a>{' '}
          again.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (code.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      // First verify the TOTP code
      const result = await verifyTwoFactorLogin(email, code);
      if (!result.success) {
        setError(result.error ?? 'Invalid verification code.');
        setIsLoading(false);
        return;
      }

      // TOTP verified — now complete sign-in with credentials
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Invalid password. Please try again.');
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900">
          <Shield className="size-6 text-amber-500" />
        </div>
      </div>

      <p className="text-center text-sm text-zinc-400">
        Enter the 6-digit code from your authenticator app and your password to complete sign-in.
      </p>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Email display */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-zinc-300">Email</label>
        <p className="rounded-md border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-400">
          {email}
        </p>
      </div>

      {/* Password input */}
      <div className="space-y-1.5">
        <label htmlFor="two-factor-password" className="text-sm font-medium text-zinc-300">
          Password
        </label>
        <Input
          id="two-factor-password"
          type="password"
          placeholder="Enter your password"
          className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {/* TOTP code input */}
      <div className="space-y-1.5">
        <label htmlFor="two-factor-code" className="text-sm font-medium text-zinc-300">
          Authentication code
        </label>
        <Input
          id="two-factor-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600 text-center text-lg tracking-[0.5em] font-mono"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          disabled={isLoading}
          autoFocus
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading || code.length !== 6 || !password}
        className="mt-2 w-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & Sign In'
        )}
      </Button>

      <div className="text-center">
        <a
          href="/login"
          className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          Back to sign in
        </a>
      </div>
    </form>
  );
}
