import { ImageResponse } from 'next/og';

export const alt = 'Firevector — Wildfire Observation Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          position: 'relative',
        }}
      >
        {/* Fire gradient bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(to right, #F59E0B, #EA580C, #DC2626)',
          }}
        />

        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Flame icon */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 32 32"
          fill="none"
        >
          <defs>
            <linearGradient id="fo" x1="16" y1="2" x2="16" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id="fi" x1="16" y1="9" x2="16" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <path
            d="M16 2C14 7 10 9 10 14C10 18.418 12.582 22 16 22C19.418 22 22 18.418 22 14C22 9 18 7 16 2Z"
            fill="url(#fo)"
            opacity="0.9"
          />
          <path
            d="M16 9C15 12 13 13 13 16C13 18.209 14.343 20 16 20C17.657 20 19 18.209 19 16C19 13 17 12 16 9Z"
            fill="url(#fi)"
          />
        </svg>

        {/* Wordmark */}
        <div
          style={{
            marginTop: 24,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: '0.2em',
            color: '#fafafa',
          }}
        >
          FIREVECTOR
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            color: '#71717a',
          }}
        >
          Wildfire Observation Intelligence
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 16,
            color: '#3f3f46',
          }}
        >
          Built for Cal OES and the firefighting community
        </div>
      </div>
    ),
    { ...size },
  );
}
