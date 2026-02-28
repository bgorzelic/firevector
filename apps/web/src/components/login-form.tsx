'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginValues } from '@/lib/validations/auth';
import { checkTwoFactorStatus } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    setIsLoading(true);

    try {
      // Check if 2FA is required before attempting sign-in
      const twoFactorCheck = await checkTwoFactorStatus(values.email, values.password);
      if (twoFactorCheck.error) {
        setError(twoFactorCheck.error);
        return;
      }

      if (twoFactorCheck.twoFactorRequired) {
        router.push(`/two-factor?email=${encodeURIComponent(values.email)}`);
        return;
      }

      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Google OAuth */}
      <Button
        size="lg"
        variant="outline"
        className="w-full gap-3 text-base border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 transition-all duration-200 shadow-lg"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      >
        <GoogleIcon />
        Sign in with Google
      </Button>

      {/* Divider */}
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-zinc-800" />
        <span className="px-3 text-xs text-zinc-500">or</span>
        <div className="flex-1 border-t border-zinc-800" />
      </div>

      {/* Email/Password Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your password"
                    className="border-zinc-700 bg-zinc-900 text-zinc-100 placeholder:text-zinc-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full bg-amber-500 text-white hover:bg-amber-600 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>

      {/* Links */}
      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-zinc-500 transition-colors hover:text-amber-400"
        >
          Forgot password?
        </Link>
        <Link
          href="/register"
          className="text-sm text-amber-500 transition-colors hover:text-amber-400"
        >
          Create account &rarr;
        </Link>
      </div>
    </div>
  );
}
