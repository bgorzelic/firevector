# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Firevector is a wildfire observation and fire behavior calculation tool. It digitizes the NWCG fire behavior observation form, computing derived fields like Effective Wind Speed (EWS), EWS ratios, and projected Rate of Spread (ROS) from field observations.

## Monorepo Structure

npm workspaces monorepo with three layers:

- **`packages/schema`** — Shared TypeScript types for the fire observation data model (`FireObservation`, `WindSlope`, `RateOfSpread`, etc.). No runtime deps, types-only package.
- **`packages/engine`** — Pure calculation functions (`calculateTotalEws`, `calculateEwsRatio`, `calculateRos`, `recompute`). Depends on `@firevector/schema`. All functions return `null` when inputs are incomplete — no exceptions for missing data.
- **`apps/web`** — Next.js frontend (planned, not yet scaffolded)
- **`services/api`** — Python FastAPI backend (planned, not yet scaffolded). Will use `uv` for env management.

Cross-package imports use `@firevector/schema` and `@firevector/engine` workspace references.

## Commands

```bash
# Install all workspace dependencies
npm install

# Run engine tests (Vitest)
npm run test:engine

# Run a single engine test file
npx vitest run --workspace=packages/engine src/__tests__/engine.test.ts

# Run API tests (when scaffolded)
npm run test:api          # runs: cd services/api && uv run pytest

# Run all tests
npm test                  # engine + api
```

## Tech Stack

- **TypeScript** — ES2022 target, strict mode, bundler module resolution
- **Vitest** — test runner for TS packages
- **Python / FastAPI** — planned API service (pytest for testing, uv for package management)
- **Open-Meteo** — weather data source (see `WeatherResponse` type in schema)

## Key Domain Concepts

- **EWS (Effective Wind Speed)** = midflame wind speed + slope contribution
- **EWS Ratio** = max(observed, predicted) / min(observed, predicted); null if denominator is zero
- **ROS (Rate of Spread)** — projected from observed ROS and EWS ratio; multiplied if "faster", divided if "slower"
- **`recompute()`** — the main entrypoint that recalculates all derived fields from raw inputs in a single pass
- **Null propagation** — any calculation with null inputs returns null (no defaults, no exceptions)
