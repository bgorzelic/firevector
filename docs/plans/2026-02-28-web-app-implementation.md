# Firevector Web App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a full-stack Next.js wildfire observation app with Google OAuth, Mapbox maps, Vercel Postgres, and a dark tactical UI - deployed to Vercel at firevector.org.

**Architecture:** Full-stack Next.js 15 App Router with Server Components and Server Actions. Auth via NextAuth.js v5 (Google OAuth). Data in Vercel Postgres via Drizzle ORM. UI with Tailwind CSS 4 + shadcn/ui. Maps via react-map-gl (Mapbox GL JS). Existing `@firevector/schema` and `@firevector/engine` packages imported directly.

**Tech Stack:** Next.js 15, NextAuth.js v5, Drizzle ORM, Vercel Postgres (Neon), Tailwind CSS 4, shadcn/ui, Radix UI, react-map-gl, Mapbox GL JS, Zod, next-themes, Vitest

**Design doc:** `docs/plans/2026-02-28-web-app-design.md`

---

## Phase 1: Project Foundation

### Task 1: Scaffold Next.js App

**Files:**
- Create: `apps/web/` (entire Next.js project via create-next-app)
- Modify: `package.json` (root workspace scripts)

**Step 1: Create the Next.js app**

```bash
cd /Users/bgorzelic/dev/projects/firevector
npx create-next-app@latest apps/web \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --no-import-alias \
  --turbopack
```

When prompted:
- Would you like to use Tailwind CSS? **Yes**
- Would you like your code inside a `src/` directory? **Yes**
- Would you like to use App Router? **Yes**
- Would you like to use Turbopack? **Yes**

**Step 2: Add workspace dependency references**

Edit `apps/web/package.json` to add dependencies on workspace packages:

```json
{
  "dependencies": {
    "@firevector/schema": "*",
    "@firevector/engine": "*"
  }
}
```

**Step 3: Install workspace dependencies**

```bash
cd /Users/bgorzelic/dev/projects/firevector
npm install
```

**Step 4: Verify the app runs**

```bash
npm run dev --workspace=apps/web
```

Open http://localhost:3000 - should see the default Next.js page.

**Step 5: Verify workspace imports work**

Create a quick smoke test file `apps/web/src/app/test-imports.ts`:

```typescript
import type { FireObservation } from '@firevector/schema';
import { recompute } from '@firevector/engine';

// If this file compiles, workspace refs work
export type { FireObservation };
export { recompute };
```

Run: `npx tsc --noEmit --project apps/web/tsconfig.json`

Then delete the smoke test file.

**Step 6: Commit**

```bash
git add apps/web/ package.json package-lock.json
git commit -m "feat: scaffold Next.js 15 app with workspace references"
```

---

### Task 2: Configure shadcn/ui + Design System

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/tailwind.config.ts` (if exists) or `apps/web/postcss.config.mjs`
- Create: `apps/web/components.json` (shadcn config)
- Create: `apps/web/src/components/ui/` (shadcn components)
- Create: `apps/web/src/lib/utils.ts`

**Step 1: Initialize shadcn/ui**

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npx shadcn@latest init
```

When prompted:
- Style: **New York**
- Base color: **Zinc**
- CSS variables: **Yes**

**Step 2: Override CSS variables for dark tactical theme**

Replace the generated CSS variables in `apps/web/src/app/globals.css` with the firevector theme:

```css
@layer base {
  :root {
    /* Light theme */
    --background: 0 0% 98%;
    --foreground: 220 14% 10%;
    --card: 0 0% 100%;
    --card-foreground: 220 14% 10%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 14% 10%;
    --primary: 37 91% 55%;
    --primary-foreground: 0 0% 100%;
    --secondary: 220 9% 94%;
    --secondary-foreground: 220 14% 10%;
    --muted: 220 9% 94%;
    --muted-foreground: 220 5% 46%;
    --accent: 37 91% 55%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 9% 90%;
    --input: 220 9% 90%;
    --ring: 37 91% 55%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 225 25% 7%;
    --foreground: 220 9% 90%;
    --card: 225 20% 12%;
    --card-foreground: 220 9% 90%;
    --popover: 225 20% 12%;
    --popover-foreground: 220 9% 90%;
    --primary: 37 91% 55%;
    --primary-foreground: 225 25% 7%;
    --secondary: 225 15% 18%;
    --secondary-foreground: 220 9% 90%;
    --muted: 225 15% 18%;
    --muted-foreground: 220 5% 64%;
    --accent: 37 91% 55%;
    --accent-foreground: 225 25% 7%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;
    --border: 225 15% 20%;
    --input: 225 15% 20%;
    --ring: 37 91% 55%;
  }
}
```

**Step 3: Add custom utility classes for firevector**

Append to `globals.css`:

```css
/* Firevector custom utilities */
.fire-gradient {
  background: linear-gradient(135deg, #f59e0b, #ea580c, #ef4444);
}

.glow-amber {
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
}

.font-mono-numbers {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-variant-numeric: tabular-nums;
}
```

**Step 4: Install Google Fonts (Inter + JetBrains Mono)**

Edit `apps/web/src/app/layout.tsx` to configure fonts via `next/font/google`:

```typescript
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});
```

Apply both to the `<body>` className.

**Step 5: Install base shadcn components we'll need**

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npx shadcn@latest add button card input label select checkbox table badge separator dropdown-menu sheet dialog form toast tabs
```

**Step 6: Verify dark mode works**

Install next-themes:

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npm install next-themes
```

Create `apps/web/src/components/theme-provider.tsx`:

```typescript
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps } from 'react';

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

Wrap the app layout with `<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>`.

**Step 7: Commit**

```bash
git add apps/web/
git commit -m "feat: configure shadcn/ui with dark tactical theme and design tokens"
```

---

### Task 3: Set Up Drizzle ORM + Database Schema

**Files:**
- Create: `apps/web/src/lib/db/schema.ts`
- Create: `apps/web/src/lib/db/index.ts`
- Create: `apps/web/drizzle.config.ts`
- Modify: `apps/web/package.json`

**Step 1: Install Drizzle dependencies**

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npm install drizzle-orm @vercel/postgres
npm install -D drizzle-kit
```

**Step 2: Create database schema**

Create `apps/web/src/lib/db/schema.ts`:

```typescript
import { pgTable, uuid, text, timestamp, real, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const observations = pgTable('observations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  status: text('status', { enum: ['draft', 'complete'] }).notNull().default('draft'),

  // Incident Overview
  incidentName: text('incident_name').notNull().default(''),
  observerName: text('observer_name').notNull().default(''),
  observationDatetime: timestamp('observation_datetime'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  perimeterNotes: text('perimeter_notes').notNull().default(''),
  growthNotes: text('growth_notes').notNull().default(''),

  // Environmental Inputs
  relativeHumidity: real('relative_humidity'),
  fuelLitter: boolean('fuel_litter').notNull().default(false),
  fuelGrass: boolean('fuel_grass').notNull().default(false),
  fuelCrown: boolean('fuel_crown').notNull().default(false),

  // Wind & Slope - Observed
  observedEyeLevelWs: real('observed_eye_level_ws'),
  observedMidflameWs: real('observed_midflame_ws'),
  observedSlopeContribution: real('observed_slope_contribution'),
  observedTotalEws: real('observed_total_ews'),

  // Wind & Slope - Predicted
  predictedEyeLevelWs: real('predicted_eye_level_ws'),
  predictedMidflameWs: real('predicted_midflame_ws'),
  predictedSlopeContribution: real('predicted_slope_contribution'),
  predictedTotalEws: real('predicted_total_ews'),

  // EWS Ratio
  ewsRatio: real('ews_ratio'),

  // Rate of Spread
  observedRos: real('observed_ros'),
  rosDirection: text('ros_direction', { enum: ['faster', 'slower'] }),
  calculatedRos: real('calculated_ros'),

  // Safety Audit (LCES)
  safetyLookouts: boolean('safety_lookouts').notNull().default(false),
  safetyCommunications: boolean('safety_communications').notNull().default(false),
  safetyEscapeRoutes: boolean('safety_escape_routes').notNull().default(false),
  safetyZones: boolean('safety_zones').notNull().default(false),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const observationLogEntries = pgTable('observation_log_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  observationId: uuid('observation_id').notNull().references(() => observations.id, { onDelete: 'cascade' }),
  time: text('time').notNull().default(''),
  fireBehaviorNotes: text('fire_behavior_notes').notNull().default(''),
  weatherTrends: text('weather_trends').notNull().default(''),
  sortOrder: integer('sort_order').notNull().default(0),
});
```

**Step 3: Create DB connection**

Create `apps/web/src/lib/db/index.ts`:

```typescript
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });
export type Database = typeof db;
```

**Step 4: Create Drizzle config**

Create `apps/web/drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
```

**Step 5: Add drizzle scripts to apps/web/package.json**

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Step 6: Commit**

```bash
git add apps/web/
git commit -m "feat: add Drizzle ORM schema for users, observations, and log entries"
```

---

### Task 4: Set Up NextAuth.js v5 with Google OAuth

**Files:**
- Create: `apps/web/src/lib/auth.ts`
- Create: `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- Create: `apps/web/src/middleware.ts`
- Create: `apps/web/.env.local.example`

**Step 1: Install NextAuth**

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npm install next-auth@beta
```

**Step 2: Create auth configuration**

Create `apps/web/src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from './db';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
```

Note: DrizzleAdapter may require the `@auth/drizzle-adapter` package and may need schema adjustments to match Auth.js's expected table structure (accounts, sessions, verification_tokens). Check Auth.js docs during implementation and adjust the Drizzle schema accordingly.

**Step 3: Create API route**

Create `apps/web/src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

**Step 4: Create middleware for route protection**

Create `apps/web/src/middleware.ts`:

```typescript
export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)'],
};
```

**Step 5: Create env example file**

Create `apps/web/.env.local.example`:

```bash
# Database (Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_URL_NO_SSL=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Auth (NextAuth.js)
AUTH_SECRET=  # Generate with: npx auth secret
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=
```

**Step 6: Commit**

```bash
git add apps/web/
git commit -m "feat: add NextAuth.js v5 with Google OAuth and route protection"
```

---

## Phase 2: Core UI

### Task 5: Build Login Page

**Files:**
- Create: `apps/web/src/app/login/page.tsx`
- Create: `apps/web/src/components/login-form.tsx`
- Create: `apps/web/public/logo.svg` (firevector logo placeholder)

**Step 1: Create the login page**

Create `apps/web/src/app/login/page.tsx`:

A full-viewport centered login page with:
- Dark background with subtle fire gradient at top
- Firevector logo and tagline ("Wildfire Observation Intelligence")
- "Sign in with Google" button using shadcn Button component
- Brief description text: "A free, open-source tool for wildfire behavior analysis. Built for Cal OES and the firefighting community."
- Footer: "MIT Licensed | Open Source on GitHub"

The page should NOT require authentication (excluded by middleware matcher).

**Step 2: Create the login form component**

Create `apps/web/src/components/login-form.tsx` as a client component that calls `signIn('google')` on button click.

**Step 3: Create a simple SVG logo placeholder**

A flame/vector icon placeholder in `apps/web/public/logo.svg`.

**Step 4: Verify the login page renders**

```bash
npm run dev --workspace=apps/web
```

Visit http://localhost:3000/login - should show the branded login page.

**Step 5: Commit**

```bash
git add apps/web/
git commit -m "feat: add branded login page with Google OAuth sign-in"
```

---

### Task 6: Build App Layout Shell

**Files:**
- Create: `apps/web/src/app/(app)/layout.tsx`
- Create: `apps/web/src/components/app-sidebar.tsx`
- Create: `apps/web/src/components/app-header.tsx`
- Create: `apps/web/src/components/theme-toggle.tsx`
- Create: `apps/web/src/components/user-menu.tsx`

**Step 1: Create the app layout**

Create `apps/web/src/app/(app)/layout.tsx`:

Server component that:
- Checks auth session (redirect to /login if not authenticated)
- Renders the app shell: header bar + sidebar (desktop) / bottom nav (mobile) + main content area
- Passes user info to header components

**Step 2: Create the header bar**

Create `apps/web/src/components/app-header.tsx`:

- Fire gradient bar across the top (thin, 3-4px)
- Logo + "FIREVECTOR" text (left)
- Theme toggle (dark/light/system) (right)
- User avatar + dropdown menu (right)
- Responsive: hamburger menu on mobile

**Step 3: Create the theme toggle**

Create `apps/web/src/components/theme-toggle.tsx`:

Client component using `useTheme()` from next-themes. Dropdown with Sun/Moon/Monitor icons for light/dark/system.

**Step 4: Create user menu**

Create `apps/web/src/components/user-menu.tsx`:

Dropdown showing:
- User name + email
- Sign out button

**Step 5: Create sidebar navigation**

Create `apps/web/src/components/app-sidebar.tsx`:

- Dashboard link (map icon)
- New Observation link (plus icon)
- Collapsible on desktop, sheet overlay on mobile
- Active state with amber accent

**Step 6: Verify layout renders**

Start dev server and verify the shell renders with placeholder content.

**Step 7: Commit**

```bash
git add apps/web/
git commit -m "feat: add app layout shell with header, sidebar, theme toggle, and user menu"
```

---

### Task 7: Build Dashboard Page

**Files:**
- Create: `apps/web/src/app/(app)/dashboard/page.tsx`
- Create: `apps/web/src/components/dashboard/stats-cards.tsx`
- Create: `apps/web/src/components/dashboard/observations-table.tsx`
- Create: `apps/web/src/components/dashboard/observations-map.tsx`
- Create: `apps/web/src/lib/actions/observations.ts` (server actions)

**Step 1: Install map dependencies**

```bash
cd /Users/bgorzelic/dev/projects/firevector/apps/web
npm install react-map-gl mapbox-gl
npm install -D @types/mapbox-gl
```

**Step 2: Create server actions for fetching observations**

Create `apps/web/src/lib/actions/observations.ts`:

Server actions:
- `getObservations()` - fetch all observations for the current user, ordered by updated_at desc
- `getObservationStats()` - count total, draft, complete observations for stat cards

**Step 3: Create stats cards**

Create `apps/web/src/components/dashboard/stats-cards.tsx`:

3-4 cards in a responsive grid:
- Total Observations (count)
- Active Drafts (count)
- Completed (count)
- Latest Activity (relative time)

Each card: dark card background, amber accent icon, large monospace number, label below. Glow effect on hover.

**Step 4: Create observations table**

Create `apps/web/src/components/dashboard/observations-table.tsx`:

shadcn Table showing:
- Incident Name
- Date
- Status (badge: amber for draft, green for complete)
- EWS Ratio (monospace)
- Projected ROS (monospace)
- Actions (edit link)

Responsive: becomes card list on mobile (each observation as a card with key metrics).

**Step 5: Create map component**

Create `apps/web/src/components/dashboard/observations-map.tsx`:

Client component using react-map-gl:
- Mapbox dark-v11 style (respects theme toggle)
- Markers/pins at each observation's lat/lng
- Popup on click showing incident name + key metrics
- Default center: California (37.5, -119.5), zoom 6
- Responsive height: 400px mobile, fills available space desktop

**Step 6: Assemble dashboard page**

Create `apps/web/src/app/(app)/dashboard/page.tsx`:

Layout:
- Stats cards row across top
- Desktop: Map (60%) | Table (40%) side by side
- Mobile: Map (collapsible) → Table (card list)

**Step 7: Commit**

```bash
git add apps/web/
git commit -m "feat: add dashboard with stats cards, observations table, and Mapbox map"
```

---

### Task 8: Build Observation Form

**Files:**
- Create: `apps/web/src/app/(app)/observations/new/page.tsx`
- Create: `apps/web/src/app/(app)/observations/[id]/page.tsx`
- Create: `apps/web/src/components/observation-form/index.tsx`
- Create: `apps/web/src/components/observation-form/incident-section.tsx`
- Create: `apps/web/src/components/observation-form/environment-section.tsx`
- Create: `apps/web/src/components/observation-form/wind-slope-section.tsx`
- Create: `apps/web/src/components/observation-form/ros-section.tsx`
- Create: `apps/web/src/components/observation-form/log-section.tsx`
- Create: `apps/web/src/components/observation-form/safety-section.tsx`
- Create: `apps/web/src/components/observation-form/location-picker.tsx`
- Create: `apps/web/src/lib/validations/observation.ts` (Zod schemas)
- Modify: `apps/web/src/lib/actions/observations.ts` (add create/update actions)

**Step 1: Create Zod validation schema**

Create `apps/web/src/lib/validations/observation.ts`:

Zod schema that mirrors the Drizzle schema. Used for both client-side validation and server action input validation.

**Step 2: Create form section components**

Each section is a self-contained component receiving form state and onChange handlers:

- **incident-section.tsx**: Incident name, observer, date/time, perimeter notes, growth notes
- **environment-section.tsx**: Relative humidity slider/input, fuel type checkboxes (litter, grass, crown)
- **wind-slope-section.tsx**: Two-column layout (Observed | Predicted) with fields for eye-level WS, midflame WS, slope contribution. Auto-calculated total EWS and EWS ratio displayed with amber monospace styling and flash animation on change.
- **ros-section.tsx**: Observed ROS input, direction toggle (faster/slower), auto-calculated projected ROS with same flash animation.
- **log-section.tsx**: Dynamic list of observation entries. Add/remove buttons. Each entry: time, fire behavior notes, weather trends.
- **safety-section.tsx**: LCES checklist with four checkboxes. Visual indicator when all four are checked (green glow).
- **location-picker.tsx**: Mini Mapbox map. Click to place a pin. Shows lat/lng coordinates. Draggable marker.

**Step 3: Create the main form component**

Create `apps/web/src/components/observation-form/index.tsx`:

Client component that:
- Manages form state with React state (or react-hook-form if cleaner)
- Imports `recompute` from `@firevector/engine`
- On any wind/slope/ROS field change, runs `recompute()` and updates derived fields
- Sections rendered in order with visual section dividers
- Sticky footer with "Save Draft" and "Mark Complete" buttons
- "Mark Complete" validates all required fields via Zod before saving

**Step 4: Create server actions for create/update**

Add to `apps/web/src/lib/actions/observations.ts`:

- `createObservation(data)` - validate with Zod, recompute server-side, insert into DB, return observation ID
- `updateObservation(id, data)` - validate, recompute, update in DB
- `deleteObservation(id)` - soft delete or hard delete with confirmation

**Step 5: Create the new observation page**

Create `apps/web/src/app/(app)/observations/new/page.tsx`:

Server component that renders the form with empty initial state.

**Step 6: Create the edit observation page**

Create `apps/web/src/app/(app)/observations/[id]/page.tsx`:

Server component that fetches observation by ID, verifies ownership, renders form with existing data.

**Step 7: Commit**

```bash
git add apps/web/
git commit -m "feat: add observation form with real-time EWS/ROS calculations and location picker"
```

---

## Phase 3: Polish & Deploy

### Task 9: Add Accessibility & Responsive Polish

**Files:**
- Modify: All component files as needed
- Create: `apps/web/src/components/skip-link.tsx`
- Create: `apps/web/src/components/visually-hidden.tsx`

**Step 1: Add skip navigation link**

Create skip-to-content link at top of app layout, visible on focus.

**Step 2: Audit form accessibility**

- All inputs have associated `<label>` elements
- Error messages linked with `aria-describedby`
- Form sections use `<fieldset>` and `<legend>`
- Focus management: auto-focus first field on form load
- Tab order follows visual order
- All interactive elements have visible focus indicators (amber ring)

**Step 3: Audit color contrast**

Verify all text/background combinations meet WCAG 2.1 AA ratios:
- Normal text: 4.5:1 minimum
- Large text (18px+ or 14px+ bold): 3:1 minimum
- UI components and graphical objects: 3:1 minimum

**Step 4: Audit responsive behavior**

Test at breakpoints:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (iPad)
- 1024px (iPad landscape / small laptop)
- 1440px (desktop)

Verify:
- No horizontal scrolling at any breakpoint
- Touch targets minimum 48x48px
- Map is usable on mobile (pinch zoom works)
- Form is usable with one hand on mobile
- Table gracefully collapses to cards

**Step 5: Add subtle animations**

- Amber flash on computed value changes (EWS, ROS)
- Card hover: subtle scale + glow
- Page transitions: fade in
- Map marker: pulse animation on new observations
- Loading states: skeleton cards with shimmer effect

**Step 6: Commit**

```bash
git add apps/web/
git commit -m "feat: add accessibility audit fixes, responsive polish, and micro-animations"
```

---

### Task 10: Set Up GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/ISSUE_TEMPLATE/bug_report.md`
- Create: `.github/ISSUE_TEMPLATE/feature_request.md`
- Create: `.github/pull_request_template.md`

**Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run lint --workspace=apps/web

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit --project apps/web/tsconfig.json

  test-engine:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run test:engine

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test-engine]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run build
    env:
      SKIP_ENV_VALIDATION: true
```

**Step 2: Create issue templates**

Bug report template with:
- Description, steps to reproduce, expected behavior, actual behavior
- Environment info (browser, OS, device)
- Screenshots section

Feature request template with:
- Problem description, proposed solution, alternatives considered
- Use case / who benefits

**Step 3: Create PR template**

```markdown
## Summary

<!-- Brief description of changes -->

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist

- [ ] Tests pass locally
- [ ] Lint and type-check pass
- [ ] Accessibility checked (keyboard nav, screen reader)
- [ ] Responsive design verified (mobile + desktop)
- [ ] No console errors or warnings
```

**Step 4: Commit**

```bash
git add .github/
git commit -m "ci: add GitHub Actions workflow, issue templates, and PR template"
```

---

### Task 11: Write Project Documentation

**Files:**
- Create: `LICENSE`
- Modify: `README.md` (rewrite from scratch)
- Create: `CONTRIBUTING.md`
- Create: `docs/architecture.md`
- Create: `docs/deployment.md`
- Create: `docs/domain-model.md`

**Step 1: Create MIT license**

Create `LICENSE` with MIT license text, copyright Brian Gorzelic / AI Aerial Solutions 2026.

**Step 2: Write README.md**

Structure:
- Hero section: project name, one-line description, tech stack badges
- Screenshot placeholder (we'll add real screenshots after deploy)
- "What is Firevector?" - 2-3 paragraphs explaining the mission
- "Features" - bullet list with descriptions
- "Quick Start" - local dev setup in 5 steps
- "Tech Stack" - table of technologies with links
- "Architecture" - Mermaid diagram of the monorepo structure
- "Contributing" - link to CONTRIBUTING.md
- "Deployment" - link to docs/deployment.md
- "License" - MIT
- "Acknowledgments" - Cal OES, NWCG, open-source community

**Step 3: Write CONTRIBUTING.md**

- Prerequisites (Node 22+, npm, Mapbox token, Google OAuth credentials)
- Local setup instructions (clone, install, env vars, db push, run)
- Code style (TypeScript strict, Tailwind, shadcn conventions)
- Testing (vitest for engine, manual testing for UI)
- PR process (branch from main, CI must pass)
- Architecture overview with links to docs/

**Step 4: Write docs/architecture.md**

Mermaid diagrams:
- System architecture (monorepo packages, data flow)
- Auth flow (Google → NextAuth → session → middleware)
- Calculation flow (form input → engine recompute → display)
- Component hierarchy (layout → pages → sections → primitives)
- Database ERD

**Step 5: Write docs/deployment.md**

Step-by-step Vercel deployment:
1. Fork the repo
2. Create Vercel project, link to repo
3. Add Vercel Postgres store
4. Set up Google OAuth credentials in Google Cloud Console
5. Create Mapbox account, get access token
6. Configure environment variables in Vercel
7. Deploy
8. (Optional) Add custom domain

**Step 6: Write docs/domain-model.md**

Plain-English explanation of fire behavior concepts:
- What is EWS (Effective Wind Speed) and why it matters
- What is ROS (Rate of Spread) and how it's calculated
- The LCES safety protocol (Lookouts, Communications, Escape Routes, Safety Zones)
- How field observations feed into administrative decision-making
- Reference to NWCG standards

**Step 7: Commit**

```bash
git add LICENSE README.md CONTRIBUTING.md docs/
git commit -m "docs: add README, contributing guide, architecture docs, and deployment guide"
```

---

### Task 12: Deploy to Vercel

**Files:**
- Modify: `apps/web/next.config.ts` (if output config needed)
- Modify: Root `package.json` (if Vercel build command needs adjustment)

**Step 1: Create Vercel project**

Via Vercel dashboard or CLI:

```bash
npx vercel --cwd apps/web
```

Configure:
- Framework: Next.js
- Root directory: `apps/web`
- Build command: `cd ../.. && npm run build`
- Output directory: `apps/web/.next`

**Step 2: Add Vercel Postgres**

In Vercel dashboard: Storage → Create → Postgres → Connect to project.

This auto-populates `POSTGRES_URL` and related env vars.

**Step 3: Run database migration**

```bash
cd apps/web
npx drizzle-kit push
```

**Step 4: Set up Google OAuth credentials**

In Google Cloud Console:
1. Create a new project (or use existing)
2. Enable Google+ API / Google Identity
3. Create OAuth 2.0 Client ID
4. Authorized redirect URIs: `https://firevector.org/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID and Client Secret to Vercel env vars

**Step 5: Set up Mapbox**

1. Create account at mapbox.com
2. Copy default public access token
3. Add as `NEXT_PUBLIC_MAPBOX_TOKEN` in Vercel env vars

**Step 6: Generate AUTH_SECRET**

```bash
npx auth secret
```

Add the generated value to Vercel env vars.

**Step 7: Configure custom domain**

In Vercel dashboard: Project → Domains → Add `firevector.org`

Update DNS at your registrar:
- A record: `76.76.21.21`
- CNAME: `cname.vercel-dns.com` (for www subdomain if desired)

**Step 8: Deploy**

```bash
npx vercel --prod --cwd apps/web
```

**Step 9: Verify**

- Visit https://firevector.org
- Google OAuth login works
- Dashboard loads
- Create a test observation
- Map displays correctly
- Theme toggle works
- Mobile responsive

**Step 10: Commit any final config changes**

```bash
git add .
git commit -m "chore: finalize Vercel deployment configuration"
```

---

## Phase 4: Final Polish

### Task 13: Add Loading States & Error Handling

**Files:**
- Create: `apps/web/src/app/(app)/dashboard/loading.tsx`
- Create: `apps/web/src/app/(app)/observations/[id]/loading.tsx`
- Create: `apps/web/src/components/observation-form/form-skeleton.tsx`
- Create: `apps/web/src/app/error.tsx`
- Create: `apps/web/src/app/not-found.tsx`

**Step 1: Create loading skeletons**

Dashboard loading: skeleton cards + skeleton table with shimmer animation.
Form loading: skeleton form sections.

**Step 2: Create error boundary**

App-level error page with retry button, styled to match theme.

**Step 3: Create 404 page**

Custom not-found page with "back to dashboard" link.

**Step 4: Add toast notifications**

Use shadcn toast for:
- "Observation saved" (success)
- "Observation deleted" (info)
- Validation errors (destructive)
- Auth errors (destructive)

**Step 5: Commit**

```bash
git add apps/web/
git commit -m "feat: add loading skeletons, error boundaries, and toast notifications"
```

---

### Task 14: Screenshots & Final README

**Step 1: Take screenshots**

After deployment, capture:
- Login page (dark theme)
- Dashboard with map and observations (dark theme)
- Observation form with calculated values (dark theme)
- Mobile view of dashboard
- Light theme variant

**Step 2: Update README with screenshots**

Add screenshot images to `docs/screenshots/` and reference in README.

**Step 3: Final commit**

```bash
git add .
git commit -m "docs: add screenshots to README"
```

---

## Task Dependency Graph

```
Task 1 (Scaffold) ──→ Task 2 (Design System) ──→ Task 5 (Login Page)
                  ──→ Task 3 (Database) ──→ Task 4 (Auth) ──→ Task 5
                                                           ──→ Task 6 (Layout)
Task 5 + Task 6 ──→ Task 7 (Dashboard)
Task 6 + Task 3 ──→ Task 8 (Form)
Task 7 + Task 8 ──→ Task 9 (Accessibility)
Task 9 ──→ Task 10 (CI) ──→ Task 11 (Docs) ──→ Task 12 (Deploy)
Task 12 ──→ Task 13 (Polish) ──→ Task 14 (Screenshots)
```

## Environment Variables Required

| Variable | Source | Required |
|----------|--------|----------|
| `POSTGRES_URL` | Vercel Postgres | Yes |
| `AUTH_SECRET` | `npx auth secret` | Yes |
| `GOOGLE_CLIENT_ID` | Google Cloud Console | Yes |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console | Yes |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox account | Yes |
| `AUTH_URL` | Your domain (http://localhost:3000 for dev) | Yes |
