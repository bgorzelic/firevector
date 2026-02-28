'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface WindSlopeSectionProps {
  form: UseFormReturn<ObservationFormValues>;
  // Derived values passed in from parent after recompute()
  observedTotalEws: number | null;
  predictedTotalEws: number | null;
  ewsRatio: number | null;
}

function formatCalc(value: number | null): string {
  if (value === null) return '\u2014';
  return value.toFixed(1);
}

function CalcDisplay({
  label,
  value,
  id,
  className,
}: {
  label: string;
  value: number | null;
  id: string;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <p id={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <div
        role="status"
        aria-labelledby={id}
        aria-live="polite"
        aria-atomic="true"
        className="flex h-9 items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-3 glow-amber"
      >
        <span className="font-mono-numbers text-sm font-semibold text-amber-400" aria-hidden="true">
          {formatCalc(value)}
        </span>
        {value !== null && (
          <span className="ml-1 text-xs text-amber-400/60" aria-hidden="true">
            mph
          </span>
        )}
        <span className="sr-only">
          {value !== null ? `${value.toFixed(1)} mph` : 'Not yet calculated'}
        </span>
      </div>
    </div>
  );
}

type WindSpeedFieldName =
  | 'observedEyeLevelWs'
  | 'predictedEyeLevelWs'
  | 'observedMidflameWs'
  | 'predictedMidflameWs'
  | 'observedSlopeContribution'
  | 'predictedSlopeContribution';

interface ColumnProps {
  form: UseFormReturn<ObservationFormValues>;
  label: string;
  columnId: string;
  eyeLevelField: 'observedEyeLevelWs' | 'predictedEyeLevelWs';
  midflameField: 'observedMidflameWs' | 'predictedMidflameWs';
  slopeField: 'observedSlopeContribution' | 'predictedSlopeContribution';
  totalEws: number | null;
}

function WindSlopeColumn({
  form,
  label,
  columnId,
  eyeLevelField,
  midflameField,
  slopeField,
  totalEws,
}: ColumnProps) {
  const numericField = (name: WindSpeedFieldName, fieldLabel: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldLabel}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={0}
              step="0.1"
              placeholder="0.0"
              value={field.value ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                field.onChange(val === '' ? undefined : Number(val));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="space-y-3 flex-1 min-w-0" aria-labelledby={columnId}>
      <h4
        id={columnId}
        className="text-sm font-semibold text-foreground/80 uppercase tracking-wider border-b border-border pb-2"
      >
        {label}
      </h4>
      {numericField(eyeLevelField, 'Eye-Level Wind Speed (mph)')}
      {numericField(midflameField, 'Midflame Wind Speed (mph)')}
      {numericField(slopeField, 'Slope Contribution (mph)')}
      <CalcDisplay label="Total EWS" value={totalEws} id={`${columnId}-total-ews`} />
    </div>
  );
}

export function WindSlopeSection({
  form,
  observedTotalEws,
  predictedTotalEws,
  ewsRatio,
}: WindSlopeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <WindSlopeColumn
          form={form}
          label="Observed"
          columnId="ws-col-observed"
          eyeLevelField="observedEyeLevelWs"
          midflameField="observedMidflameWs"
          slopeField="observedSlopeContribution"
          totalEws={observedTotalEws}
        />

        <div className="hidden sm:block w-px bg-border shrink-0" aria-hidden="true" />

        <WindSlopeColumn
          form={form}
          label="Predicted"
          columnId="ws-col-predicted"
          eyeLevelField="predictedEyeLevelWs"
          midflameField="predictedMidflameWs"
          slopeField="predictedSlopeContribution"
          totalEws={predictedTotalEws}
        />
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p
              id="ews-ratio-label"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              EWS Ratio
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              max(observed, predicted) / min(observed, predicted)
            </p>
          </div>
          <div
            role="status"
            aria-labelledby="ews-ratio-label"
            aria-live="polite"
            aria-atomic="true"
            className="text-right"
          >
            <span
              aria-hidden="true"
              className={cn(
                'font-mono-numbers text-3xl font-bold tabular-nums',
                ewsRatio !== null ? 'text-amber-400' : 'text-muted-foreground/40'
              )}
            >
              {ewsRatio !== null ? ewsRatio.toFixed(2) : '\u2014'}
            </span>
            {ewsRatio !== null && (
              <span className="ml-1 text-xs text-amber-400/60" aria-hidden="true">
                &times;
              </span>
            )}
            <span className="sr-only">
              {ewsRatio !== null ? `${ewsRatio.toFixed(2)} times` : 'Not yet calculated'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
