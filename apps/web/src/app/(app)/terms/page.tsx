import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Firevector',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing or using Firevector (&ldquo;the Service&rdquo;), you agree to be bound by
            these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Description of Service</h2>
          <p className="mt-2">
            Firevector is an open-source wildfire observation tool that digitizes the NWCG fire
            behavior observation form and computes derived fire behavior metrics. The Service is
            provided by AI Aerial Solutions as a tool for the firefighting community.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Disclaimer</h2>
          <p className="mt-2 font-medium text-foreground">
            FIREVECTOR IS A DATA COLLECTION AND CALCULATION TOOL ONLY. IT IS NOT A SUBSTITUTE FOR
            PROFESSIONAL FIRE BEHAVIOR ANALYSIS, DISPATCH SYSTEMS, OR OFFICIAL INCIDENT MANAGEMENT.
          </p>
          <p className="mt-2">
            The Service is provided &ldquo;as is&rdquo; without warranty of any kind. Derived
            calculations (EWS, EWS Ratio, Projected ROS) are based on the NWCG methodology but
            should always be verified by qualified fire behavior analysts before making operational
            decisions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. User Responsibilities</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>You are responsible for the accuracy of observation data you submit</li>
            <li>You must not rely solely on Firevector for life-safety decisions</li>
            <li>You must comply with all applicable laws and regulations</li>
            <li>You must not use the Service for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. Data Ownership</h2>
          <p className="mt-2">
            You retain ownership of all observation data you submit to Firevector. By using the
            Service, you grant us a limited license to store, process, and display your data solely
            for the purpose of providing the Service to you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Open Source</h2>
          <p className="mt-2">
            Firevector is open-source software released under the MIT License. The source code is
            available at{' '}
            <a
              href="https://github.com/bgorzelic/firevector"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 underline underline-offset-2"
            >
              github.com/bgorzelic/firevector
            </a>
            . You are free to use, modify, and distribute the code in accordance with the MIT
            License.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, AI Aerial Solutions and its contributors shall
            not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the Service, including but not limited to damages for loss of
            data, use, or profits.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">8. Modifications</h2>
          <p className="mt-2">
            We reserve the right to modify these Terms at any time. Changes will be posted on this
            page with an updated revision date. Continued use of the Service after changes
            constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">9. Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact Brian Gorzelic at{' '}
            <a href="mailto:bgorzelic@gmail.com" className="text-amber-500 underline underline-offset-2">
              bgorzelic@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
