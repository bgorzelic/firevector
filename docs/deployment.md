# Deployment Guide

This guide walks through deploying Firevector to Vercel from scratch. Total time: approximately 30 minutes.

## Prerequisites

- A [GitHub](https://github.com/) account
- A [Vercel](https://vercel.com/) account (free tier works)
- A [Google Cloud](https://console.cloud.google.com/) account (for OAuth)
- A [Mapbox](https://www.mapbox.com/) account (free tier includes 50,000 map loads/month)

## Step 1: Fork the Repository

1. Go to [github.com/bgorzelic/firevector](https://github.com/bgorzelic/firevector)
2. Click **Fork** in the top-right corner
3. Keep the default settings and click **Create fork**

## Step 2: Create a Vercel Project

1. Log in to [vercel.com](https://vercel.com/)
2. Click **Add New** > **Project**
3. Import your forked `firevector` repository from GitHub
4. Configure the project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build` (default)
   - **Install Command:** `npm install` (default)
5. Do **not** deploy yet -- you need to set up environment variables first. Click **Cancel** or proceed and redeploy later.

## Step 3: Add Vercel Postgres

1. In your Vercel project dashboard, go to **Storage**
2. Click **Create** > **Postgres**
3. Choose a region close to your expected users (e.g., `us-east-1` for US-based deployments)
4. Click **Create**
5. Vercel automatically adds the `POSTGRES_URL` and related environment variables to your project

After the database is provisioned, push the schema:

```bash
# From the repository root
npx drizzle-kit push --config=apps/web/drizzle.config.ts
```

## Step 4: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services** > **OAuth consent screen**
   - Choose **External** user type
   - Fill in the app name: `Firevector`
   - Add your email as the support email and developer contact
   - Add the scope: `email`, `profile`, `openid`
   - Click **Save and Continue** through the remaining steps
4. Navigate to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth client ID**
   - Application type: **Web application**
   - Name: `Firevector Production`
   - Authorized JavaScript origins:
     - `https://your-app.vercel.app` (your Vercel deployment URL)
     - `http://localhost:3000` (for local development)
   - Authorized redirect URIs:
     - `https://your-app.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google`
6. Click **Create**
7. Copy the **Client ID** and **Client Secret**

> **Note:** Replace `your-app.vercel.app` with your actual Vercel deployment URL. If you add a custom domain later (Step 8), add that domain to the authorized origins and redirect URIs as well.

## Step 5: Create a Mapbox Account

1. Go to [mapbox.com](https://www.mapbox.com/) and create an account
2. Navigate to your [Account page](https://account.mapbox.com/)
3. Copy your **Default public token** (starts with `pk.`)
4. For production use, create a new token with URL restrictions limiting it to your deployment domain

## Step 6: Configure Environment Variables

In your Vercel project dashboard, go to **Settings** > **Environment Variables** and add the following:

| Variable | Value | Environment |
|----------|-------|-------------|
| `AUTH_GOOGLE_ID` | Your Google OAuth Client ID | Production, Preview, Development |
| `AUTH_GOOGLE_SECRET` | Your Google OAuth Client Secret | Production, Preview, Development |
| `AUTH_SECRET` | A random 32+ character string (generate with `openssl rand -base64 32`) | Production, Preview, Development |
| `AUTH_URL` | `https://your-app.vercel.app` | Production |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Your Mapbox public access token | Production, Preview, Development |

> **Note:** The `POSTGRES_URL` and related database variables are automatically added by Vercel when you provision Postgres storage in Step 3.

### Full Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_GOOGLE_ID` | Yes | Google OAuth 2.0 Client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth 2.0 Client Secret |
| `AUTH_SECRET` | Yes | NextAuth.js encryption secret (32+ random characters) |
| `AUTH_URL` | Yes (prod) | Canonical URL of your deployment (e.g., `https://firevector.app`) |
| `POSTGRES_URL` | Yes | PostgreSQL connection string (auto-set by Vercel Postgres) |
| `POSTGRES_URL_NON_POOLING` | Yes | Direct PostgreSQL connection for migrations (auto-set by Vercel Postgres) |
| `POSTGRES_PRISMA_URL` | No | Prisma-compatible URL (auto-set, not used by Drizzle) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox GL JS public access token |

## Step 7: Deploy

1. In your Vercel project dashboard, click **Deployments**
2. Click **Redeploy** on the latest deployment (or push a commit to trigger a new build)
3. Wait for the build to complete (typically 1-2 minutes)
4. Click the deployment URL to verify:
   - The landing page loads
   - Google sign-in works
   - The observation form loads after authentication
   - The map renders correctly

## Step 8: Custom Domain (Optional)

1. In your Vercel project, go to **Settings** > **Domains**
2. Enter your custom domain (e.g., `firevector.app`)
3. Follow Vercel's instructions to configure DNS:
   - **For apex domains:** Add an `A` record pointing to `76.76.21.21`
   - **For subdomains:** Add a `CNAME` record pointing to `cname.vercel-dns.com`
4. Vercel automatically provisions an SSL certificate
5. Update your Google OAuth settings:
   - Add the custom domain to **Authorized JavaScript origins**
   - Add `https://your-domain.com/api/auth/callback/google` to **Authorized redirect URIs**
6. Update the `AUTH_URL` environment variable to your custom domain

## Troubleshooting

### "OAuth redirect URI mismatch"

The redirect URI in Google Cloud Console must exactly match your deployment URL. Check:
- Protocol (`https://` not `http://`)
- No trailing slash
- The path is `/api/auth/callback/google`

### "Database connection failed"

- Verify `POSTGRES_URL` is set in your Vercel environment variables
- If using Vercel Postgres, check the Storage tab to confirm the database is active
- Run `npx drizzle-kit push` to ensure the schema is up to date

### "Map not loading"

- Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set (must be prefixed with `NEXT_PUBLIC_` to be available client-side)
- Check that the token is valid at [account.mapbox.com](https://account.mapbox.com/)
- If using URL-restricted tokens, ensure your deployment domain is in the allowed list

### Build fails

- Ensure the **Root Directory** is set to `apps/web` in Vercel project settings
- Check that all required environment variables are set
- Review the build logs in the Vercel dashboard for specific errors
