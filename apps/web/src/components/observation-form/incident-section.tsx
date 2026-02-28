'use client';

import { useState, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { ObservationFormValues } from '@/lib/validations/observation';

interface IncidentSectionProps {
  form: UseFormReturn<ObservationFormValues>;
}

export function IncidentSection({ form }: IncidentSectionProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by this browser.');
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('latitude', parseFloat(position.coords.latitude.toFixed(6)));
        form.setValue('longitude', parseFloat(position.coords.longitude.toFixed(6)));
        setGeoLoading(false);
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoError('Location access denied. Enable location in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoError('Location unavailable. Try again or enter coordinates manually.');
            break;
          case error.TIMEOUT:
            setGeoError('Location request timed out. Try again.');
            break;
          default:
            setGeoError('Unable to get location.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [form]);

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

      {/* GPS Location */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">GPS Location</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            disabled={geoLoading}
            className="gap-1.5"
          >
            {geoLoading ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <MapPin className="size-3.5" aria-hidden="true" />
            )}
            {geoLoading ? 'Getting location...' : 'Use My Location'}
          </Button>
        </div>
        {geoError && (
          <p className="text-xs text-destructive">{geoError}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="34.0522"
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
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    placeholder="-118.2437"
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
        </div>
      </div>

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
