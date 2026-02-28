'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'New Observation',
    href: '/observations/new',
    icon: Plus,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <nav className="flex flex-col gap-1 p-3 pt-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/15 dark:text-amber-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  isActive
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-muted-foreground'
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
