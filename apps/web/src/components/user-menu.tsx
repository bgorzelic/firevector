'use client';

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings } from 'lucide-react';
import Link from 'next/link';

function getInitials(name: string | null | undefined): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function UserMenu() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {user?.image ? (
          <button
            className="flex size-9 items-center justify-center rounded-full ring-offset-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-hidden"
            aria-label={`User menu for ${user.name ?? 'user'}`}
            aria-haspopup="menu"
          >
            <Image
              src={user.image}
              alt={user.name ?? 'User avatar'}
              width={36}
              height={36}
              className="size-9 rounded-full"
              referrerPolicy="no-referrer"
            />
          </button>
        ) : (
          <button
            className="flex size-9 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white ring-offset-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`User menu for ${user?.name ?? 'user'}`}
            aria-haspopup="menu"
          >
            <span aria-hidden="true">{getInitials(user?.name)}</span>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="font-semibold">{user?.name ?? 'User'}</span>
          <span className="text-xs font-normal text-muted-foreground">{user?.email ?? ''}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="size-4" aria-hidden="true" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
