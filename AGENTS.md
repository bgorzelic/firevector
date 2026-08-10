# Firevector

## What this is

Firevector is a free, open-source wildfire observation and fire-behavior calculation application for firefighters. It digitizes the NWCG observation form and computes Effective Wind Speed (EWS), EWS ratios, and projected Rate of Spread (ROS) from field observations.

The repository is an npm workspaces monorepo containing shared TypeScript schema and calculation-engine packages plus a Next.js web application.

## Setup / install

Prerequisites are Node.js 22+, npm, PostgreSQL, Google OAuth credentials, and a Mapbox access token.

```bash
npm install
cp apps/web/.env.local.example apps/web/.env.local
npx drizzle-kit push --config=apps/web/drizzle.config.ts
npm run dev
```

Populate `apps/web/.env.local` with the variables documented in `README.md` before pushing the schema or running features that use external services. The development server runs at `http://localhost:3000`.

## Build / test / lint

```bash
# Production build
npm run build

# Calculation-engine tests
npm run test:engine

# One engine test file
npx vitest run --workspace=packages/engine src/__tests__/engine.test.ts

# Web tests
npm run test:web

# Web lint
npm run lint --workspace=apps/web
```

The root `npm test` script runs the engine tests and then `npm run test:api`, but `services/api` is not present in the current repository. Do not treat the root aggregate test as runnable until that service or script is restored.

## Code style / conventions

- TypeScript uses strict mode with an ES2022 target and bundler module resolution. The contribution guide prohibits `any`; use `unknown` with type guards when needed.
- The web app uses the Next.js Core Web Vitals and TypeScript ESLint configurations.
- Use Tailwind CSS v4 utilities. Follow existing shadcn/ui patterns in `apps/web/src/components/ui/`; the contribution guide says custom CSS files should be exceptional.
- Order imports as built-in modules, external packages, internal `@firevector/*` workspace packages, then relative imports.
- Calculation functions propagate incomplete inputs as `null`; do not substitute defaults or throw for missing calculation data.
- Calculation changes require Vitest coverage for normal operation, each nullable input, and edge cases. UI changes require manual checks at desktop and mobile viewports in addition to available automated tests.

## Working with multiple agents here

This repository can be worked on by multiple parallel Claude Code or Codex agents launched with this machine's `launch-agents` tool. Each agent receives its own git worktree automatically; do not create branches manually for that workflow.

For multi-agent tasks, check the shared coordination database for file claims before editing any file another agent might be touching. Keep changes within the files claimed for your task and coordinate overlaps through the shared messaging system.

Use Conventional Commits, as established in `CONTRIBUTING.md` and the repository history (for example, `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, and `chore:`).

Never commit secrets. The root `.gitignore` currently covers `.env`, `.env.local`, and `.env.*.local`, but confirm the relevant ignore rules before assuming any environment or credential file is safe.
