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
  if (value === null) return '—';
  return value.toFixed(1);
}

function CalcDisplay({
  label,
  value,
  className,
}: {
  label: string;
  value: number | null;
  className?: string;
}) {
  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <div className="flex h-9 items-center rounded-md border border-amber-500/30 bg-amber-500/10 px-3 glow-amber">
        <span className="font-mono-numbers text-sm font-semibold text-amber-400">
          {formatCalc(value)}
        </span>
        {value !== null && (
          <span className="ml-1 text-xs text-amber-400/60">mph</span>
        )}
      </div>
    </div>
  );
}

interface ColumnProps {
  form: UseFormReturn<ObservationFormValues>;
  label: string;
  eyeLevelField: 'observedEyeLevelWs' | 'predictedEyeLevelWs';
  midflameField: 'observedMidflameWs' | 'predictedMidflameWs';
  slopeField: 'observedSlopeContribution' | 'predictedSlopeContribution';
  totalEws: number | null;
}

function WindSlopeColumn({
  form,
  label,
  eyeLevelField,
  midflameField,
  slopeField,
  totalEws,
}: ColumnProps) {
  const numericField = (
    name: 'observedEyeLevelWs' | 'predictedEyeLevelWs' | 'observedMidflameWs' | 'predictedMidflameWs' | 'observedSlopeContribution' | 'predictedSlopeContribution',
    placeholder: string,
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
              min={0}
              step="0.1"
              placeholder={placeholder}
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
    <div className="space-y-3 flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground/80 uppercase tracking-wider border-b border-border pb-2">
        {label}
      </h4>
      <div className="space-y-1">
        <FormLabel className="text-xs text-muted-foreground">Eye-Level Wind Speed (mph)</FormLabel>
        {numericField(eyeLevelField, '0.0')}
      </div>
      <div className="space-y-1">
        <FormLabel className="text-xs text-muted-foreground">Midflame Wind Speed (mph)</FormLabel>
        {numericField(midflameField, '0.0')}
      </div>
      <div className="space-y-1">
        <FormLabel className="text-xs text-muted-foreground">Slope Contribution (mph)</FormLabel>
        {numericField(slopeField, '0.0')}
      </div>
      <CalcDisplay label="Total EWS" value={totalEws} />
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
      {/* Two-column grid — stacks on mobile */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <WindSlopeColumn
          form={form}
          label="Observed"
          eyeLevelField="observedEyeLevelWs"
          midflameField="observedMidflameWs"
          slopeField="observedSlopeContribution"
          totalEws={observedTotalEws}
        />

        {/* Vertical divider — only on sm+ */}
        <div className="hidden sm:block w-px bg-border shrink-0" />

        <WindSlopeColumn
          form={form}
          label="Predicted"
          eyeLevelField="predictedEyeLevelWs"
          midflameField="predictedMidflameWs"
          slopeField="predictedSlopeContribution"
          totalEws={predictedTotalEws}
        />
      </div>

      {/* EWS Ratio — prominent display below columns */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              EWS Ratio
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              max(observed, predicted) / min(observed, predicted)
            </p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                'font-mono-numbers text-3xl font-bold tabular-nums',
                ewsRatio !== null ? 'text-amber-400' : 'text-muted-foreground/40',
              )}
            >
              {ewsRatio !== null ? ewsRatio.toFixed(2) : '—'}
            </span>
            {ewsRatio !== null && (
              <span className="ml-1 text-xs text-amber-400/60">×</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
