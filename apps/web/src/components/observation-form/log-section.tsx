'use client';

import type { UseFormReturn } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface LogSectionProps {
  form: UseFormReturn<ObservationFormValues>;
}

export function LogSection({ form }: LogSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'observationLog',
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-border bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Entry {index + 1}
            </span>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove entry ${index + 1}`}
              >
                <Trash2 aria-hidden="true" />
              </Button>
            )}
          </div>

          <FormField
            control={form.control}
            name={`observationLog.${index}.time`}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Time</FormLabel>
                <FormControl>
                  <Input placeholder="14:32" className="max-w-[140px]" {...f} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`observationLog.${index}.fire_behavior_notes`}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Fire Behavior Notes</FormLabel>
                <FormControl>
                  <textarea
                    className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-[80px] resize-y placeholder:text-muted-foreground"
                    placeholder="Flame lengths, spotting, torching..."
                    {...f}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`observationLog.${index}.weather_trends`}
            render={({ field: f }) => (
              <FormItem>
                <FormLabel className="text-xs text-muted-foreground">Weather Trends</FormLabel>
                <FormControl>
                  <textarea
                    className="border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] min-h-[60px] resize-y placeholder:text-muted-foreground"
                    placeholder="Wind shift, RH drop, inversion..."
                    {...f}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ time: '', fire_behavior_notes: '', weather_trends: '' })}
        className="gap-2"
      >
        <Plus aria-hidden="true" />
        Add Entry
      </Button>
    </div>
  );
}
