import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          borderRadius: 40,
        }}
      >
        <svg
          width="120"
          height="120"
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
      </div>
    ),
    { ...size },
  );
}
