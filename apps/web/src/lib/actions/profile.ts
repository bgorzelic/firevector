'use server';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
});

type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateProfile(formData: {
  firstName: string;
  lastName: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const { firstName, lastName } = parsed.data;
  const name = `${firstName} ${lastName}`.trim();

  await db
    .update(users)
    .set({ firstName, lastName, name, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return { success: true };
}
