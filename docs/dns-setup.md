# DNS & Email Setup Guide

This guide walks you through setting up your own domain with a Firevector deployment. By the end, you will have a custom domain pointing to your Vercel-hosted app, transactional email (account verification, password resets) powered by Resend, and optional inbound email routing through Cloudflare.

**You will need:**

- A domain name (e.g., `firevector.org`)
- A Cloudflare account (free) -- for DNS management and email routing
- A Resend account (free) -- for transactional email
- A Vercel account (free) -- for hosting

## Prerequisites

- **A registered domain** -- purchase from any registrar (Namecheap, Google Domains, Cloudflare Registrar, etc.)
- **Cloudflare account (free tier)** -- for DNS management and email routing
- **Resend account (free tier -- 3,000 emails/month)** -- for transactional email (account verification, password resets)
- **Vercel account (free tier)** -- for hosting the Next.js app

Before you begin, transfer your domain's nameservers to Cloudflare. Cloudflare will walk you through this when you add your domain to their dashboard.

## Step 1: Point Your Domain to Vercel

In the Cloudflare dashboard, go to **Your Domain > DNS > Records** and add these A records:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `@` (root) | `76.76.21.21` | Proxied (orange cloud) |
| A | `www` | `76.76.21.21` | Proxied (orange cloud) |

Then configure the domain in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings > Domains**
3. Add your domain (e.g., `firevector.org`)
4. Vercel will detect the DNS records and confirm the connection

## Step 2: Set Up Resend for Transactional Email

Resend handles sending emails from your application (verification emails, password resets, etc.).

1. Create an account at [resend.com](https://resend.com)
2. Go to **Domains > Add Domain** and enter your domain
3. Resend will display DNS records you need to add. Add all of the following in your Cloudflare DNS settings:

### DKIM (Domain Verification)

This record proves that emails sent through Resend are authorized by your domain.

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| TXT | `resend._domainkey` | *(Resend provides a long DKIM public key starting with `p=MIGfMA...`)* | DNS only (gray cloud) | 1 hour |

Copy the full value exactly as Resend shows it -- it will be a long string.

### SPF (Sender Authentication)

These records go on the `send` subdomain and authorize Resend's infrastructure to send email on your behalf.

| Type | Name | Content | Priority | Proxy | TTL |
|------|------|---------|----------|-------|-----|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 | DNS only (gray cloud) | 1 hour |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | -- | DNS only (gray cloud) | 1 hour |

### DMARC (Optional but Recommended)

DMARC tells receiving mail servers what to do with messages that fail authentication checks. Starting with `p=none` lets you monitor without blocking anything.

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| TXT | `_dmarc` | `v=DMARC1; p=none;` | DNS only (gray cloud) | Auto |

For production, upgrade DMARC to `p=quarantine` after you have verified that email delivery works correctly.

4. Go back to the Resend dashboard and click **Verify DNS Records**
5. Wait for verification -- this usually takes 1-5 minutes with Cloudflare

## Step 3: Set Up Cloudflare Email Routing (Optional)

If you want to receive email at your domain (e.g., `noreply@yourdomain.com` forwarding to your personal email), Cloudflare Email Routing handles this for free.

1. Go to **Cloudflare Dashboard > Your Domain > Email > Email Routing**
2. Click **Enable Email Routing**
3. Cloudflare will automatically add MX records for receiving mail
4. Under **Routing Rules**, add a custom address:
   - `noreply@yourdomain.com` forwards to your personal email
   - Or set a **catch-all**: `*@yourdomain.com` forwards to your email

### Important: SPF Record Merge

If you enable Cloudflare Email Routing, your root domain SPF record should include Cloudflare:

```
v=spf1 include:_spf.mx.cloudflare.net ~all
```

Note: Resend's SPF record is on the `send` subdomain, so there is no conflict with the root domain SPF. Each subdomain has its own independent SPF record.

## Step 4: Configure Environment Variables

Add these to your `.env.local` file for local development, and to your Vercel project settings (**Settings > Environment Variables**) for production:

```bash
# Resend (from resend.com dashboard > API Keys)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email sender (use your domain)
EMAIL_FROM="YourApp <noreply@yourdomain.com>"

# Your deployment URL (used by NextAuth and email links)
AUTH_URL=https://yourdomain.com
```

Replace `yourdomain.com` with your actual domain throughout.

## Step 5: Verify Everything Works

1. **Register a new account** on your deployment
2. **Check that the verification email arrives** in your inbox (check spam if needed)
3. **Verify the email** by clicking the link and sign in
4. **Test the forgot password flow** to confirm password reset emails work
5. **Check email headers** for SPF/DKIM pass:
   - In Gmail: open the email, click the three dots menu, then **Show original**
   - Look for `spf=pass` and `dkim=pass` in the authentication results

If emails are not arriving, double-check your DNS records in Cloudflare and ensure they are set to **DNS only** (gray cloud), not **Proxied** (orange cloud). TXT and MX records should never be proxied.

## DNS Record Reference

Complete list of DNS records for a full Firevector deployment:

| Type | Name | Content | Purpose |
|------|------|---------|---------|
| A | `@` | `76.76.21.21` | Vercel hosting |
| A | `www` | `76.76.21.21` | Vercel hosting |
| TXT | `resend._domainkey` | *(from Resend dashboard)* | DKIM email signing |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | Resend email sending |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | Resend SPF authorization |
| TXT | `_dmarc` | `v=DMARC1; p=none;` | Email authentication policy |
| MX | `@` | *(Cloudflare MX servers)* | Email routing (optional) |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | Cloudflare email routing SPF |

## Costs

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| Cloudflare | Free (DNS, email routing, CDN) | N/A for this use case |
| Resend | 3,000 emails/month | $20/month for 50,000 emails |
| Vercel | Hobby (free) | Pro $20/month |
| Domain | ~$10-15/year | -- |
| PostgreSQL (Supabase) | 500MB free | $25/month |
| Mapbox | 50,000 map loads/month free | Pay-as-you-go |

**Total to run Firevector: $10-15/year** (just the domain cost on free tiers)
