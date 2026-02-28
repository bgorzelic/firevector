'use client';

import { useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, type MarkerEvent } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ObservationPin {
  id: string;
  latitude: number;
  longitude: number;
  incidentName: string;
  ewsRatio: number | null;
  calculatedRos: number | null;
}

interface ObservationsMapProps {
  observations: ObservationPin[];
  className?: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

const DEFAULT_VIEW = {
  longitude: -119.5,
  latitude: 37.5,
  zoom: 6,
};

function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '\u2014';
  return n.toFixed(2);
}

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
      <div className="text-center">
        <MapPin className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">Map unavailable</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Set{' '}
          <code className="rounded bg-muted px-1 py-0.5 font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code>{' '}
          to enable the map.
        </p>
      </div>
    </div>
  );
}

export function ObservationsMap({ observations, className }: ObservationsMapProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedObs = observations.find((o) => o.id === selectedId) ?? null;

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  // Filter to only observations with valid coordinates
  const pins = observations.filter((o) => o.latitude !== null && o.longitude !== null);

  if (!MAPBOX_TOKEN) {
    return (
      <div className={className}>
        <div className="h-[300px] md:h-[400px]">
          <MapPlaceholder />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Mobile collapse toggle */}
      <button
        type="button"
        className="mb-2 flex w-full min-h-[44px] items-center justify-between text-sm font-medium text-muted-foreground md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-sm"
        onClick={() => setIsCollapsed((v) => !v)}
        aria-expanded={!isCollapsed}
        aria-controls="observations-map-panel"
        aria-label={isCollapsed ? 'Show observation map' : 'Hide observation map'}
      >
        <span aria-hidden="true">Observation Map</span>
        <span className="text-xs" aria-hidden="true">
          {isCollapsed ? 'Show' : 'Hide'}
        </span>
      </button>

      <div
        id="observations-map-panel"
        className={[
          'overflow-hidden rounded-lg border border-border transition-all duration-200',
          isCollapsed ? 'hidden md:block' : 'block',
        ].join(' ')}
        style={{ minHeight: '300px', height: 'clamp(300px, 40vh, 500px)' }}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={DEFAULT_VIEW}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          onClick={handleMapClick}
        >
          <NavigationControl position="top-right" />

          {pins.map((obs) => (
            <Marker
              key={obs.id}
              longitude={obs.longitude}
              latitude={obs.latitude}
              anchor="bottom"
              onClick={(e: MarkerEvent<MouseEvent>) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(obs.id);
              }}
            >
              <div
                role="button"
                tabIndex={0}
                className="flex size-7 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-md transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                aria-label={`View observation: ${obs.incidentName || 'Unnamed observation'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMarkerClick(obs.id);
                  }
                }}
              >
                <MapPin className="size-3.5 text-white" aria-hidden="true" />
              </div>
            </Marker>
          ))}

          {selectedObs && (
            <Popup
              longitude={selectedObs.longitude}
              latitude={selectedObs.latitude}
              anchor="top"
              onClose={() => setSelectedId(null)}
              closeButton={true}
              closeOnClick={false}
              className="rounded-lg"
            >
              <div className="min-w-[160px] p-1 text-sm">
                <p className="font-semibold leading-snug">
                  {selectedObs.incidentName || 'Unnamed Observation'}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>EWS Ratio</span>
                  <span className="font-mono-numbers font-medium text-foreground">
                    {formatNumber(selectedObs.ewsRatio)}
                  </span>
                  <span>Projected ROS</span>
                  <span className="font-mono-numbers font-medium text-foreground">
                    {formatNumber(selectedObs.calculatedRos)}
                  </span>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
