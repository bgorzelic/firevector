# Firevector -- Project Brief

**How a production wildfire observation tool was built in a single session.**

---

## Executive Summary

Firevector is a full-stack wildfire observation web application that digitizes the NWCG fire behavior observation form and computes derived fire behavior metrics in real time. It was designed, planned, built, tested, and deployed to production in a single development session lasting approximately **2.5 hours**.

The project demonstrates what's possible when domain expertise meets AI-assisted development: a production-grade tool with authentication, a database, interactive maps, real-time calculations, accessibility compliance, and professional documentation -- all deployed to a custom domain.

---

## Timeline

| Time | Milestone |
|------|-----------|
| **0:00** | Session start -- brainstorming and requirements gathering |
| **0:15** | Design decisions finalized (architecture, theme, tech stack) |
| **0:25** | Design document written and approved |
| **0:35** | Implementation plan created (14 tasks across 4 phases) |
| **0:40** | Phase 1 begins -- scaffolding, design system, database schema |
| **1:00** | Phase 1 complete -- Next.js app running with shadcn/ui and Drizzle ORM |
| **1:10** | Phase 2 begins -- auth, login page, app layout shell |
| **1:20** | Parallel agent swarm launched (5 agents simultaneously) |
| **1:30** | Phase 2 complete -- auth, layout, login, CI pipeline, docs all merged |
| **1:40** | Phase 3 begins -- dashboard, observation form, auth wiring |
| **2:00** | Dashboard with Mapbox map and observation form with real-time calcs complete |
| **2:10** | Database wiring, server actions, form persistence complete |
| **2:15** | Loading states, error boundaries, 404 page complete |
| **2:20** | First successful Vercel deployment |
| **2:25** | Custom domain (firevector.org) configured with SSL |
| **2:30** | Accessibility polish, final README, project brief |

**Total wall-clock time: ~2.5 hours**

---

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| **Domain** (firevector.org) | ~$12/year | Purchased via registrar |
| **Vercel Hosting** | $0 | Hobby plan (free tier) |
| **Vercel Postgres** | $0 | Free tier (256 MB) |
| **Mapbox** | $0 | Free tier (50,000 loads/month) |
| **Google OAuth** | $0 | Free (Google Cloud Console) |
| **GitHub** | $0 | Free public repository |
| **Claude Code** (AI development) | ~$15-25 | Estimated API token usage for the session |
| **Developer time** | 2.5 hours | Single developer + AI assistant |
| | | |
| **Total launch cost** | **~$27-37** | Everything needed to go live |

### Ongoing Monthly Costs

| Service | Free Tier Limit | Estimated Monthly |
|---------|----------------|-------------------|
| Vercel Hosting | 100 GB bandwidth | $0 |
| Vercel Postgres | 256 MB storage | $0 |
| Mapbox | 50,000 map loads | $0 |
| Domain renewal | -- | $1/month (amortized) |
| **Total** | | **~$1/month** |

---

## What Was Built

### Codebase Metrics

| Metric | Value |
|--------|-------|
| Lines of code | ~4,900 |
| Source files | 59 |
| React components | 33 |
| Git commits | 23 |
| Unit tests | 18 |
| npm packages | 36 dependencies |
| Database tables | 5 |

### Feature Inventory

**Core Application**
- Full NWCG fire behavior observation form (6 sections)
- Real-time EWS, EWS Ratio, and Projected ROS calculations
- Draft/complete observation workflow with conditional validation
- LCES safety checklist with live status indicator
- Observation log with dynamic timestamped entries
- Interactive Mapbox map with observation pins and popups
- Dashboard with stats cards, observation table, and map view
- Observation history with edit capability

**Infrastructure**
- Google OAuth authentication (NextAuth.js v5)
- PostgreSQL database with Drizzle ORM (6 tables)
- Route protection middleware
- Server-side calculation validation
- Loading skeletons for every page
- Error boundaries with retry
- Custom 404 page

**Quality**
- TypeScript strict mode (zero type errors)
- WCAG 2.1 AA accessibility compliance
- Dark/light/system theme toggle
- Responsive design (320px to desktop)
- GitHub Actions CI (lint + typecheck + test + build)
- 18 unit tests for calculation engine

**Documentation**
- Architecture document with 5 Mermaid diagrams
- Domain model guide for non-firefighters
- Deployment guide (8-step Vercel setup)
- Contributing guide
- Issue templates (bug report, feature request)
- PR template
- This project brief

---

## Development Methodology

### AI-Assisted Development with Claude Code

The project was built using **Claude Code** (Anthropic's AI coding assistant) in a subagent-driven development workflow:

1. **Brainstorming** -- Collaborative design session with multiple-choice questions to narrow requirements
2. **Design Document** -- Full design spec written and approved before any code
3. **Implementation Plan** -- 14-task plan with specific files, code, and commands for each step
4. **Subagent Execution** -- Fresh AI agent dispatched per task with spec compliance and code quality reviews
5. **Parallel Swarm** -- Up to 5 agents running simultaneously in isolated git worktrees for independent tasks
6. **Continuous Integration** -- TypeScript type-checking and Next.js build verification after every merge

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Full-stack Next.js (no separate backend) | Calculation engine is already TypeScript; Server Actions eliminate API layer |
| oklch color system | Perceptually uniform color space for consistent theming across dark/light modes |
| Tailwind CSS v4 | New CSS-native configuration, faster builds, smaller output |
| Drizzle ORM (not Prisma) | Zero-overhead queries, better TypeScript inference, no binary dependency |
| react-hook-form + Zod | Performant form handling with schema-first validation |
| Null propagation pattern | Calculations return null for incomplete inputs -- no defaults, no exceptions |
| Server-side recompute | Form sends raw inputs; server recalculates derived fields for data integrity |

---

## Technology Stack Detail

### Frontend
- **Next.js 16** -- App Router, React Server Components, Server Actions, Turbopack
- **React 19** -- Latest stable with concurrent features
- **Tailwind CSS v4** -- CSS-native configuration with `@theme inline`
- **shadcn/ui** (New York variant) -- Accessible Radix primitives styled with Tailwind
- **next-themes** -- Dark/light/system theme management
- **react-hook-form** -- Performant form state with `useWatch` for real-time updates
- **Zod v4** -- Schema validation with `superRefine` for conditional rules
- **react-map-gl v8** -- Mapbox GL JS React bindings
- **Lucide React** -- Consistent icon library
- **Sonner** -- Toast notifications

### Backend
- **NextAuth.js v5** (beta) -- Authentication with DrizzleAdapter
- **Drizzle ORM** -- Type-safe PostgreSQL queries
- **Vercel Postgres** (Neon) -- Serverless PostgreSQL
- **Server Actions** -- Secure server-side mutations without an API layer

### Shared Packages
- **@firevector/schema** -- TypeScript type definitions (FireObservation, WindSlope, RateOfSpread)
- **@firevector/engine** -- Pure calculation functions (calculateTotalEws, calculateEwsRatio, calculateRos, recompute)

### DevOps
- **GitHub Actions** -- CI pipeline (lint, typecheck, test, build)
- **Vercel** -- Zero-config deployment with preview environments
- **npm workspaces** -- Monorepo package management

---

## Roadmap

Potential future enhancements (community contributions welcome):

- [ ] Weather auto-population from Open-Meteo API based on GPS coordinates
- [ ] PDF/CSV export of completed observations
- [ ] Offline mode with service worker and sync-on-reconnect
- [ ] React Native mobile app for iOS/Android
- [ ] Multi-language support (Spanish priority for CA crews)
- [ ] Real-time collaboration (multiple observers on same incident)
- [ ] Integration with CAL FIRE / NIFC dispatch systems
- [ ] Historical weather overlay on map
- [ ] Observation analytics and trends dashboard
- [ ] Python FastAPI backend for advanced analytics

---

## About

**Created by:** Brian Gorzelic / [AI Aerial Solutions](https://aiaerialsolutions.com)

**Built for:** Cal OES and the firefighting community

**License:** MIT -- Free to use, modify, and distribute

**Live at:** [firevector.org](https://firevector.org)
