'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { generateTOTPSecret, verifyTOTPCode, generateQRCodeDataURL } from '@/lib/two-factor';

type ActionResult = {
  success: boolean;
  error?: string;
};

type SetupResult = {
  success: boolean;
  secret?: string;
  qrCodeUrl?: string;
  error?: string;
};

export async function setupTwoFactor(): Promise<SetupResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const user = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  const { secret, uri } = generateTOTPSecret(user.email);
  const qrCodeUrl = await generateQRCodeDataURL(uri);

  // Store the secret in the DB (twoFactorEnabled remains false until verified)
  await db
    .update(users)
    .set({ twoFactorSecret: secret, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return { success: true, secret, qrCodeUrl };
}

export async function enableTwoFactor(code: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const user = await db
    .select({ twoFactorSecret: users.twoFactorSecret })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user?.twoFactorSecret) {
    return { success: false, error: 'Two-factor setup not started. Please start setup first.' };
  }

  const isValid = verifyTOTPCode(user.twoFactorSecret, code);
  if (!isValid) {
    return { success: false, error: 'Invalid verification code. Please try again.' };
  }

  await db
    .update(users)
    .set({ twoFactorEnabled: true, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return { success: true };
}

export async function disableTwoFactor(code: string): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const user = await db
    .select({ twoFactorSecret: users.twoFactorSecret, twoFactorEnabled: users.twoFactorEnabled })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: 'Two-factor authentication is not enabled.' };
  }

  const isValid = verifyTOTPCode(user.twoFactorSecret, code);
  if (!isValid) {
    return { success: false, error: 'Invalid verification code. Please try again.' };
  }

  await db
    .update(users)
    .set({ twoFactorEnabled: false, twoFactorSecret: null, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return { success: true };
}

export async function verifyTwoFactorLogin(
  email: string,
  code: string
): Promise<ActionResult> {
  if (!email || !code) {
    return { success: false, error: 'Email and code are required.' };
  }

  const user = await db
    .select({
      twoFactorSecret: users.twoFactorSecret,
      twoFactorEnabled: users.twoFactorEnabled,
    })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return { success: false, error: 'Two-factor authentication is not enabled for this account.' };
  }

  const isValid = verifyTOTPCode(user.twoFactorSecret, code);
  if (!isValid) {
    return { success: false, error: 'Invalid verification code. Please try again.' };
  }

  return { success: true };
}
