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
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-40 flex md:hidden border-t border-border bg-card"
    >
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? 'page' : undefined}
            aria-label={label}
            className={cn(
              // min 44px touch target per WCAG 2.5.5
              'flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] py-3 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              isActive
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0',
                isActive
                  ? 'text-amber-500 dark:text-amber-400'
                  : 'text-muted-foreground'
              )}
            />
            <span className="leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
