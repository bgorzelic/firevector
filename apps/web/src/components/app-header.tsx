'use client';

import Link from 'next/link';
import { Menu, Flame, LayoutDashboard, Plus, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

function MobileSheetNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex flex-col gap-1 p-3">
      {navItems.map(({ label, href, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <SheetClose asChild key={href}>
            <Link
              href={href}
              onClick={onClose}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                isActive
                  ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/15 dark:text-amber-400'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
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
              {label}
            </Link>
          </SheetClose>
        );
      })}
    </nav>
  );
}

export function AppHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4">
      {/* Mobile hamburger wrapped in SheetTrigger so it properly controls the Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-sheet"
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent id="mobile-nav-sheet" side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-border px-4 py-4">
            <SheetTitle className="flex items-center gap-2">
              <span
                className="flex size-6 items-center justify-center rounded fire-gradient"
                aria-hidden="true"
              >
                <Flame className="size-3.5 text-white" />
              </span>
              <span className="font-bold tracking-wider text-foreground">FIREVECTOR</span>
            </SheetTitle>
          </SheetHeader>
          <MobileSheetNav onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-sm"
        aria-label="Firevector — go to dashboard"
      >
        <span
          className="flex size-7 items-center justify-center rounded fire-gradient"
          aria-hidden="true"
        >
          <Flame className="size-4 text-white" />
        </span>
        <span className="hidden font-bold tracking-wider sm:block">FIREVECTOR</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" aria-hidden="true" />

      {/* Right controls */}
      <ThemeToggle />
      <UserMenu />
    </header>
  );
}
