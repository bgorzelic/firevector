# Firevector Web App Design

**Date:** 2026-02-28
**Status:** Approved
**Author:** Brian Gorzelic / Claude Code

## Mission

Build a visually stunning, open-source wildfire observation tool for Cal OES and the firefighting community. Digitizes the NWCG fire behavior observation form with real-time calculations, map-based observation tracking, and Google OAuth authentication. Deployed on Vercel at firevector.org.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Full-stack Next.js 15 (App Router) | Single deployment, engine is already TS |
| Auth | NextAuth.js v5 + Google OAuth | Any Google account, user sees own data |
| Database | Vercel Postgres (Neon) + Drizzle ORM | Zero-config with Vercel, type-safe |
| Map | Mapbox GL JS via react-map-gl | Best dark tiles, 50k free loads/month |
| UI | Tailwind CSS 4 + shadcn/ui + Radix | Dark/light/system theming, accessible |
| Theme | Dark tactical (default) + light + system | Amber/fire accents, command-center vibe |
| Accessibility | WCAG 2.1 AA | Government standard, Section 508 |
| Domain | firevector.org | Open-source/community signal |
| License | MIT | Free for anyone to use |
| CI | GitHub Actions | Lint, typecheck, test, build |

## Architecture

```
firevector/
├── packages/schema/          # Types (exists)
├── packages/engine/          # Calculations (exists)
├── apps/web/                 # Next.js 15 App Router
│   ├── app/
│   │   ├── (auth)/           # Login page
│   │   ├── (app)/            # Authenticated routes
│   │   │   ├── dashboard/    # Observation list + map
│   │   │   └── observations/
│   │   │       ├── new/      # Create form
│   │   │       └── [id]/     # Edit form
│   │   └── api/auth/         # NextAuth routes
│   ├── components/           # Reusable UI components
│   ├── lib/                  # DB, auth config, utils
│   └── drizzle/              # Schema + migrations
├── docs/                     # Architecture, contributing
├── .github/workflows/        # CI pipeline
└── LICENSE
```

### Tech Stack

- **Framework:** Next.js 15, App Router, Server Components + Server Actions
- **Auth:** NextAuth.js v5 (Auth.js) with Google OAuth provider
- **DB:** Vercel Postgres (Neon) + Drizzle ORM
- **UI:** Tailwind CSS 4 + shadcn/ui + Radix primitives
- **Map:** react-map-gl (Mapbox GL JS wrapper)
- **Theming:** next-themes (dark/light/system with CSS variables)
- **Validation:** Zod schemas (shared between client and server)
- **Fonts:** Inter (body), JetBrains Mono (numeric values)
- **Testing:** Vitest (unit), Playwright (e2e, future)
- **CI:** GitHub Actions (lint, type-check, test, build)

## Database Schema

### users

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| email | text | unique |
| name | text | |
| image | text | Google avatar URL |
| created_at | timestamp | |
| updated_at | timestamp | |

### observations

Flat columns for proper indexing and type safety.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| status | text | 'draft' or 'complete' |
| incident_name | text | |
| observer_name | text | |
| observation_datetime | timestamp | |
| latitude | float | nullable, for map pin |
| longitude | float | nullable, for map pin |
| perimeter_notes | text | |
| growth_notes | text | |
| relative_humidity | float | nullable |
| fuel_litter | boolean | |
| fuel_grass | boolean | |
| fuel_crown | boolean | |
| observed_eye_level_ws | float | nullable |
| observed_midflame_ws | float | nullable |
| observed_slope_contribution | float | nullable |
| observed_total_ews | float | computed |
| predicted_eye_level_ws | float | nullable |
| predicted_midflame_ws | float | nullable |
| predicted_slope_contribution | float | nullable |
| predicted_total_ews | float | computed |
| ews_ratio | float | computed |
| observed_ros | float | nullable |
| ros_direction | text | 'faster' or 'slower' |
| calculated_ros | float | computed |
| safety_lookouts | boolean | |
| safety_communications | boolean | |
| safety_escape_routes | boolean | |
| safety_zones | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

### observation_log_entries

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| observation_id | uuid | FK → observations |
| time | text | |
| fire_behavior_notes | text | |
| weather_trends | text | |
| sort_order | integer | |

## Pages & User Flow

```
[firevector.org] → Landing/Login
        │
   Google OAuth
        │
   [/dashboard] ← Main hub
    ├── Map showing all observation locations (pins)
    ├── Table of observations (sortable, filterable)
    ├── Quick stats cards (total obs, recent activity)
    └── [+ New Observation] button
              │
     [/observations/new] ← Full form
      ├── Incident Overview section
      ├── Environmental Inputs section
      ├── Wind & Slope section (auto-calculates EWS)
      ├── Rate of Spread section (auto-calculates ROS)
      ├── Observation Log (add/remove entries)
      ├── Safety Audit (LCES checklist)
      ├── Location picker (click map to set lat/lng)
      └── [Save Draft] / [Mark Complete]
              │
     [/observations/:id] ← View/Edit
      └── Same form, pre-populated
```

## UI Design System

### Theme Tokens

| Token | Dark | Light |
|-------|------|-------|
| background | #0F1117 | #FAFAFA |
| card | #1A1D26 | #FFFFFF |
| card-border | #2A2D36 | #E5E7EB |
| accent | #F59E0B (amber) | #D97706 |
| accent-glow | rgba(245,158,11,0.15) | transparent |
| danger | #EF4444 | #DC2626 |
| success | #22C55E | #16A34A |
| text-primary | #E5E7EB | #111827 |
| text-muted | #9CA3AF | #6B7280 |

### Visual Elements

- Amber glow borders on active/focused cards in dark mode
- Fire gradient (amber → orange → red) on main header bar
- JetBrains Mono for all numeric values
- Inter for body text
- Subtle glassmorphism on cards in dark mode
- Mapbox dark-v11 / light-v11 tiles per theme
- All text meets WCAG 2.1 AA contrast ratios in both themes

### Responsive Breakpoints

**Dashboard:**
- Desktop (1024+): Map 60% left, table 40% right, stats cards across top
- Tablet (768-1023): Map full width top, table below, stats 2-column
- Mobile (<768): Collapsible map, horizontal scroll stats, table as card list

**Observation Form:**
- Desktop: Wind/Slope as side-by-side columns (Observed | Predicted)
- Mobile: Stacked vertically, sticky save button at bottom

**Mobile-specific:**
- Touch-friendly map controls (pinch zoom, tap to place pin)
- 48px minimum touch targets (WCAG)
- Bottom sheet navigation on small screens
- Swipe gestures on observation cards

## Auth Flow

```
User visits firevector.org
        │
   Not authenticated → Show login page
        │
   Click "Sign in with Google"
        │
   Google OAuth consent screen
        │
   Redirect back → NextAuth creates session
        │
   Upsert user in DB (email, name, avatar)
        │
   Redirect to /dashboard
```

NextAuth middleware protects all (app)/ routes. Unauthenticated users see only the login page.

## Real-Time Calculation Flow

```
User types in Wind/Slope fields
        │
   onChange fires on each input
        │
   Client-side: import { recompute } from '@firevector/engine'
        │
   Derived fields update instantly:
   ├── observed_total_ews
   ├── predicted_total_ews
   ├── ews_ratio
   └── calculated_ros
        │
   Subtle amber flash animation on updated values
        │
   On save: Server Action validates with Zod + recomputes server-side
```

## GitHub Repository

### Features to Enable

- Public repo with MIT license
- GitHub Projects board (Kanban)
- Issue templates (bug report, feature request)
- PR template with checklist
- Branch protection on main (CI pass required)
- Dependabot for dependency updates
- CodeQL security scanning

### Documentation

- `README.md` — Hero banner, screenshots, quick start, Mermaid architecture diagram, tech stack badges
- `CONTRIBUTING.md` — Local setup, code style, PR process
- `docs/architecture.md` — Mermaid diagrams: system, data flow, auth flow, components
- `docs/deployment.md` — Vercel deployment guide + env var setup
- `docs/domain-model.md` — Fire behavior concepts for non-firefighters

### CI Pipeline (GitHub Actions)

```yaml
on: [push, pull_request]
jobs:
  lint:        # ESLint + Prettier
  typecheck:   # tsc --noEmit
  test-engine: # vitest (packages/engine)
  test-web:    # vitest (apps/web)
  build:       # next build
```

## Future Considerations

- React Native / Expo mobile app (can reuse schema + engine packages)
- FastAPI backend for dedicated mobile API
- Open-Meteo weather data integration (type already in schema)
- PDF export of completed observations
- Offline-first PWA capabilities for field use
