import { z } from 'zod';

// A single observation log entry
export const observationEntrySchema = z.object({
  time: z.string(),
  fire_behavior_notes: z.string(),
  weather_trends: z.string(),
});

// The full form schema — status drives required-field validation
export const observationFormSchema = z
  .object({
    status: z.enum(['draft', 'complete']),

    // Incident overview
    incidentName: z.string(),
    observerName: z.string(),
    observationDatetime: z.string(),
    perimeterNotes: z.string(),
    growthNotes: z.string(),

    // Location (optional)
    latitude: z.number().optional(),
    longitude: z.number().optional(),

    // Environment
    relativeHumidity: z.number().min(0).max(100).optional(),
    fuelLitter: z.boolean(),
    fuelGrass: z.boolean(),
    fuelCrown: z.boolean(),

    // Wind/slope — observed column
    observedEyeLevelWs: z.number().min(0).optional(),
    observedMidflameWs: z.number().min(0).optional(),
    observedSlopeContribution: z.number().min(0).optional(),

    // Wind/slope — predicted column
    predictedEyeLevelWs: z.number().min(0).optional(),
    predictedMidflameWs: z.number().min(0).optional(),
    predictedSlopeContribution: z.number().min(0).optional(),

    // ROS
    observedRos: z.number().min(0).optional(),
    rosDirection: z.enum(['faster', 'slower']).optional(),

    // Observation log entries
    observationLog: z.array(observationEntrySchema),

    // Safety — LCES
    lookouts: z.boolean(),
    communications: z.boolean(),
    escapeRoutes: z.boolean(),
    safetyZones: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // When marking complete, incident name and observer name are required
    if (data.status === 'complete') {
      if (!data.incidentName.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['incidentName'],
          message: 'Incident name is required to mark complete',
        });
      }
      if (!data.observerName.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['observerName'],
          message: 'Observer name is required to mark complete',
        });
      }
    }
  });

export type ObservationFormValues = z.infer<typeof observationFormSchema>;

export const defaultObservationValues: ObservationFormValues = {
  status: 'draft',
  incidentName: '',
  observerName: '',
  observationDatetime: '',
  perimeterNotes: '',
  growthNotes: '',
  latitude: undefined,
  longitude: undefined,
  relativeHumidity: undefined,
  fuelLitter: false,
  fuelGrass: false,
  fuelCrown: false,
  observedEyeLevelWs: undefined,
  observedMidflameWs: undefined,
  observedSlopeContribution: undefined,
  predictedEyeLevelWs: undefined,
  predictedMidflameWs: undefined,
  predictedSlopeContribution: undefined,
  observedRos: undefined,
  rosDirection: undefined,
  observationLog: [{ time: '', fire_behavior_notes: '', weather_trends: '' }],
  lookouts: false,
  communications: false,
  escapeRoutes: false,
  safetyZones: false,
};
