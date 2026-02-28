import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Firevector',
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl py-4">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

      <div className="mt-8 space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            By accessing or using Firevector (&ldquo;the Service&rdquo;), you agree to be bound by
            these Terms of Service. If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">2. Description of Service</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            Firevector is an open-source wildfire observation tool that digitizes the NWCG fire
            behavior observation form and computes derived fire behavior metrics. The Service is
            provided by AI Aerial Solutions as a tool for the firefighting community.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">3. Account Registration</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            To use the Service, you must create an account using either email/password credentials
            or Google OAuth. You agree to provide accurate, current, and complete information during
            registration and to update such information as necessary. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities that
            occur under your account. You must notify us immediately of any unauthorized use of
            your account.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">4. Disclaimer</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3 font-medium text-foreground">
            FIREVECTOR IS A DATA COLLECTION AND CALCULATION TOOL ONLY. IT IS NOT A SUBSTITUTE FOR
            PROFESSIONAL FIRE BEHAVIOR ANALYSIS, DISPATCH SYSTEMS, OR OFFICIAL INCIDENT MANAGEMENT.
          </p>
          <p className="mt-3">
            The Service is provided &ldquo;as is&rdquo; without warranty of any kind. Derived
            calculations (EWS, EWS Ratio, Projected ROS) are based on the NWCG methodology but
            should always be verified by qualified fire behavior analysts before making operational
            decisions.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">5. User Responsibilities</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <ul className="mt-3 list-disc space-y-1.5 pl-6">
            <li>You are responsible for the accuracy of observation data you submit</li>
            <li>You must not rely solely on Firevector for life-safety decisions</li>
            <li>You must comply with all applicable laws and regulations</li>
            <li>You must not use the Service for any unlawful purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">6. Data Ownership</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            You retain ownership of all observation data you submit to Firevector. By using the
            Service, you grant us a limited license to store, process, and display your data solely
            for the purpose of providing the Service to you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">7. Account Termination</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            You may request deletion of your account at any time by contacting us. We reserve the
            right to suspend or terminate your account if you violate these Terms or engage in
            conduct that is harmful to the Service or other users. Upon termination, your data
            will be handled in accordance with our Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">8. Open Source</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
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
          <h2 className="text-base font-semibold text-foreground">9. Limitation of Liability</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            To the maximum extent permitted by law, AI Aerial Solutions and its contributors shall
            not be liable for any indirect, incidental, special, consequential, or punitive damages
            arising from your use of the Service, including but not limited to damages for loss of
            data, use, or profits.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">10. Modifications</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            We reserve the right to modify these Terms at any time. Changes will be posted on this
            page with an updated revision date. Continued use of the Service after changes
            constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">11. Governing Law</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            These Terms shall be governed by and construed in accordance with the laws of the State
            of California, United States, without regard to its conflict of law provisions. Any
            disputes arising under these Terms shall be subject to the exclusive jurisdiction of the
            courts located in the State of California.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">12. Severability</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            If any provision of these Terms is held to be unenforceable or invalid, that provision
            shall be modified to the minimum extent necessary to make it enforceable, and the
            remaining provisions shall continue in full force and effect.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">13. Entire Agreement</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
            These Terms, together with the Privacy Policy, constitute the entire agreement between
            you and AI Aerial Solutions regarding your use of the Service and supersede all prior
            agreements, understandings, and communications, whether written or oral.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground">14. Contact</h2>
          <div className="mt-1 h-px bg-border" aria-hidden="true" />
          <p className="mt-3">
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
