'use client';

import { useState, useEffect } from 'react';
import { Flame, MapPin, Wind, Gauge, FileText, Shield, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GUIDE_KEY = 'firevector-form-guide-dismissed';

const steps = [
  {
    icon: Flame,
    title: 'Welcome to Firevector',
    description:
      'This form digitizes the NWCG fire behavior observation form. It computes derived fire metrics in real time as you enter data. You can save drafts and complete observations later.',
    color: 'text-amber-500',
  },
  {
    icon: MapPin,
    title: '1. Incident Overview',
    description:
      'Start with the incident name, your name as observer, date/time, and GPS coordinates. You can click the map to set the location or enter coordinates manually.',
    color: 'text-blue-500',
  },
  {
    icon: Wind,
    title: '2. Wind & Slope',
    description:
      'Enter observed and predicted wind speeds (eye-level and midflame) plus slope contribution. The Effective Wind Speed (EWS) and EWS Ratio are calculated automatically.',
    color: 'text-cyan-500',
  },
  {
    icon: Gauge,
    title: '3. Rate of Spread',
    description:
      'Enter the observed rate of spread and whether fire is moving faster or slower than predicted. The projected ROS is computed from the EWS ratio.',
    color: 'text-orange-500',
  },
  {
    icon: FileText,
    title: '4. Observation Log',
    description:
      'Add timestamped log entries to record fire behavior changes and weather trends over time. Each entry captures the time, behavior notes, and conditions.',
    color: 'text-purple-500',
  },
  {
    icon: Shield,
    title: '5. Safety — LCES',
    description:
      'Confirm all four LCES elements: Lookouts posted, Communications established, Escape routes identified, and Safety zones designated. All four must be checked to mark the observation complete.',
    color: 'text-green-500',
  },
];

export function FormGuideDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem(GUIDE_KEY);
    if (!dismissed) setOpen(true);
  }, []);

  function dismiss(permanent: boolean) {
    if (permanent) localStorage.setItem(GUIDE_KEY, 'true');
    setOpen(false);
  }

  if (!open) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        role="dialog"
        aria-label="Observation form guide"
        aria-modal="true"
        className="relative mx-4 w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => dismiss(false)}
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close guide"
        >
          <X className="size-4" />
        </button>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 px-6 pt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === step ? 'w-6 bg-amber-500' : i < step ? 'w-3 bg-amber-500/40' : 'w-3 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className={`mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted ${current.color}`}>
            <Icon className="size-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">{current.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <div>
            {step > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-1 size-4" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => dismiss(true)} className="text-muted-foreground">
                Don&apos;t show again
              </Button>
            )}
          </div>
          <div>
            {isLast ? (
              <Button size="sm" onClick={() => dismiss(false)} className="bg-amber-600 hover:bg-amber-700 text-white">
                Start Observing
              </Button>
            ) : (
              <Button size="sm" onClick={() => setStep(step + 1)} className="bg-amber-600 hover:bg-amber-700 text-white">
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
