'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ObservationFormValues } from '@/lib/validations/observation';
import type { RosDirection } from '@firevector/schema';

interface RosSectionProps {
  form: UseFormReturn<ObservationFormValues>;
  calculatedRos: number | null;
}

function formatCalcRos(value: number | null): string {
  if (value === null) return '—';
  return value.toFixed(2);
}

export function RosSection({ form, calculatedRos }: RosSectionProps) {
  const { field: directionField } = useController({
    control: form.control,
    name: 'rosDirection',
  });

  const toggleDirection = (dir: RosDirection) => {
    // Clicking the already-selected direction clears it
    directionField.onChange(directionField.value === dir ? undefined : dir);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="observedRos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observed ROS (ch/hr)</FormLabel>
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

        {/* Direction toggle */}
        <div className="space-y-1.5">
          <FormLabel className="text-sm font-medium">Direction</FormLabel>
          <div className="flex gap-2 mt-1.5">
            {(['faster', 'slower'] as const).map((dir) => {
              const isSelected = directionField.value === dir;
              return (
                <button
                  key={dir}
                  type="button"
                  onClick={() => toggleDirection(dir)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-150 outline-none',
                    'focus-visible:ring-2 focus-visible:ring-ring/50',
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-sm shadow-amber-500/20'
                      : 'border-input bg-transparent text-muted-foreground hover:border-amber-500/40 hover:text-foreground',
                  )}
                >
                  {dir.charAt(0).toUpperCase() + dir.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calculated ROS output */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Projected ROS
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {directionField.value === 'faster'
                ? 'observed ROS × EWS ratio'
                : directionField.value === 'slower'
                  ? 'observed ROS ÷ EWS ratio'
                  : 'select a direction and provide EWS data'}
            </p>
          </div>
          <div className="text-right">
            <span
              className={cn(
                'font-mono-numbers text-3xl font-bold tabular-nums',
                calculatedRos !== null ? 'text-amber-400' : 'text-muted-foreground/40',
              )}
            >
              {formatCalcRos(calculatedRos)}
            </span>
            {calculatedRos !== null && (
              <span className="ml-1 text-xs text-amber-400/60">ch/hr</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
