'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface EnvironmentSectionProps {
  form: UseFormReturn<ObservationFormValues>;
}

const FUEL_TYPES = [
  { name: 'fuelLitter' as const, label: 'Surface Litter', description: 'Dead needles, leaves, duff' },
  { name: 'fuelGrass' as const, label: 'Grass / Shrub', description: 'Annual/perennial grass, brush' },
  { name: 'fuelCrown' as const, label: 'Crown / Canopy', description: 'Ladder fuels, crown fire potential' },
];

export function EnvironmentSection({ form }: EnvironmentSectionProps) {
  return (
    <div className="space-y-5">
      <FormField
        control={form.control}
        name="relativeHumidity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relative Humidity (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                max={100}
                placeholder="0–100"
                className="max-w-[160px]"
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

      <div>
        <p className="mb-3 text-sm font-medium">Fuel Types Present</p>
        <div className="space-y-3">
          {FUEL_TYPES.map(({ name, label, description }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex items-start gap-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="grid leading-tight">
                    <FormLabel className="cursor-pointer font-medium">{label}</FormLabel>
                    <span className="text-xs text-muted-foreground">{description}</span>
                  </div>
                </FormItem>
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
