# :fire: Firevector

**Real-time fire behavior calculations for the field. Built for firefighters, by people who care.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/bgorzelic/firevector/actions/workflows/ci.yml/badge.svg)](https://github.com/bgorzelic/firevector/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

---

## What is Firevector?

Firevector is an open-source wildfire observation tool that digitizes the [NWCG fire behavior observation form](https://www.nwcg.gov/). Every season, fire crews across the country record wind speeds, slope contributions, and rate-of-spread observations on paper worksheets, then run the math by hand. Firevector does that math instantly -- computing Effective Wind Speed, EWS ratios, and projected Rate of Spread the moment values are entered.

This project was created for **Cal OES** and the broader firefighting community. Wildfire decisions happen fast: whether to order more resources, where to set escape routes, when to issue evacuations. Firevector gives incident commanders and field observers the derived numbers they need, right when they need them, on any device with a browser.

Firevector is and always will be **free**. No subscriptions, no paywalls, no ads. Firefighters risk their lives to protect communities. The least we can do is give them good tools.

---

## Features

- **Instant fire behavior calculations** -- EWS, EWS ratio, and projected ROS computed in real time as you type
- **NWCG-standard form** -- Digitized observation form matching the worksheets fire crews already know
- **LCES safety audit** -- Built-in Lookouts, Communications, Escape Routes, and Safety Zones checklist on every observation
- **Weather integration** -- Auto-populated weather data from Open-Meteo based on GPS location
- **Map-based observation** -- Mapbox GL JS map for pinpointing observation locations
- **Google OAuth sign-in** -- Secure authentication, no passwords to remember
- **Observation history** -- Persistent storage of all observations with draft/complete status tracking
- **Mobile-friendly** -- Responsive design for use on phones and tablets in the field
- **Offline-capable architecture** -- Calculation engine runs entirely client-side with no network dependency

---

## Architecture

```mermaid
graph TB
    subgraph Monorepo["Firevector Monorepo"]
        subgraph Packages["Shared Packages"]
            Schema["@firevector/schema<br/>TypeScript types"]
            Engine["@firevector/engine<br/>Calculation functions"]
        end

        subgraph Apps["Applications"]
            Web["apps/web<br/>Next.js 16 frontend"]
        end

        subgraph Services["Services (planned)"]
            API["services/api<br/>Python FastAPI"]
        end
    end

    subgraph External["External Services"]
        Auth["Google OAuth"]
        DB["Vercel Postgres"]
        Weather["Open-Meteo API"]
        Maps["Mapbox GL JS"]
    end

    Schema --> Engine
    Schema --> Web
    Engine --> Web
    Web --> Auth
    Web --> DB
    Web --> Weather
    Web --> Maps
    Schema --> API

    style Schema fill:#3178C6,color:#fff
    style Engine fill:#3178C6,color:#fff
    style Web fill:#000,color:#fff
    style API fill:#009688,color:#fff
```

### Data Flow

```mermaid
flowchart LR
    Input["Field Observer<br/>enters values"] --> Form["Observation Form"]
    Form --> Recompute["engine.recompute()"]
    Recompute --> EWS["Total EWS<br/>(observed & predicted)"]
    Recompute --> Ratio["EWS Ratio"]
    Recompute --> ROS["Projected ROS"]
    EWS --> Display["Real-time<br/>display"]
    Ratio --> Display
    ROS --> Display
    Display --> Save["Save to<br/>Vercel Postgres"]
```

---

## Quick Start

**Prerequisites:** Node.js 22+, npm, a [Mapbox](https://www.mapbox.com/) access token, and [Google OAuth](https://console.cloud.google.com/) credentials.

```bash
# 1. Clone the repository
git clone https://github.com/bgorzelic/firevector.git
cd firevector

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Mapbox token, Google OAuth credentials,
# and database connection string

# 4. Push the database schema
npx drizzle-kit push --config=apps/web/drizzle.config.ts

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start recording observations.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | Full-stack React with App Router |
| **Language** | TypeScript 5.7 (strict) | Type-safe codebase |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with accessible components |
| **Auth** | NextAuth.js v5 | Google OAuth sign-in |
| **Database** | Vercel Postgres + Drizzle ORM | Serverless PostgreSQL with type-safe queries |
| **Maps** | Mapbox GL JS | Interactive observation mapping |
| **Weather** | Open-Meteo API | Real-time weather data (free, no API key) |
| **Calculations** | @firevector/engine | Pure TypeScript, zero-dependency fire math |
| **Testing** | Vitest | Fast unit tests for calculation engine |
| **Deployment** | Vercel | Zero-config hosting with edge functions |

---

## Documentation

- [Architecture](docs/architecture.md) -- System design, auth flow, database ERD, component hierarchy
- [Deployment Guide](docs/deployment.md) -- Step-by-step Vercel deployment with environment variables
- [Domain Model](docs/domain-model.md) -- Fire behavior concepts explained for non-firefighters
- [Contributing](CONTRIBUTING.md) -- Local setup, code style, PR process

---

## Contributing

We welcome contributions from developers, firefighters, and anyone who wants to help. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and guidelines.

---

## License

[MIT](LICENSE) -- Copyright (c) 2026 Brian Gorzelic / AI Aerial Solutions

---

## Acknowledgments

- **[Cal OES](https://www.caloes.ca.gov/)** -- California Governor's Office of Emergency Services, whose mission inspired this project
- **[NWCG](https://www.nwcg.gov/)** -- National Wildfire Coordinating Group, for the fire behavior observation standards that Firevector digitizes
- **The firefighting community** -- The brave men and women on the line who protect lives and land every fire season. This tool is for you.
