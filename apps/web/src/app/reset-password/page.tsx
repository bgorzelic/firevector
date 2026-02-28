import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ResetPasswordForm } from '@/components/reset-password-form';

export const metadata: Metadata = {
  title: 'Reset Password — Firevector',
  description: 'Set a new password for your Firevector account.',
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-[#0a0a0a] px-4 py-12">
      {/* Fire gradient bar at top */}
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{
          background: 'linear-gradient(to right, #F59E0B, #EA580C, #DC2626)',
        }}
        aria-hidden="true"
      />

      {/* Subtle radial glow behind card */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <main
        className="relative z-10 w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 px-8 py-10 shadow-2xl"
        style={{
          boxShadow:
            '0 0 0 1px rgba(245, 158, 11, 0.06), 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px -20px rgba(245, 158, 11, 0.08)',
        }}
      >
        {/* Logo + Wordmark */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900"
            style={{
              boxShadow: '0 0 20px -4px rgba(245, 158, 11, 0.25)',
            }}
          >
            <Image
              src="/logo.svg"
              alt="Firevector"
              width={40}
              height={40}
              priority
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-[0.2em] text-zinc-50">FIREVECTOR</h1>
            <p className="mt-1 text-sm text-zinc-500">Reset your password</p>
          </div>
        </div>

        {/* Separator */}
        <div
          className="mb-8 h-px w-full"
          style={{
            background:
              'linear-gradient(to right, transparent, rgba(245, 158, 11, 0.2), transparent)',
          }}
          aria-hidden="true"
        />

        {/* Content */}
        {!token ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              Missing reset token. Please request a new password reset link.
            </div>
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-amber-500 hover:text-amber-400 transition-colors"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6 text-center text-sm text-zinc-400">
              Enter your new password below.
            </p>
            <ResetPasswordForm token={token} />
          </>
        )}

        {/* Back to sign in link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-zinc-500">
            Remember your password?{' '}
            <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center">
        <p className="text-[11px] text-zinc-700">
          <Link href="/privacy" className="hover:text-zinc-500 transition-colors">Privacy Policy</Link>
          {' | '}
          <Link href="/terms" className="hover:text-zinc-500 transition-colors">Terms of Service</Link>
          {' | '}
          MIT Licensed
        </p>
      </footer>
    </div>
  );
}
