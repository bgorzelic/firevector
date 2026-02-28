'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  Source,
  Layer,
  type MapRef,
  type MarkerEvent,
} from 'react-map-gl/mapbox';
import { MapPin, Flame, Satellite, Mountain, Moon, Wind, Activity } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface FirePopup {
  longitude: number;
  latitude: number;
  frp: number;
  confidence: string;
  date: string;
  time: string;
}

interface EarthquakePopup {
  longitude: number;
  latitude: number;
  title: string;
  mag: number;
  time: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const OWM_KEY = process.env.NEXT_PUBLIC_OWM_API_KEY;

const MAP_STYLES = {
  dark: { url: 'mapbox://styles/mapbox/dark-v11', label: 'Dark', Icon: Moon },
  satellite: { url: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellite', Icon: Satellite },
  outdoors: { url: 'mapbox://styles/mapbox/outdoors-v12', label: 'Topo', Icon: Mountain },
} as const;

type MapStyleKey = keyof typeof MAP_STYLES;

const DEFAULT_VIEW = { longitude: -119.5, latitude: 37.5, zoom: 6 };

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return '\u2014';
  return n.toFixed(2);
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
      <div className="text-center">
        <MapPin className="mx-auto mb-2 size-8 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">Map unavailable</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Set <code className="rounded bg-muted px-1 py-0.5 font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code> to enable.
        </p>
      </div>
    </div>
  );
}

function StyleControl({
  value,
  onChange,
}: {
  value: MapStyleKey;
  onChange: (v: MapStyleKey) => void;
}) {
  return (
    <div className="absolute left-3 top-3 z-10 flex gap-0.5 rounded-lg bg-black/70 p-1 backdrop-blur-sm">
      {(Object.entries(MAP_STYLES) as [MapStyleKey, (typeof MAP_STYLES)[MapStyleKey]][]).map(
        ([key, style]) => {
          const isActive = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-amber-500/30 text-amber-300'
                  : 'text-white/60 hover:bg-white/10 hover:text-white/80'
              }`}
              aria-label={`Switch to ${style.label} map`}
              aria-pressed={isActive}
            >
              <style.Icon className="size-3.5" />
              <span className="hidden sm:inline">{style.label}</span>
            </button>
          );
        },
      )}
    </div>
  );
}

function LayerPanel({
  fires,
  onFiresChange,
  fireCount,
  weather,
  onWeatherChange,
  earthquakes,
  onEarthquakesChange,
  quakeCount,
}: {
  fires: boolean;
  onFiresChange: (v: boolean) => void;
  fireCount: number;
  weather: boolean;
  onWeatherChange: (v: boolean) => void;
  earthquakes: boolean;
  onEarthquakesChange: (v: boolean) => void;
  quakeCount: number;
}) {
  return (
    <div className="absolute left-3 top-14 z-10 flex flex-col gap-1">
      <LayerBtn
        active={fires}
        onClick={() => onFiresChange(!fires)}
        icon={<Flame className="size-3.5" />}
        label="Fire Hotspots"
        count={fireCount}
        color="red"
      />
      {OWM_KEY && (
        <LayerBtn
          active={weather}
          onClick={() => onWeatherChange(!weather)}
          icon={<Wind className="size-3.5" />}
          label="Weather"
          color="blue"
        />
      )}
      <LayerBtn
        active={earthquakes}
        onClick={() => onEarthquakesChange(!earthquakes)}
        icon={<Activity className="size-3.5" />}
        label="Earthquakes"
        count={quakeCount}
        color="yellow"
      />
    </div>
  );
}

function LayerBtn({
  active,
  onClick,
  icon,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
  color: 'red' | 'blue' | 'yellow';
}) {
  const colors = {
    red: active ? 'bg-red-500/20 text-red-300 border-red-500/30' : '',
    blue: active ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : '',
    yellow: active ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : '',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors ${
        active
          ? colors[color]
          : 'border-transparent bg-black/70 text-white/60 hover:text-white/80'
      }`}
      aria-label={active ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={active}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] tabular-nums">
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function ObservationsMap({ observations, className }: ObservationsMapProps) {
  const mapRef = useRef<MapRef>(null);

  // Map state
  const [mapStyle, setMapStyle] = useState<MapStyleKey>('dark');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFire, setSelectedFire] = useState<FirePopup | null>(null);
  const [selectedQuake, setSelectedQuake] = useState<EarthquakePopup | null>(null);

  // Layer toggles
  const [showFires, setShowFires] = useState(true);
  const [showWeather, setShowWeather] = useState(false);
  const [showEarthquakes, setShowEarthquakes] = useState(false);

  // Layer data
  const [fireData, setFireData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [earthquakeData, setEarthquakeData] = useState<GeoJSON.FeatureCollection | null>(null);

  const selectedObs = observations.find((o) => o.id === selectedId) ?? null;
  const pins = observations.filter((o) => o.latitude !== null && o.longitude !== null);

  // ── Data fetching ───────────────────────────────────────────────────────

  useEffect(() => {
    fetch('/api/fires')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setFireData(d))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!showEarthquakes) return;
    if (earthquakeData) return; // Already fetched
    fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setEarthquakeData(d))
      .catch(console.error);
  }, [showEarthquakes, earthquakeData]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleMarkerClick = useCallback(
    (id: string, lng: number, lat: number) => {
      setSelectedId((prev) => (prev === id ? null : id));
      setSelectedFire(null);
      setSelectedQuake(null);
      mapRef.current?.flyTo({ center: [lng, lat], zoom: 10, duration: 1500 });
    },
    [],
  );

  const handleMapClick = useCallback(
    (e: mapboxgl.MapLayerMouseEvent) => {
      // Check fire hotspot click
      if (showFires) {
        const fireFeat = e.features?.find((f) => f.layer?.id === 'fire-hotspots-circle');
        if (fireFeat && fireFeat.geometry.type === 'Point') {
          const p = fireFeat.properties!;
          setSelectedFire({
            longitude: fireFeat.geometry.coordinates[0],
            latitude: fireFeat.geometry.coordinates[1],
            frp: p.frp ?? 0,
            confidence: p.confidence ?? 'unknown',
            date: p.date ?? '',
            time: p.time ?? '',
          });
          setSelectedId(null);
          setSelectedQuake(null);
          return;
        }
      }

      // Check earthquake click
      if (showEarthquakes) {
        const quakeFeat = e.features?.find((f) => f.layer?.id === 'earthquakes-circle');
        if (quakeFeat && quakeFeat.geometry.type === 'Point') {
          const p = quakeFeat.properties!;
          setSelectedQuake({
            longitude: quakeFeat.geometry.coordinates[0],
            latitude: quakeFeat.geometry.coordinates[1],
            title: p.title ?? 'Unknown',
            mag: p.mag ?? 0,
            time: p.time ? new Date(p.time).toLocaleString() : '',
          });
          setSelectedId(null);
          setSelectedFire(null);
          return;
        }
      }

      setSelectedId(null);
      setSelectedFire(null);
      setSelectedQuake(null);
    },
    [showFires, showEarthquakes],
  );

  // ── Interactive layers ──────────────────────────────────────────────────

  const interactiveLayerIds: string[] = [];
  if (showFires && fireData) interactiveLayerIds.push('fire-hotspots-circle');
  if (showEarthquakes && earthquakeData) interactiveLayerIds.push('earthquakes-circle');

  // ── Render ──────────────────────────────────────────────────────────────

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
        <span aria-hidden="true">Hazard Map</span>
        <span className="text-xs" aria-hidden="true">
          {isCollapsed ? 'Show' : 'Hide'}
        </span>
      </button>

      <div
        id="observations-map-panel"
        className={[
          'relative overflow-hidden rounded-lg border border-border transition-all duration-200',
          isCollapsed ? 'hidden md:block' : 'block',
        ].join(' ')}
        style={{ minHeight: '300px', height: 'clamp(300px, 50vh, 600px)' }}
      >
        {/* Controls */}
        <StyleControl value={mapStyle} onChange={setMapStyle} />
        <LayerPanel
          fires={showFires}
          onFiresChange={setShowFires}
          fireCount={fireData?.features.length ?? 0}
          weather={showWeather}
          onWeatherChange={setShowWeather}
          earthquakes={showEarthquakes}
          onEarthquakesChange={setShowEarthquakes}
          quakeCount={earthquakeData?.features.length ?? 0}
        />

        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={DEFAULT_VIEW}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLES[mapStyle].url}
          onClick={handleMapClick}
          interactiveLayerIds={interactiveLayerIds}
          terrain={
            mapStyle !== 'dark'
              ? { source: 'mapbox-dem', exaggeration: 1.5 }
              : undefined
          }
        >
          <NavigationControl position="top-right" />

          {/* Terrain DEM source */}
          <Source
            id="mapbox-dem"
            type="raster-dem"
            url="mapbox://mapbox.mapbox-terrain-dem-v1"
            tileSize={512}
            maxzoom={14}
          />

          {/* ── Fire Hotspots (NASA FIRMS) ────────────────────────────── */}
          {showFires && fireData && (
            <Source id="fire-hotspots" type="geojson" data={fireData}>
              {/* Heatmap at low zoom */}
              <Layer
                id="fire-hotspots-heat"
                type="heatmap"
                maxzoom={9}
                paint={{
                  'heatmap-weight': ['interpolate', ['linear'], ['get', 'frp'], 0, 0, 50, 1],
                  'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 0.5, 9, 2],
                  'heatmap-color': [
                    'interpolate',
                    ['linear'],
                    ['heatmap-density'],
                    0, 'rgba(0,0,0,0)',
                    0.1, 'rgba(255,255,204,0.4)',
                    0.3, 'rgba(255,237,160,0.6)',
                    0.5, 'rgba(254,178,76,0.7)',
                    0.7, 'rgba(253,141,60,0.8)',
                    0.9, 'rgba(240,59,32,0.9)',
                    1, 'rgba(189,0,38,1)',
                  ],
                  'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 4, 6, 20, 9, 40],
                  'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.9, 9, 0],
                }}
              />
              {/* Circles at high zoom */}
              <Layer
                id="fire-hotspots-circle"
                type="circle"
                minzoom={7}
                paint={{
                  'circle-radius': ['interpolate', ['linear'], ['zoom'], 7, 2, 12, 6, 16, 12],
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'frp'],
                    0, '#fbbf24',
                    20, '#f97316',
                    50, '#ef4444',
                    100, '#dc2626',
                  ],
                  'circle-opacity': 0.8,
                  'circle-stroke-width': 1,
                  'circle-stroke-color': 'rgba(255,255,255,0.3)',
                }}
              />
            </Source>
          )}

          {/* ── Weather Overlay (OpenWeatherMap) ──────────────────────── */}
          {showWeather && OWM_KEY && (
            <Source
              id="weather-tiles"
              type="raster"
              tiles={[
                `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_KEY}`,
              ]}
              tileSize={256}
            >
              <Layer
                id="weather-layer"
                type="raster"
                paint={{ 'raster-opacity': 0.5 }}
              />
            </Source>
          )}

          {/* ── Earthquakes (USGS) ───────────────────────────────────── */}
          {showEarthquakes && earthquakeData && (
            <Source id="earthquakes" type="geojson" data={earthquakeData}>
              <Layer
                id="earthquakes-circle"
                type="circle"
                paint={{
                  'circle-radius': [
                    'interpolate', ['linear'], ['get', 'mag'],
                    2.5, 3, 4, 6, 5, 10, 6, 16, 8, 28,
                  ],
                  'circle-color': [
                    'interpolate', ['linear'], ['get', 'mag'],
                    2.5, '#fde047', 4, '#f97316', 5.5, '#ef4444', 7, '#7f1d1d',
                  ],
                  'circle-opacity': 0.7,
                  'circle-stroke-width': 1,
                  'circle-stroke-color': 'rgba(255,255,255,0.4)',
                }}
              />
            </Source>
          )}

          {/* ── Observation Markers ──────────────────────────────────── */}
          {pins.map((obs) => (
            <Marker
              key={obs.id}
              longitude={obs.longitude}
              latitude={obs.latitude}
              anchor="bottom"
              onClick={(e: MarkerEvent<MouseEvent>) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(obs.id, obs.longitude, obs.latitude);
              }}
            >
              <div
                role="button"
                tabIndex={0}
                className="flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
                aria-label={`View observation: ${obs.incidentName || 'Unnamed observation'}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMarkerClick(obs.id, obs.longitude, obs.latitude);
                  }
                }}
              >
                <MapPin className="size-4 text-white" aria-hidden="true" />
              </div>
            </Marker>
          ))}

          {/* ── Observation Popup ─────────────────────────────────────── */}
          {selectedObs && (
            <Popup
              longitude={selectedObs.longitude}
              latitude={selectedObs.latitude}
              anchor="top"
              onClose={() => setSelectedId(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="min-w-[160px] p-1 text-sm">
                <p className="font-semibold leading-snug text-amber-600">
                  {selectedObs.incidentName || 'Unnamed Observation'}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>EWS Ratio</span>
                  <span className="font-mono-numbers font-medium text-foreground">
                    {fmt(selectedObs.ewsRatio)}
                  </span>
                  <span>Projected ROS</span>
                  <span className="font-mono-numbers font-medium text-foreground">
                    {fmt(selectedObs.calculatedRos)}
                  </span>
                </div>
              </div>
            </Popup>
          )}

          {/* ── Fire Hotspot Popup ────────────────────────────────────── */}
          {selectedFire && (
            <Popup
              longitude={selectedFire.longitude}
              latitude={selectedFire.latitude}
              anchor="top"
              onClose={() => setSelectedFire(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="min-w-[140px] p-1 text-sm">
                <p className="font-semibold leading-snug text-red-500">
                  <Flame className="mr-1 inline size-3.5" />
                  FIRMS Detection
                </p>
                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>FRP</span>
                  <span className="font-medium text-foreground">{selectedFire.frp.toFixed(1)} MW</span>
                  <span>Confidence</span>
                  <span className="font-medium text-foreground capitalize">{selectedFire.confidence}</span>
                  <span>Detected</span>
                  <span className="font-medium text-foreground">
                    {selectedFire.date} {selectedFire.time}
                  </span>
                </div>
              </div>
            </Popup>
          )}

          {/* ── Earthquake Popup ──────────────────────────────────────── */}
          {selectedQuake && (
            <Popup
              longitude={selectedQuake.longitude}
              latitude={selectedQuake.latitude}
              anchor="top"
              onClose={() => setSelectedQuake(null)}
              closeButton={true}
              closeOnClick={false}
            >
              <div className="min-w-[140px] p-1 text-sm">
                <p className="font-semibold leading-snug text-yellow-500">
                  <Activity className="mr-1 inline size-3.5" />
                  Earthquake
                </p>
                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>Magnitude</span>
                  <span className="font-medium text-foreground">{selectedQuake.mag.toFixed(1)}</span>
                  <span>Location</span>
                  <span className="font-medium text-foreground">{selectedQuake.title}</span>
                  <span>Time</span>
                  <span className="font-medium text-foreground">{selectedQuake.time}</span>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
