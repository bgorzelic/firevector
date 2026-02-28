import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Firevector',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

      <div className="mt-8 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Introduction</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Firevector (&ldquo;the Service&rdquo;) is an open-source wildfire observation platform
            operated by AI Aerial Solutions (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;).
            This Privacy Policy explains how we collect, use, and protect your information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Information We Collect</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Account information (email/password):</strong> When you register with email
              and password, we store your name, email address, and a securely hashed password. We
              never store plaintext passwords.
            </li>
            <li>
              <strong>Account information (Google OAuth):</strong> When you sign in with Google
              OAuth, we receive your name, email address, and profile picture. We do not access
              your Google password.
            </li>
            <li>
              <strong>Observation data:</strong> Fire behavior observations you submit, including
              location coordinates, weather conditions, and field notes.
            </li>
            <li>
              <strong>Session data:</strong> Authentication tokens to maintain your login session.
            </li>
            <li>
              <strong>Analytics data:</strong> We use Google Analytics to collect anonymous usage
              data such as page views, session duration, and general device/browser information.
              This data is aggregated and cannot identify individual users.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. How We Use Your Information</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>To authenticate and maintain your user session</li>
            <li>To store and retrieve your fire behavior observations</li>
            <li>To compute derived fire behavior metrics (EWS, ROS calculations)</li>
            <li>To display observation locations on the map</li>
            <li>To analyze aggregate usage patterns and improve the Service</li>
          </ul>
          <p className="mt-3">
            We do <strong>not</strong> sell, share, or distribute your personal information to third
            parties for marketing purposes. We do <strong>not</strong> use advertising networks.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Data Storage</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Your data is stored in a PostgreSQL database hosted by Supabase (AWS us-east-1). All
            connections are encrypted via TLS. The application is hosted on Vercel&apos;s global edge
            network with HTTPS enforced.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Data Retention</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            We retain your account data and observation records for as long as your account is
            active. If you request account deletion, we will permanently remove all your personal
            data and observation records within 30 days of your request. Anonymized, aggregated
            analytics data may be retained indefinitely.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Third-Party Services</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li><strong>Google OAuth:</strong> Authentication provider (Google Privacy Policy applies)</li>
            <li><strong>Google Analytics:</strong> Anonymous usage analytics (Google Privacy Policy applies)</li>
            <li><strong>Resend:</strong> Transactional email delivery for verification and password reset emails (Resend Privacy Policy applies)</li>
            <li><strong>Mapbox:</strong> Map tile rendering (Mapbox Privacy Policy applies)</li>
            <li><strong>NASA FIRMS:</strong> Satellite fire detection data (public government data)</li>
            <li><strong>USGS:</strong> Earthquake data (public government data)</li>
            <li><strong>OpenWeatherMap:</strong> Weather overlay tiles (OpenWeatherMap Privacy Policy applies)</li>
            <li><strong>Supabase:</strong> Database hosting (Supabase Privacy Policy applies)</li>
            <li><strong>Vercel:</strong> Application hosting (Vercel Privacy Policy applies)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Cookies</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Firevector uses essential cookies required for authentication session management and
            user preference storage (theme, cookie consent). Google Analytics uses cookies to
            collect anonymous usage data. You can opt out of analytics cookies through our cookie
            consent banner.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">8. Children&apos;s Privacy</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Firevector is not intended for use by individuals under the age of 18. We do not
            knowingly collect personal information from children. If we become aware that we have
            collected data from a user under 18, we will take steps to delete that information
            promptly. If you believe a child has provided us with personal data, please contact
            us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">9. International Data Transfers</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Your data is processed and stored in the United States. If you are accessing the
            Service from outside the United States, please be aware that your data will be
            transferred to, stored, and processed in the United States. By using the Service, you
            consent to this transfer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">10. Your Rights</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
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
          <h2 className="text-base font-semibold text-foreground">11. Changes to This Policy</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated revision date. We encourage you to review this policy
            periodically. Continued use of the Service after changes constitutes acceptance of the
            updated Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">12. Contact</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
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
