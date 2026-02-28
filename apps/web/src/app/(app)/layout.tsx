import type { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { MobileNav } from '@/components/mobile-nav';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Fire gradient accent bar */}
      <div className="h-1 w-full fire-gradient" />

      {/* Header */}
      <AppHeader />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
