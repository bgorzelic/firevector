'use client';

import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface IncidentSectionProps {
  form: UseFormReturn<ObservationFormValues>;
}

export function IncidentSection({ form }: IncidentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="incidentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Name</FormLabel>
              <FormControl>
                <Input placeholder="Oak Fire 2024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observer Name</FormLabel>
              <FormControl>
                <Input placeholder="J. Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="observationDatetime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date / Time</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="perimeterNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Perimeter Notes</FormLabel>
            <FormControl>
              <textarea
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-[72px] resize-y placeholder:text-muted-foreground"
                placeholder="Current perimeter extent, containment..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="growthNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Growth Notes</FormLabel>
            <FormControl>
              <textarea
                className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-[72px] resize-y placeholder:text-muted-foreground"
                placeholder="Rate of growth, direction of spread..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
