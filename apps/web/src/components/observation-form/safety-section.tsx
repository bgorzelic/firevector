'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface SafetySectionProps {
  form: UseFormReturn<ObservationFormValues>;
}

const LCES_ITEMS = [
  {
    name: 'lookouts' as const,
    label: 'Lookouts',
    description: 'Assigned and in position with clear view of fire',
  },
  {
    name: 'communications' as const,
    label: 'Communications',
    description: 'Radio channels established, all crew checked in',
  },
  {
    name: 'escapeRoutes' as const,
    label: 'Escape Routes',
    description: 'Identified, communicated, and unobstructed',
  },
  {
    name: 'safetyZones' as const,
    label: 'Safety Zones',
    description: 'Located, sized adequately for crew, travel time verified',
  },
];

export function SafetySection({ form }: SafetySectionProps) {
  const [lookouts, communications, escapeRoutes, safetyZones] = useWatch({
    control: form.control,
    name: ['lookouts', 'communications', 'escapeRoutes', 'safetyZones'],
  });

  const lcessComplete = lookouts && communications && escapeRoutes && safetyZones;

  return (
    <div className="space-y-5">
      {/* LCES status banner */}
      <div
        className={cn(
          'flex items-center justify-between rounded-lg border px-4 py-3 transition-all duration-300',
          lcessComplete
            ? 'border-green-500/30 bg-green-500/10 shadow-[0_0_12px_rgba(34,197,94,0.1)]'
            : 'border-amber-500/20 bg-amber-500/5',
        )}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            LCES Status
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/70">
            Lookouts · Communications · Escape Routes · Safety Zones
          </p>
        </div>
        <Badge
          className={cn(
            'border text-xs font-semibold px-3 py-1',
            lcessComplete
              ? 'border-green-500/40 bg-green-500/20 text-green-400 shadow-[0_0_8px_rgba(34,197,94,0.25)]'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-400',
          )}
        >
          {lcessComplete ? 'LCES Complete' : 'LCES Incomplete'}
        </Badge>
      </div>

      {/* Checklist */}
      <div className="space-y-4">
        {LCES_ITEMS.map(({ name, label, description }) => (
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
                  <FormLabel className="cursor-pointer font-semibold">{label}</FormLabel>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </div>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
