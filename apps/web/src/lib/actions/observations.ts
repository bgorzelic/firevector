'use server';

import { db } from '@/lib/db';
import { observations } from '@/lib/db/schema';
import { desc, eq, count, and } from 'drizzle-orm';

export async function getObservations(userId: string) {
  return db
    .select()
    .from(observations)
    .where(eq(observations.userId, userId))
    .orderBy(desc(observations.updatedAt));
}

export async function getObservationStats(userId: string) {
  const [allResult, draftsResult, completedResult] = await Promise.all([
    db
      .select({ count: count() })
      .from(observations)
      .where(eq(observations.userId, userId)),
    db
      .select({ count: count() })
      .from(observations)
      .where(and(eq(observations.userId, userId), eq(observations.status, 'draft'))),
    db
      .select({ count: count() })
      .from(observations)
      .where(and(eq(observations.userId, userId), eq(observations.status, 'complete'))),
  ]);

  return {
    total: allResult[0]?.count ?? 0,
    drafts: draftsResult[0]?.count ?? 0,
    completed: completedResult[0]?.count ?? 0,
  };
}
