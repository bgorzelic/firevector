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
    label: 'New Obs',
    href: '/observations/new',
    icon: Plus,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex md:hidden border-t border-border bg-card">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-medium transition-colors',
              isActive
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon
              className={cn(
                'size-5 shrink-0',
                isActive
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-muted-foreground'
              )}
            />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
