# Contributing to Firevector

Thank you for your interest in contributing to Firevector. Whether you're a developer, a firefighter with feature ideas, or someone who wants to improve the docs, we appreciate the help.

## Prerequisites

- **Node.js 22+** and **npm** ([download](https://nodejs.org/))
- **Mapbox access token** -- [create a free account](https://account.mapbox.com/auth/signup/)
- **Google OAuth credentials** -- [set up in Google Cloud Console](https://console.cloud.google.com/apis/credentials) (see [deployment guide](docs/deployment.md) for detailed steps)
- **PostgreSQL database** -- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) for production, or any PostgreSQL instance for local development

## Local Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/firevector.git
cd firevector

# 2. Install all workspace dependencies
npm install

# 3. Create your environment file
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your credentials:

```env
# Authentication (Google OAuth)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_SECRET=generate-a-random-string

# Database (Vercel Postgres or any PostgreSQL)
POSTGRES_URL=postgresql://user:password@host:5432/firevector

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-access-token
```

```bash
# 4. Push the database schema
npx drizzle-kit push --config=apps/web/drizzle.config.ts

# 5. Start the development server
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
firevector/
├── packages/
│   ├── schema/       # @firevector/schema -- TypeScript types (no runtime deps)
│   └── engine/       # @firevector/engine -- Pure calculation functions
├── apps/
│   └── web/          # Next.js 16 frontend
├── services/
│   └── api/          # Python FastAPI backend (planned)
└── docs/             # Architecture, deployment, domain model
```

Cross-package imports use workspace references (`@firevector/schema`, `@firevector/engine`).

## Code Style

- **TypeScript strict mode** -- No `any` types. Use `unknown` with type guards when needed.
- **Tailwind CSS v4** -- Utility-first styling. No custom CSS files unless absolutely necessary.
- **shadcn/ui conventions** -- Components live in `apps/web/src/components/ui/`. Use the existing component patterns.
- **Null propagation** -- Calculation functions return `null` when inputs are incomplete. No defaults, no exceptions for missing data.
- **Imports** -- Follow the ordering: built-in modules, external packages, internal workspace packages (`@firevector/*`), relative imports.

## Testing

### Calculation Engine

The engine package has comprehensive Vitest tests:

```bash
# Run all engine tests
npm run test:engine

# Run a specific test file
npx vitest run --workspace=packages/engine src/__tests__/engine.test.ts
```

Every calculation function must have tests covering:
- Normal operation with valid inputs
- Null propagation (each nullable input tested individually)
- Edge cases (zero values, equal values, boundary conditions)

### Web Application

```bash
# Run web app tests
npm run test:web
```

For UI changes, manual testing is expected in addition to automated tests. Test on both desktop and mobile viewports.

### Running All Tests

```bash
npm test
```

## Pull Request Process

1. **Branch from `main`** -- Create a feature branch with a descriptive name:
   ```bash
   git checkout -b feat/add-weather-overlay
   git checkout -b fix/ews-ratio-rounding
   ```

2. **Write your changes** -- Follow the code style guidelines above.

3. **Add or update tests** -- If you're changing calculation logic, tests are required. For UI changes, describe manual testing steps in your PR.

4. **CI must pass** -- All tests and linting checks must pass before merge.

5. **Describe your changes** -- Write a clear PR description explaining:
   - What changed and why
   - How to test it
   - Screenshots for UI changes
   - Any breaking changes

6. **One approval required** -- A maintainer will review your PR.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add weather overlay to map view
fix: correct EWS ratio calculation for equal values
docs: update deployment guide with Mapbox setup
refactor: extract observation form into sub-components
test: add edge case tests for ROS calculation
chore: update vitest to v3.1
```

## Architecture Documentation

For a deeper understanding of the system design, see:

- [Architecture](docs/architecture.md) -- System diagrams, auth flow, database ERD
- [Domain Model](docs/domain-model.md) -- Fire behavior concepts explained

## Questions?

Open an issue on GitHub. We're happy to help newcomers get started.
