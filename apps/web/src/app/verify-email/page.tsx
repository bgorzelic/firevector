import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { verifyEmail } from '@/lib/actions/auth';
import { ResendVerification } from '@/components/resend-verification';

export const metadata: Metadata = {
  title: 'Verify Email — Firevector',
  description: 'Verify your Firevector email address.',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; sent?: string; email?: string }>;
}) {
  const params = await searchParams;
  const { token, sent, email } = params;

  let verificationResult: { success: boolean; error?: string } | null = null;
  if (token) {
    verificationResult = await verifyEmail(token);
  }

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
        {token && verificationResult ? (
          // Token verification result
          verificationResult.success ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">Email verified!</h2>
              <p className="text-sm text-zinc-400">
                Your email has been verified. You can now sign in to your account.
              </p>
              <Link
                href="/login"
                className="mt-2 inline-flex h-10 items-center justify-center rounded-md bg-amber-500 px-6 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <svg
                  className="h-6 w-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-zinc-100">Verification failed</h2>
              <p className="text-sm text-zinc-400">
                {verificationResult.error ?? 'Something went wrong. Please try again.'}
              </p>
              <Link
                href="/login"
                className="mt-2 text-sm text-amber-500 transition-colors hover:text-amber-400"
              >
                Back to sign in
              </Link>
            </div>
          )
        ) : sent === 'true' ? (
          // Email sent confirmation
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
              <svg
                className="h-6 w-6 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100">Check your email</h2>
            <p className="text-sm text-zinc-400">
              We sent a verification email to{' '}
              {email ? (
                <span className="font-medium text-zinc-200">{decodeURIComponent(email)}</span>
              ) : (
                'your address'
              )}
              . Click the link to verify your account.
            </p>

            {email && <ResendVerification email={decodeURIComponent(email)} />}

            <Link
              href="/login"
              className="mt-2 text-sm text-amber-500 transition-colors hover:text-amber-400"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          // Fallback — no token or sent param
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-zinc-400">
              No verification token provided. Please check your email for the verification link.
            </p>
            <Link
              href="/login"
              className="mt-2 text-sm text-amber-500 transition-colors hover:text-amber-400"
            >
              Back to sign in
            </Link>
          </div>
        )}
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
