import { NextResponse } from 'next/server';

// NASA FIRMS active fire data — publicly available, no API key needed
const FIRMS_VIIRS_24H =
  'https://firms.modaps.eosdis.nasa.gov/data/active_fire/viirs-snpp/csv/VIIRS_SNPP_USA_contiguous_and_Hawaii_24h.csv';

function csvToGeoJson(csv: string): GeoJSON.FeatureCollection {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return { type: 'FeatureCollection', features: [] };

  const headers = lines[0].split(',');
  const idx = (name: string) => headers.indexOf(name);
  const latI = idx('latitude');
  const lonI = idx('longitude');
  const frpI = idx('frp');
  const confI = idx('confidence');
  const dateI = idx('acq_date');
  const timeI = idx('acq_time');
  const brightI = idx('bright_ti4');

  const features: GeoJSON.Feature[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const lat = parseFloat(cols[latI]);
    const lon = parseFloat(cols[lonI]);
    if (isNaN(lat) || isNaN(lon)) continue;

    features.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lon, lat] },
      properties: {
        frp: parseFloat(cols[frpI]) || 0,
        confidence: cols[confI] || 'nominal',
        date: cols[dateI] || '',
        time: cols[timeI] || '',
        brightness: parseFloat(cols[brightI]) || 0,
      },
    });
  }

  return { type: 'FeatureCollection', features };
}

export async function GET() {
  try {
    const res = await fetch(FIRMS_VIIRS_24H, {
      headers: { 'User-Agent': 'Firevector/1.0 (wildfire observation tool)' },
      next: { revalidate: 900 }, // Cache for 15 min
    });

    if (!res.ok) throw new Error(`FIRMS responded ${res.status}`);

    const csv = await res.text();
    const geojson = csvToGeoJson(csv);

    return NextResponse.json(geojson, {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('FIRMS fetch error:', error);
    // Return empty GeoJSON — map will just not show fire hotspots
    return NextResponse.json(
      { type: 'FeatureCollection', features: [] },
      { headers: { 'Cache-Control': 'public, s-maxage=60' } },
    );
  }
}
