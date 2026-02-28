'use client';

import { useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recompute } from '@firevector/engine';
import type { WindSlope, RateOfSpread } from '@firevector/schema';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { IncidentSection } from './incident-section';
import { EnvironmentSection } from './environment-section';
import { WindSlopeSection } from './wind-slope-section';
import { RosSection } from './ros-section';
import { LogSection } from './log-section';
import { SafetySection } from './safety-section';

import {
  observationFormSchema,
  defaultObservationValues,
  type ObservationFormValues,
} from '@/lib/validations/observation';

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface DerivedCalcs {
  observedTotalEws: number | null;
  predictedTotalEws: number | null;
  ewsRatio: number | null;
  calculatedRos: number | null;
}

interface ObservationFormProps {
  initialData?: Partial<ObservationFormValues>;
  onSubmit?: (data: ObservationFormValues) => void;
}

// ----------------------------------------------------------------
// Helper: run recompute from flat form values
// ----------------------------------------------------------------

function runRecompute(values: ObservationFormValues): DerivedCalcs {
  const windSlope: WindSlope = {
    observed: {
      eye_level_ws: values.observedEyeLevelWs ?? null,
      midflame_ws: values.observedMidflameWs ?? null,
      slope_contribution: values.observedSlopeContribution ?? null,
      total_ews: null,
    },
    predicted: {
      eye_level_ws: values.predictedEyeLevelWs ?? null,
      midflame_ws: values.predictedMidflameWs ?? null,
      slope_contribution: values.predictedSlopeContribution ?? null,
      total_ews: null,
    },
    ews_ratio: null,
  };

  const ros: RateOfSpread = {
    observed_ros: values.observedRos ?? null,
    ros_direction: values.rosDirection ?? null,
    calculated_ros: null,
  };

  const result = recompute(windSlope, ros);

  return {
    observedTotalEws: result.windSlope.observed.total_ews,
    predictedTotalEws: result.windSlope.predicted.total_ews,
    ewsRatio: result.windSlope.ews_ratio,
    calculatedRos: result.ros.calculated_ros,
  };
}

// ----------------------------------------------------------------
// Section header
// ----------------------------------------------------------------

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

// ----------------------------------------------------------------
// Main form component
// ----------------------------------------------------------------

export function ObservationForm({ initialData, onSubmit }: ObservationFormProps) {
  const [derived, setDerived] = useState<DerivedCalcs>({
    observedTotalEws: null,
    predictedTotalEws: null,
    ewsRatio: null,
    calculatedRos: null,
  });

  const form = useForm<ObservationFormValues>({
    resolver: zodResolver(observationFormSchema),
    defaultValues: {
      ...defaultObservationValues,
      ...initialData,
    },
    mode: 'onChange',
  });

  // Watch all wind/slope and ROS fields to drive real-time calculation.
  // useWatch is more efficient than watch() — it only re-renders this component
  // when the watched values change, not on every keystroke across all fields.
  const watchedCalcFields = useWatch({
    control: form.control,
    name: [
      'observedEyeLevelWs',
      'observedMidflameWs',
      'observedSlopeContribution',
      'predictedEyeLevelWs',
      'predictedMidflameWs',
      'predictedSlopeContribution',
      'observedRos',
      'rosDirection',
    ],
  });

  // Recalculate every render where watched fields changed.
  // We do this inline rather than in a useEffect to avoid a render lag —
  // the derived values are computed synchronously before paint.
  const currentValues = form.getValues();
  const freshDerived = runRecompute(currentValues);

  // Sync derived state when values change — compare by stringifying
  // the relevant fields to avoid infinite update loops.
  const derivedKey = watchedCalcFields.join(',');
  const [lastKey, setLastKey] = useState('');
  if (derivedKey !== lastKey) {
    setLastKey(derivedKey);
    setDerived(freshDerived);
  }

  const handleSaveDraft = useCallback(() => {
    form.setValue('status', 'draft');
    const values = form.getValues();
    onSubmit?.(values);
  }, [form, onSubmit]);

  const handleMarkComplete = useCallback(async () => {
    form.setValue('status', 'complete');
    const valid = await form.trigger();
    if (!valid) return;
    const values = form.getValues();
    onSubmit?.(values);
  }, [form, onSubmit]);

  // Compose a concise summary for screen reader announcements when calcs update.
  const calcsSummary = (() => {
    const parts: string[] = [];
    if (derived.observedTotalEws !== null)
      parts.push(`Observed EWS: ${derived.observedTotalEws.toFixed(1)} mph`);
    if (derived.predictedTotalEws !== null)
      parts.push(`Predicted EWS: ${derived.predictedTotalEws.toFixed(1)} mph`);
    if (derived.ewsRatio !== null)
      parts.push(`EWS Ratio: ${derived.ewsRatio.toFixed(2)}×`);
    if (derived.calculatedRos !== null)
      parts.push(`Projected ROS: ${derived.calculatedRos.toFixed(2)} ch/hr`);
    return parts.length > 0 ? parts.join('. ') : '';
  })();

  return (
    <Form {...form}>
      {/* Global sr-only live region for calculated value changes */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {calcsSummary}
      </div>

      <form
        id="observation-form"
        className="space-y-0"
        onSubmit={(e) => e.preventDefault()}
        noValidate
        aria-label="Fire behavior observation form"
      >
        {/* ---- Incident Overview ---- */}
        <section className="py-6">
          <SectionHeader
            title="Incident Overview"
            subtitle="Basic identifying information about this observation."
          />
          <div className="mt-5">
            <IncidentSection form={form} />
          </div>
        </section>

        <Separator />

        {/* ---- Environment ---- */}
        <section className="py-6">
          <SectionHeader
            title="Environmental Conditions"
            subtitle="Relative humidity and fuel types at the observation point."
          />
          <div className="mt-5">
            <EnvironmentSection form={form} />
          </div>
        </section>

        <Separator />

        {/* ---- Wind / Slope ---- */}
        <section className="py-6">
          <SectionHeader
            title="Wind & Slope"
            subtitle="Observed vs. predicted wind speed inputs. EWS and ratio are auto-calculated."
          />
          <div className="mt-5">
            <WindSlopeSection
              form={form}
              observedTotalEws={derived.observedTotalEws}
              predictedTotalEws={derived.predictedTotalEws}
              ewsRatio={derived.ewsRatio}
            />
          </div>
        </section>

        <Separator />

        {/* ---- Rate of Spread ---- */}
        <section className="py-6">
          <SectionHeader
            title="Rate of Spread"
            subtitle="Observed ROS and direction drive the projected spread calculation."
          />
          <div className="mt-5">
            <RosSection form={form} calculatedRos={derived.calculatedRos} />
          </div>
        </section>

        <Separator />

        {/* ---- Observation Log ---- */}
        <section className="py-6">
          <SectionHeader
            title="Observation Log"
            subtitle="Timestamped entries for fire behavior and weather trend notes."
          />
          <div className="mt-5">
            <LogSection form={form} />
          </div>
        </section>

        <Separator />

        {/* ---- Safety / LCES ---- */}
        <section className="py-6">
          <SectionHeader
            title="Safety — LCES"
            subtitle="Confirm all four elements are in place before engaging."
          />
          <div className="mt-5">
            <SafetySection form={form} />
          </div>
        </section>

        {/* ---- Sticky footer action bar ---- */}
        <div className="sticky bottom-0 z-10 -mx-6 mt-4 border-t border-border bg-background/90 px-6 py-4 backdrop-blur-sm md:mx-0 md:rounded-b-lg">
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
            <Button
              type="button"
              variant="default"
              onClick={handleMarkComplete}
            >
              Mark Complete
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
