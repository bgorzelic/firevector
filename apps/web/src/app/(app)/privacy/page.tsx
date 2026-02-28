import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Firevector',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Introduction</h2>
          <p className="mt-2">
            Firevector (&ldquo;the Service&rdquo;) is an open-source wildfire observation platform
            operated by AI Aerial Solutions (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
            This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Information We Collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>
              <strong>Account information:</strong> When you sign in with Google OAuth, we receive
              your name, email address, and profile picture. We do not access your Google password.
            </li>
            <li>
              <strong>Observation data:</strong> Fire behavior observations you submit, including
              location coordinates, weather conditions, and field notes.
            </li>
            <li>
              <strong>Session data:</strong> Authentication tokens to maintain your login session.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. How We Use Your Information</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>To authenticate and maintain your user session</li>
            <li>To store and retrieve your fire behavior observations</li>
            <li>To compute derived fire behavior metrics (EWS, ROS calculations)</li>
            <li>To display observation locations on the map</li>
          </ul>
          <p className="mt-2">
            We do <strong>not</strong> sell, share, or distribute your personal information to third
            parties. We do <strong>not</strong> use tracking cookies, analytics services, or
            advertising networks.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Data Storage</h2>
          <p className="mt-2">
            Your data is stored in a PostgreSQL database hosted by Supabase (AWS us-east-1). All
            connections are encrypted via TLS. The application is hosted on Vercel&apos;s global edge
            network with HTTPS enforced.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Third-Party Services</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li><strong>Google OAuth:</strong> Authentication provider (Google Privacy Policy applies)</li>
            <li><strong>Mapbox:</strong> Map tile rendering (Mapbox Privacy Policy applies)</li>
            <li><strong>NASA FIRMS:</strong> Satellite fire detection data (public government data)</li>
            <li><strong>USGS:</strong> Earthquake data (public government data)</li>
            <li><strong>OpenWeatherMap:</strong> Weather overlay tiles (OpenWeatherMap Privacy Policy applies)</li>
            <li><strong>Supabase:</strong> Database hosting (Supabase Privacy Policy applies)</li>
            <li><strong>Vercel:</strong> Application hosting (Vercel Privacy Policy applies)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Cookies</h2>
          <p className="mt-2">
            Firevector uses only essential cookies required for authentication session management and
            user preference storage (theme, cookie consent). We do not use tracking, analytics, or
            advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Your Rights</h2>
          <p className="mt-2">
            You may request deletion of your account and all associated data at any time by
            contacting us at{' '}
            <a href="mailto:bgorzelic@gmail.com" className="text-amber-500 underline underline-offset-2">
              bgorzelic@gmail.com
            </a>
            . As an open-source project, you can also inspect exactly what data is collected by
            reviewing the{' '}
            <a
              href="https://github.com/bgorzelic/firevector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-2"
            >
              source code
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">8. Contact</h2>
          <p className="mt-2">
            For privacy inquiries, contact Brian Gorzelic at{' '}
            <a href="mailto:bgorzelic@gmail.com" className="text-amber-500 underline underline-offset-2">
              bgorzelic@gmail.com
            </a>
            {' '}or visit{' '}
            <a
              href="https://aiaerialsolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-2"
            >
              aiaerialsolutions.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
