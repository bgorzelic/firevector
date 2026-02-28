# Architecture

This document describes the system architecture of Firevector, including package relationships, authentication flow, calculation pipeline, database design, and component hierarchy.

## System Architecture

Firevector is an npm workspaces monorepo with shared packages consumed by application layers.

```mermaid
graph TB
    subgraph Monorepo["firevector monorepo"]
        subgraph SharedPackages["Shared Packages"]
            Schema["@firevector/schema<br/><i>TypeScript types only</i><br/>FireObservation, WindSlope,<br/>RateOfSpread, SafetyAudit"]
            Engine["@firevector/engine<br/><i>Pure calculation functions</i><br/>calculateTotalEws, calculateEwsRatio,<br/>calculateRos, recompute"]
        end

        subgraph Applications["Applications"]
            Web["apps/web<br/><i>Next.js 16 App Router</i><br/>Server Components + Client Forms"]
        end

        subgraph PlannedServices["Planned Services"]
            API["services/api<br/><i>Python FastAPI</i><br/>REST API for mobile clients"]
        end
    end

    subgraph ExternalServices["External Services"]
        GoogleOAuth["Google OAuth 2.0"]
        VercelPG["Vercel Postgres"]
        OpenMeteo["Open-Meteo API"]
        Mapbox["Mapbox GL JS"]
    end

    Schema -->|"types"| Engine
    Schema -->|"types"| Web
    Schema -->|"types"| API
    Engine -->|"calculations"| Web
    Web -->|"auth"| GoogleOAuth
    Web -->|"queries"| VercelPG
    Web -->|"weather fetch"| OpenMeteo
    Web -->|"map rendering"| Mapbox

    style Schema fill:#3178C6,color:#fff
    style Engine fill:#2563EB,color:#fff
    style Web fill:#000,color:#fff
    style API fill:#009688,color:#fff
```

### Package Dependency Graph

```
@firevector/schema    (zero dependencies -- types only)
       |
       v
@firevector/engine    (depends on schema for type imports)
       |
       v
   apps/web           (depends on schema + engine)
```

The schema package has no runtime dependencies. The engine package imports types from schema but has no other runtime dependencies -- its calculation functions are pure TypeScript with zero external packages. This means the calculation engine can run entirely client-side with no network calls.

## Authentication Flow

Firevector uses NextAuth.js v5 with Google OAuth for authentication.

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextJS as Next.js App
    participant NextAuth as NextAuth.js v5
    participant Google as Google OAuth
    participant DB as Vercel Postgres

    User->>Browser: Click "Sign in with Google"
    Browser->>NextJS: GET /api/auth/signin
    NextJS->>NextAuth: Initiate OAuth flow
    NextAuth->>Google: Redirect to Google consent screen
    Google->>User: Show consent screen
    User->>Google: Grant permission
    Google->>NextAuth: Authorization code callback
    NextAuth->>Google: Exchange code for tokens
    Google->>NextAuth: Access token + ID token
    NextAuth->>DB: Create/update user record<br/>Create account link<br/>Create session
    NextAuth->>Browser: Set session cookie
    Browser->>NextJS: Subsequent requests include session
    NextJS->>NextAuth: Validate session
    NextAuth->>DB: Look up session
    DB->>NextAuth: User data
    NextAuth->>NextJS: Authenticated user context
    NextJS->>Browser: Render protected content
```

### Route Protection

- **Public routes:** Landing page, sign-in page
- **Protected routes:** `/observations/*`, `/map`, `/settings` -- require active session
- **API routes:** Server actions validate session before database operations
- Unauthenticated users are redirected to the sign-in page

## Calculation Flow

The engine's `recompute()` function is the central calculation entrypoint. It takes raw inputs and produces all derived fields in a single pass.

```mermaid
flowchart TD
    subgraph Inputs["Raw Inputs (from form)"]
        MidflameObs["Observed Midflame WS"]
        SlopeObs["Observed Slope Contribution"]
        MidflamePred["Predicted Midflame WS"]
        SlopePred["Predicted Slope Contribution"]
        ObsROS["Observed ROS"]
        Direction["ROS Direction<br/>(faster | slower)"]
    end

    subgraph Engine["@firevector/engine"]
        CalcEWS1["calculateTotalEws()<br/>observed column"]
        CalcEWS2["calculateTotalEws()<br/>predicted column"]
        CalcRatio["calculateEwsRatio()"]
        CalcROS["calculateRos()"]
    end

    subgraph Outputs["Derived Fields (displayed)"]
        TotalEWSobs["Observed Total EWS"]
        TotalEWSpred["Predicted Total EWS"]
        EWSRatio["EWS Ratio"]
        ProjROS["Projected ROS"]
    end

    MidflameObs --> CalcEWS1
    SlopeObs --> CalcEWS1
    MidflamePred --> CalcEWS2
    SlopePred --> CalcEWS2

    CalcEWS1 --> TotalEWSobs
    CalcEWS2 --> TotalEWSpred

    CalcEWS1 --> CalcRatio
    CalcEWS2 --> CalcRatio
    CalcRatio --> EWSRatio

    ObsROS --> CalcROS
    EWSRatio --> CalcROS
    Direction --> CalcROS
    CalcROS --> ProjROS

    style Engine fill:#1E3A5F,color:#fff
```

### Null Propagation

Every calculation function returns `null` when any required input is `null`. This means:

- Partially filled forms display calculated values only where all inputs are present
- No exceptions are thrown for incomplete data
- The UI can simply show a blank or placeholder for any `null` result

## Database ERD

```mermaid
erDiagram
    users {
        uuid id PK
        string name
        string email UK
        string image
        timestamp emailVerified
    }

    accounts {
        uuid id PK
        uuid userId FK
        string type
        string provider
        string providerAccountId
        string access_token
        string refresh_token
        int expires_at
        string token_type
        string scope
        string id_token
    }

    sessions {
        uuid id PK
        uuid userId FK
        string sessionToken UK
        timestamp expires
    }

    observations {
        uuid id PK
        uuid userId FK
        string status "draft | complete"
        string incident_name
        string observer_name
        timestamp observation_datetime
        text perimeter_notes
        text growth_notes
        float relative_humidity
        boolean fuel_litter
        boolean fuel_grass
        boolean fuel_crown
        jsonb wind_slope "WindSlope object"
        jsonb ros "RateOfSpread object"
        jsonb safety "SafetyAudit object"
        jsonb weather_meta "WeatherMeta object"
        timestamp created_at
        timestamp updated_at
    }

    observation_log_entries {
        uuid id PK
        uuid observationId FK
        string time
        text fire_behavior_notes
        text weather_trends
        int sort_order
    }

    users ||--o{ accounts : "has"
    users ||--o{ sessions : "has"
    users ||--o{ observations : "owns"
    observations ||--o{ observation_log_entries : "contains"
```

### Design Decisions

- **JSONB columns** for `wind_slope`, `ros`, `safety`, and `weather_meta` -- these are structured objects that are always read and written as a whole, not queried individually. JSONB keeps the schema simple while preserving type safety through Drizzle ORM.
- **Separate `observation_log_entries` table** -- log entries are a variable-length list that benefits from normalized storage for ordering and individual updates.
- **NextAuth tables** (`users`, `accounts`, `sessions`) follow the [NextAuth.js Drizzle adapter schema](https://authjs.dev/getting-started/adapters/drizzle).

## Component Hierarchy

```mermaid
graph TD
    subgraph Layout["Root Layout"]
        Nav["Navbar<br/><i>auth status, navigation</i>"]
        Main["Main Content Area"]
    end

    subgraph Pages["Pages (App Router)"]
        Landing["/ Landing Page<br/><i>public</i>"]
        SignIn["/sign-in<br/><i>Google OAuth</i>"]
        ObsList["/observations<br/><i>observation list</i>"]
        ObsDetail["/observations/[id]<br/><i>observation form</i>"]
        MapView["/map<br/><i>map view</i>"]
    end

    subgraph FormSections["Observation Form Sections"]
        IncidentSection["IncidentSection<br/><i>name, observer, datetime</i>"]
        EnvSection["EnvironmentSection<br/><i>humidity, fuel types</i>"]
        WindSlopeSection["WindSlopeSection<br/><i>observed vs predicted EWS</i>"]
        ROSSection["RateOfSpreadSection<br/><i>observed ROS, direction, projected</i>"]
        LogSection["ObservationLogSection<br/><i>timestamped entries</i>"]
        SafetySection["SafetyAuditSection<br/><i>LCES checklist</i>"]
    end

    subgraph UIPrimitives["UI Primitives (shadcn/ui)"]
        Button["Button"]
        Input["Input"]
        Select["Select"]
        Card["Card"]
        Checkbox["Checkbox"]
        Badge["Badge"]
        Dialog["Dialog"]
    end

    Main --> Pages
    ObsDetail --> FormSections
    FormSections --> UIPrimitives

    IncidentSection --> Input
    EnvSection --> Checkbox
    WindSlopeSection --> Input
    ROSSection --> Input
    ROSSection --> Select
    SafetySection --> Checkbox
    LogSection --> Input

    style Layout fill:#111,color:#fff
    style Pages fill:#1a1a2e,color:#fff
    style FormSections fill:#16213e,color:#fff
    style UIPrimitives fill:#0f3460,color:#fff
```

### Key Patterns

- **Server Components by default** -- Pages and layouts are React Server Components. Only form sections that need interactivity are Client Components (`"use client"`).
- **Server Actions for mutations** -- Form submissions call Next.js Server Actions, which validate the session and write to the database.
- **Engine runs client-side** -- The `recompute()` function runs in the browser on every input change for instant feedback. The server re-validates on save.
- **Optimistic updates** -- Form state updates immediately in the UI while the server action processes in the background.
