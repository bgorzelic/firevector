import type { Metadata } from 'next';
import { Flame, Wind, Gauge, Shield, MapPin, BarChart3, Satellite, Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentation — Firevector',
};

function Card({ icon: Icon, title, children, color }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex size-9 items-center justify-center rounded-lg bg-muted ${color}`}>
          <Icon className="size-5" />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl py-4">
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="mt-2 text-muted-foreground">
          Comprehensive guide to the Firevector wildfire observation platform.
        </p>
      </div>

      {/* About */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">About Firevector</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Firevector is a full-stack wildfire observation platform that digitizes the{' '}
          <strong className="text-foreground">NWCG fire behavior observation form</strong> and
          computes derived fire behavior metrics in real time. It was designed and built for{' '}
          <strong className="text-foreground">Cal OES</strong> and the firefighting community as
          a free, open-source tool to modernize field data collection and fire behavior analysis.
        </p>
        <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm text-amber-600 dark:text-amber-400">
            <strong>Open Source:</strong> Firevector is released under the MIT License. It is free
            to use, modify, and distribute. The complete source code is available on{' '}
            <a
              href="https://github.com/bgorzelic/firevector"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">Core Concepts</h2>
        <p className="mt-3 mb-5 text-sm text-muted-foreground">
          Understanding the key fire behavior metrics that Firevector calculates.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card icon={Wind} title="Effective Wind Speed (EWS)" color="text-cyan-500">
            <p>
              EWS combines midflame wind speed with slope contribution to represent the total wind
              effect on fire spread. Calculated as:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                EWS = midflame_ws + slope_contribution
              </code>
            </p>
          </Card>

          <Card icon={BarChart3} title="EWS Ratio" color="text-purple-500">
            <p>
              The ratio of maximum to minimum EWS between observed and predicted values. Indicates
              whether fire behavior is aligning with predictions. A ratio of 1.0 means
              observed matches predicted exactly.
            </p>
          </Card>

          <Card icon={Gauge} title="Rate of Spread (ROS)" color="text-orange-500">
            <p>
              Projected ROS is computed from observed ROS and the EWS ratio. If fire is spreading
              <em> faster</em> than predicted, ROS is multiplied by the ratio. If <em>slower</em>,
              it is divided.
            </p>
          </Card>

          <Card icon={Shield} title="LCES Safety Checklist" color="text-green-500">
            <p>
              The four elements of the LCES safety protocol: <strong>L</strong>ookouts,{' '}
              <strong>C</strong>ommunications, <strong>E</strong>scape routes, and{' '}
              <strong>S</strong>afety zones. All four must be confirmed before field engagement.
            </p>
          </Card>
        </div>
      </section>

      {/* Observation Workflow */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">Observation Workflow</h2>
        <div className="mt-5 space-y-4">
          <Step number={1} title="Create a New Observation">
            Navigate to <strong>New Observation</strong> from the sidebar. The guided walkthrough
            will introduce each section of the form on your first visit.
          </Step>
          <Step number={2} title="Fill in Incident Details">
            Enter the incident name, your observer name, date/time, and GPS coordinates. Use the
            location picker or enter coordinates manually.
          </Step>
          <Step number={3} title="Record Environmental Conditions">
            Document relative humidity and fuel types present at the observation point — litter,
            grass, and/or crown fuels.
          </Step>
          <Step number={4} title="Enter Wind & Slope Data">
            Input both observed and predicted wind speeds (eye-level and midflame) along with slope
            contribution. The EWS and EWS Ratio are computed automatically as you type.
          </Step>
          <Step number={5} title="Record Rate of Spread">
            Enter the observed rate of spread and direction. The projected ROS is calculated in real
            time from the EWS ratio.
          </Step>
          <Step number={6} title="Add Observation Log Entries">
            Create timestamped log entries to document fire behavior changes, weather shifts, and
            operational notes throughout the observation period.
          </Step>
          <Step number={7} title="Complete LCES Safety Check">
            Confirm all four safety elements are in place. An observation cannot be marked complete
            until the LCES checklist is fully verified.
          </Step>
          <Step number={8} title="Save or Complete">
            Save as a <strong>draft</strong> to continue later, or <strong>mark complete</strong> to
            finalize the observation. Completed observations appear in your dashboard with full
            calculated metrics.
          </Step>
        </div>
      </section>

      {/* Hazard Map */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">Hazard Map</h2>
        <p className="mt-3 mb-5 text-sm text-muted-foreground">
          The dashboard includes a multi-layer hazard map with real-time data overlays.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card icon={MapPin} title="Observation Pins" color="text-amber-500">
            Your fire behavior observations are plotted as interactive orange pins. Click any pin to
            view the EWS Ratio and Projected ROS.
          </Card>
          <Card icon={Flame} title="NASA FIRMS Fire Hotspots" color="text-red-500">
            Live satellite fire detections from NASA&apos;s VIIRS instrument, updated every 24 hours.
            Displayed as a heatmap at low zoom and individual points at high zoom, colored by fire
            radiative power (FRP).
          </Card>
          <Card icon={Wind} title="Weather Overlay" color="text-blue-500">
            Real-time temperature data from OpenWeatherMap displayed as a transparent tile overlay on
            the map.
          </Card>
          <Card icon={Activity} title="Earthquake Data" color="text-yellow-500">
            USGS earthquake detections (M2.5+) from the past 7 days. Circle size and color indicate
            magnitude.
          </Card>
          <Card icon={Satellite} title="Map Styles" color="text-indigo-500">
            Switch between Dark, Satellite (with 3D terrain), and Topographic views. Satellite and
            topo modes include terrain elevation for a three-dimensional perspective.
          </Card>
        </div>
      </section>

      {/* Data Sources */}
      <section className="mb-10">
        <h2 className="text-xl font-bold">Data Sources</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-foreground">Source</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground">Data</th>
                <th className="px-4 py-2.5 text-left font-medium text-foreground">Update Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-4 py-2.5 text-muted-foreground">NASA FIRMS (VIIRS)</td>
                <td className="px-4 py-2.5 text-muted-foreground">Satellite fire detections</td>
                <td className="px-4 py-2.5 text-muted-foreground">Every 3 hours</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-muted-foreground">USGS Earthquake Hazards</td>
                <td className="px-4 py-2.5 text-muted-foreground">Seismic events M2.5+</td>
                <td className="px-4 py-2.5 text-muted-foreground">Every 5 minutes</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-muted-foreground">OpenWeatherMap</td>
                <td className="px-4 py-2.5 text-muted-foreground">Temperature tiles</td>
                <td className="px-4 py-2.5 text-muted-foreground">Every 10 minutes</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-muted-foreground">Mapbox</td>
                <td className="px-4 py-2.5 text-muted-foreground">Map tiles, terrain DEM</td>
                <td className="px-4 py-2.5 text-muted-foreground">Continuous</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Attribution */}
      <section className="rounded-lg border border-border bg-card/50 p-6">
        <h2 className="text-lg font-bold">Attribution</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Firevector was designed and developed by{' '}
          <strong className="text-foreground">Brian Gorzelic</strong> of{' '}
          <a
            href="https://aiaerialsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 underline underline-offset-2"
          >
            AI Aerial Solutions
          </a>
          . Built for <strong className="text-foreground">Cal OES</strong> and the firefighting
          community. Released as free, open-source software under the MIT License.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          For support, feature requests, or contributions, visit the{' '}
          <a
            href="https://github.com/bgorzelic/firevector"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-500 underline underline-offset-2"
          >
            GitHub repository
          </a>{' '}
          or contact{' '}
          <a href="mailto:bgorzelic@gmail.com" className="text-amber-500 underline underline-offset-2">
            bgorzelic@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-sm font-bold text-amber-500">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
