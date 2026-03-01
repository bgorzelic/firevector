'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, User } from 'lucide-react';
import { updateProfile } from '@/lib/actions/profile';

type ProfileFormProps = {
  firstName: string;
  lastName: string;
  email: string;
};

export function ProfileForm({ firstName: initialFirst, lastName: initialLast, email }: ProfileFormProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(initialFirst);
  const [lastName, setLastName] = useState(initialLast);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const hasChanges = firstName !== initialFirst || lastName !== initialLast;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const result = await updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() });
      if (result.success) {
        setSuccess('Profile updated.');
        router.refresh();
      } else {
        setError(result.error ?? 'Failed to update profile.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="size-5 text-muted-foreground" />
          <div>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>
              Your personal information.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label htmlFor="first-name" className="text-sm font-medium">
                First name
              </label>
              <Input
                id="first-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="last-name" className="text-sm font-medium">
                Last name
              </label>
              <Input
                id="last-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Smith"
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              value={email}
              disabled
              className="bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !hasChanges}
            className="bg-amber-500 text-white hover:bg-amber-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
