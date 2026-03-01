import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/components/settings/profile-form';
import { TwoFactorSetup } from '@/components/settings/two-factor-setup';

export const metadata: Metadata = {
  title: 'Settings — Firevector',
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const user = await db
    .select({
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      twoFactorEnabled: users.twoFactorEnabled,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .then((rows) => rows[0]);

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and security preferences.
        </p>
      </div>

      {/* Profile */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Update your personal information.
          </p>
        </div>
        <ProfileForm
          firstName={user.firstName ?? ''}
          lastName={user.lastName ?? ''}
          email={user.email}
        />
      </section>

      <Separator />

      {/* Security */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground">
            Configure security options for your account.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            Two-Factor Authentication
          </h3>
          <TwoFactorSetup twoFactorEnabled={user.twoFactorEnabled} />
        </div>
      </section>
    </div>
  );
}
