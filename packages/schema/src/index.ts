export type RosDirection = 'faster' | 'slower';

export interface IncidentOverview {
  incident_name: string;
  observer_name: string;
  observation_datetime: string;
  perimeter_notes: string;
  growth_notes: string;
}

export interface EnvironmentalInputs {
  relative_humidity: number | null;
  fuel_litter: boolean;
  fuel_grass: boolean;
  fuel_crown: boolean;
}

export interface WindSlopeColumn {
  eye_level_ws: number | null;
  midflame_ws: number | null;
  slope_contribution: number | null;
  total_ews: number | null;
}

export interface WindSlope {
  observed: WindSlopeColumn;
  predicted: WindSlopeColumn;
  ews_ratio: number | null;
}

export interface RateOfSpread {
  observed_ros: number | null;
  ros_direction: RosDirection | null;
  calculated_ros: number | null;
}

export interface ObservationEntry {
  time: string;
  fire_behavior_notes: string;
  weather_trends: string;
}

export interface SafetyAudit {
  lookouts: boolean;
  communications: boolean;
  escape_routes: boolean;
  safety_zones: boolean;
}

export interface WeatherMeta {
  source: string;
  fetched_at: string | null;
  lat: number | null;
  lon: number | null;
}

export interface FireObservation {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'complete';
  incident: IncidentOverview;
  environment: EnvironmentalInputs;
  wind_slope: WindSlope;
  ros: RateOfSpread;
  observations_log: ObservationEntry[];
  safety: SafetyAudit;
  weather_meta: WeatherMeta;
}

export type CreateObservationRequest = Omit<
  FireObservation,
  'id' | 'created_at' | 'updated_at'
>;

export type UpdateObservationRequest = Partial<CreateObservationRequest>;

export interface WeatherResponse {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
  time: string;
}
