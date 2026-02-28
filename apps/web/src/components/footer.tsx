import Link from 'next/link';
import { Flame, Github, ExternalLink, Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded fire-gradient" aria-hidden="true">
                <Flame className="size-3.5 text-white" />
              </span>
              <span className="font-bold tracking-wider text-foreground">FIREVECTOR</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Open-source wildfire observation intelligence platform. Digitizing the NWCG fire
              behavior observation form with real-time derived calculations.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://github.com/bgorzelic/firevector"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-amber-500"
                >
                  <Github className="size-3.5" />
                  GitHub Repository
                  <ExternalLink className="size-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bgorzelic/firevector/blob/main/docs/architecture.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-amber-500"
                >
                  Documentation
                  <ExternalLink className="size-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bgorzelic/firevector/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-amber-500"
                >
                  Report an Issue
                  <ExternalLink className="size-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-amber-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-amber-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="size-3.5 text-green-500" />
                  WCAG 2.1 AA Compliant
                </span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <p className="text-xs text-muted-foreground">Brian Gorzelic</p>
              </li>
              <li>
                <a
                  href="https://aiaerialsolutions.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-500 transition-colors hover:text-amber-400"
                >
                  AI Aerial Solutions
                  <ExternalLink className="size-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:bgorzelic@gmail.com"
                  className="text-xs text-muted-foreground transition-colors hover:text-amber-500"
                >
                  bgorzelic@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/bgorzelic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-amber-500"
                >
                  <Github className="size-3.5" />
                  @bgorzelic
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Aerial Solutions. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for Cal OES and the firefighting community &bull; MIT License
          </p>
        </div>
      </div>
    </footer>
  );
}
