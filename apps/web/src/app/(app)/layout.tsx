import type { ReactNode } from 'react';
import { AppHeader } from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { Footer } from '@/components/footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content — visually hidden until focused */}
      <a href="#main-content" className="skip-nav-link">
        Skip to main content
      </a>

      {/* Fire gradient accent bar */}
      <div className="h-1 w-full fire-gradient" aria-hidden="true" />

      {/* Header */}
      <AppHeader />

      {/* Body: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />

        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile bottom nav */}
      <MobileNav />
    </div>
  );
}
