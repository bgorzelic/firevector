'use server';

import { db } from '@/lib/db';
import { users, emailVerificationTokens, passwordResetTokens } from '@/lib/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '@/lib/email';

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { name, email, password } = parsed.data;

  const existing = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  if (existing) {
    if (existing.passwordHash) {
      return { success: false, error: 'An account with this email already exists' };
    }
    // OAuth user without password — allow setting one
    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ passwordHash, name, updatedAt: new Date() })
      .where(eq(users.id, existing.id));

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await db.insert(emailVerificationTokens).values({
      userId: existing.id,
      token,
      expires,
    });

    await sendVerificationEmail(email, name, token);
    return { success: true };
  }

  // New user
  const passwordHash = await bcrypt.hash(password, 12);
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      name,
      passwordHash,
    })
    .returning({ id: users.id });

  // Generate verification token
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.insert(emailVerificationTokens).values({
    userId: newUser.id,
    token,
    expires,
  });

  await sendVerificationEmail(email, name, token);
  return { success: true };
}

export async function verifyEmail(token: string): Promise<ActionResult> {
  if (!token) {
    return { success: false, error: 'Missing verification token' };
  }

  const record = await db
    .select()
    .from(emailVerificationTokens)
    .where(eq(emailVerificationTokens.token, token))
    .then((rows) => rows[0]);

  if (!record) {
    return { success: false, error: 'Invalid verification token' };
  }

  if (record.expires < new Date()) {
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, record.id));
    return { success: false, error: 'Verification token has expired' };
  }

  // Mark email as verified
  await db
    .update(users)
    .set({ emailVerified: new Date(), updatedAt: new Date() })
    .where(eq(users.id, record.userId));

  // Delete the used token
  await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, record.id));

  // Send welcome email
  const user = await db
    .select({ name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, record.userId))
    .then((rows) => rows[0]);

  if (user) {
    await sendWelcomeEmail(user.email, user.name ?? 'there');
  }

  return { success: true };
}

export async function resendVerificationEmail(email: string): Promise<ActionResult> {
  const user = await db
    .select({ id: users.id, name: users.name, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  if (!user || user.emailVerified) {
    // Don't leak whether the email exists
    return { success: true };
  }

  // Rate limit: check if a token was created in the last 5 minutes
  const recent = await db
    .select()
    .from(emailVerificationTokens)
    .where(
      and(
        eq(emailVerificationTokens.userId, user.id),
        gt(emailVerificationTokens.createdAt, new Date(Date.now() - 5 * 60 * 1000))
      )
    )
    .then((rows) => rows[0]);

  if (recent) {
    return { success: true }; // Silently succeed to prevent timing attacks
  }

  // Delete old tokens for this user
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.userId, user.id));

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await db.insert(emailVerificationTokens).values({
    userId: user.id,
    token,
    expires,
  });

  await sendVerificationEmail(email, user.name ?? 'there', token);
  return { success: true };
}

export async function requestPasswordReset(formData: {
  email: string;
}): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Invalid email address' };
  }

  const { email } = parsed.data;

  const user = await db
    .select({ id: users.id, name: users.name, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  // Always return success to not leak email existence
  if (!user) {
    return { success: true };
  }

  // Rate limit: check if a token was created in the last 5 minutes
  const recent = await db
    .select()
    .from(passwordResetTokens)
    .where(
      and(
        eq(passwordResetTokens.userId, user.id),
        gt(passwordResetTokens.createdAt, new Date(Date.now() - 5 * 60 * 1000))
      )
    )
    .then((rows) => rows[0]);

  if (recent) {
    return { success: true };
  }

  // Delete old tokens
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await db.insert(passwordResetTokens).values({
    userId: user.id,
    token,
    expires,
  });

  await sendPasswordResetEmail(email, user.name ?? 'there', token);
  return { success: true };
}

export async function checkTwoFactorStatus(
  email: string,
  password: string
): Promise<{ twoFactorRequired: boolean; error?: string }> {
  const user = await db
    .select({
      id: users.id,
      passwordHash: users.passwordHash,
      emailVerified: users.emailVerified,
      twoFactorEnabled: users.twoFactorEnabled,
    })
    .from(users)
    .where(eq(users.email, email))
    .then((rows) => rows[0]);

  if (!user || !user.passwordHash) {
    return { twoFactorRequired: false, error: 'Invalid email or password' };
  }

  if (!user.emailVerified) {
    return { twoFactorRequired: false, error: 'Please verify your email before signing in.' };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { twoFactorRequired: false, error: 'Invalid email or password' };
  }

  return { twoFactorRequired: user.twoFactorEnabled };
}

export async function resetPassword(
  token: string,
  formData: { password: string; confirmPassword: string }
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const record = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .then((rows) => rows[0]);

  if (!record) {
    return { success: false, error: 'Invalid or expired reset token' };
  }

  if (record.expires < new Date()) {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, record.id));
    return { success: false, error: 'Reset token has expired' };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, record.userId));

  // Delete the used token
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, record.id));

  return { success: true };
}
