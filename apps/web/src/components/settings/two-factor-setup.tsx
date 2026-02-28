'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Shield, ShieldCheck } from 'lucide-react';
import { setupTwoFactor, enableTwoFactor, disableTwoFactor } from '@/lib/actions/two-factor';

type SetupData = {
  secret: string;
  qrCodeUrl: string;
};

export function TwoFactorSetup({ twoFactorEnabled }: { twoFactorEnabled: boolean }) {
  const [enabled, setEnabled] = useState(twoFactorEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Setup flow state
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verifyCode, setVerifyCode] = useState('');

  // Disable flow state
  const [showDisable, setShowDisable] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  async function handleStartSetup() {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = await setupTwoFactor();
      if (result.success && result.secret && result.qrCodeUrl) {
        setSetupData({ secret: result.secret, qrCodeUrl: result.qrCodeUrl });
      } else {
        setError(result.error ?? 'Failed to start 2FA setup.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (verifyCode.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await enableTwoFactor(verifyCode);
      if (result.success) {
        setEnabled(true);
        setSetupData(null);
        setVerifyCode('');
        setSuccess('Two-factor authentication has been enabled.');
      } else {
        setError(result.error ?? 'Verification failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDisable() {
    if (disableCode.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await disableTwoFactor(disableCode);
      if (result.success) {
        setEnabled(false);
        setShowDisable(false);
        setDisableCode('');
        setSuccess('Two-factor authentication has been disabled.');
      } else {
        setError(result.error ?? 'Verification failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancelSetup() {
    setSetupData(null);
    setVerifyCode('');
    setError(null);
  }

  function handleCancelDisable() {
    setShowDisable(false);
    setDisableCode('');
    setError(null);
  }

  // ── 2FA is enabled ──────────────────────────────────────────────────────────
  if (enabled && !showDisable) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-green-500" />
              <div>
                <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Your account is protected with an authenticator app.
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Enabled</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}
          <Button
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => {
              setShowDisable(true);
              setSuccess(null);
            }}
          >
            Disable 2FA
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ── Disable confirmation ────────────────────────────────────────────────────
  if (enabled && showDisable) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-amber-500" />
            <div>
              <CardTitle className="text-base">Disable Two-Factor Authentication</CardTitle>
              <CardDescription>
                Enter your authenticator code to confirm disabling 2FA.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="disable-code" className="text-sm font-medium">
              Verification code
            </label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="destructive"
              disabled={isLoading || disableCode.length !== 6}
              onClick={handleDisable}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Disable 2FA'
              )}
            </Button>
            <Button variant="outline" onClick={handleCancelDisable} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Setup flow (QR code visible) ───────────────────────────────────────────
  if (setupData) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-amber-500" />
            <div>
              <CardTitle className="text-base">Set Up Two-Factor Authentication</CardTitle>
              <CardDescription>
                Scan the QR code with your authenticator app, then enter the verification code.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="rounded-lg border bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={setupData.qrCodeUrl}
                alt="Two-factor authentication QR code"
                width={256}
                height={256}
              />
            </div>
          </div>

          {/* Manual entry key */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Or enter this key manually in your authenticator app:
            </p>
            <code className="block rounded-md border bg-muted px-4 py-2 text-sm font-mono break-all select-all">
              {setupData.secret}
            </code>
          </div>

          {/* Verification code input */}
          <div className="space-y-2">
            <label htmlFor="verify-code" className="text-sm font-medium">
              Verification code
            </label>
            <Input
              id="verify-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </div>

          <div className="flex gap-3">
            <Button
              disabled={isLoading || verifyCode.length !== 6}
              onClick={handleVerify}
              className="bg-amber-500 text-white hover:bg-amber-600"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Enable'
              )}
            </Button>
            <Button variant="outline" onClick={handleCancelSetup} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Default: 2FA not enabled, show enable button ──────────────────────────
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account using an authenticator app.
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline">Disabled</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {success}
          </div>
        )}
        <Button
          disabled={isLoading}
          onClick={handleStartSetup}
          className="bg-amber-500 text-white hover:bg-amber-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Setting up...
            </>
          ) : (
            'Enable Two-Factor Authentication'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
