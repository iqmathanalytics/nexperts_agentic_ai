# Agentic AI Launchpad

Landing page for the Agentic AI Engineering programme, built with React, Vite, TypeScript, Tailwind, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:8080`.

The enquiry acknowledgement email links to **`/Agentic_AI_Engineering_Curriculum.pdf`**, which must live in **`public/Agentic_AI_Engineering_Curriculum.pdf`** so it is copied to the site root on build.

## Enquiry form (Brevo email + optional Google Sheets)

The enquiry form in `src/components/landing/Enquire.tsx` sends email through your Cloudflare Pages Function `POST /api/send-enquiry-emails` (Brevo). When `ENQUIRY_GSHEET_WEBHOOK_URL` or `PAYMENTS_GSHEET_WEBHOOK_URL` is set on the server, the same handler also appends a **Leads** row (including `programmePage`: Agentic AI vs Vibe Coding).

### Brevo (required for enquiries to succeed)

1. In **Cloudflare Pages → Settings → Secrets** (or `wrangler pages secret put BREVO_API_KEY`), add:
   - `BREVO_API_KEY` — your Brevo API key (server-only; never commit or prefix with `VITE_`)
   - `BREVO_SENDER_EMAIL` — a **verified sender** in Brevo (e.g. `info@nexpertsai.com`)
2. Optional secrets: `BREVO_SENDER_NAME`, `ENQUIRY_LEAD_EMAIL` (default `vaheed.2000@gmail.com`), `SITE_PUBLIC_URL` (canonical URL for CTA buttons in the user email, e.g. `https://nexpertsai.com`).

Two emails are sent on each successful enquiry: a branded acknowledgement to the visitor, and a lead summary to the admissions inbox.

**If `vaheed.2000@gmail.com` does not receive mail:** on some Brevo plans or sandbox modes, only **authorised / test recipients** receive outbound mail. Add that address (and your own test inbox) under **Transactional → authorised recipients** in Brevo, or disable sandbox restrictions. The acknowledgement email also **BCCs** the lead inbox so you still get a copy of the visitor confirmation when the separate lead summary cannot be delivered.

Local testing with Functions: create `.dev.vars` (gitignored) with `BREVO_API_KEY=...` and run `npm run build` then `npx wrangler pages dev dist`. For Vite-only dev, set `VITE_CHECKOUT_API_URL` in `.env` to a preview URL that serves the Functions.

### Google Sheets (optional)

1. Copy `.env.example` to `.env`.
2. Set your Google Apps Script Web App URL:

```bash
VITE_GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec
```

3. Restart `npm run dev` after changing env vars.

## Stripe course checkout

Checkout uses **Stripe-hosted Checkout** (redirect). Your **secret key must only exist on the server** (Cloudflare Pages secrets or another backend). Never put `sk_live_…` or `sk_test_…` in the React app, in Git, or in chat.

If a secret key was ever pasted into a message, ticket, or repo, **roll it immediately** in the [Stripe Dashboard](https://dashboard.stripe.com/apikeys) and use the new key only as a Pages secret.

### What was added in this repo

- `src/components/landing/CourseCheckout.tsx` — “Secure seat — Pay (Stripe)” opens a details form, then `POST`s to `/api/create-checkout-session`.
- `functions/api/create-checkout-session.ts` — Cloudflare Pages Function that calls Stripe’s API with `STRIPE_SECRET_KEY` and `STRIPE_PRICE_ID`.
- `src/pages/PaymentSuccess.tsx` and `src/pages/PaymentCancel.tsx` — user-facing outcomes after Stripe redirects back.

### Stripe Dashboard setup

1. Create a **Product** and a **one-time Price** (e.g. RM 799 + handle SST the way you prefer — often a tax rate or inclusive price).
2. Copy the **Price ID** (`price_…`).

### Cloudflare Pages

1. Build output directory must match `wrangler.toml` (`dist` after `npm run build`).
2. In the project **Settings → Environment variables** (or **Secrets**), add:
   - `STRIPE_SECRET_KEY` — secret
   - `STRIPE_PRICE_ID` — plain text, e.g. `price_xxx`
   - `PAYMENTS_GSHEET_WEBHOOK_URL` — your Apps Script web app URL (same spreadsheet, target tab = `Payments`)
3. Optional: `SITE_URL` = `https://your-production-domain.com` if redirect URLs must not rely on the `Origin` header.
4. Optional: `ALLOWED_ORIGINS` = comma-separated list for CORS (defaults include `http://localhost:8080` and `5173`).

Local full-stack preview with Functions:

```bash
npm run build
npx wrangler pages dev dist --compatibility-date=2024-11-01
```

For day-to-day Vite-only dev, set `VITE_CHECKOUT_API_URL` in `.env` to your deployed preview URL so the browser can reach the API (see `.env.example`).

### Payments sheet logging (real success)

On `/payment/success`, the frontend calls `/api/log-payment` with the `session_id`.
The server fetches session details from Stripe and appends to your Google Sheet (`sheet=Payments`) including:

- `status`
- `sessionId`
- `payerName`
- `payerEmail`
- `payerPhone`
- `currency`
- `amountTotal`
- `submittedAt`
- `note`
- `programmePage` — `Agentic AI` or `Vibe Coding` (which course page the booking came from)
- `course` — internal key (`agentic-ai-founding` or `vibe-coding-bootcamp`)

### Expected payload fields

**Leads (enquiries)** — urlencoded fields from `/api/send-enquiry-emails`:

- `name`
- `phone` (sent with a leading `'` so Google Sheets keeps it as **plain text**; see Apps Script note below)
- `email`
- `message`
- `submittedAt` (ISO timestamp)
- `source` (page URL)
- `programmePage` — `Agentic AI` or `Vibe Coding`
- `course` — `agentic-ai-founding` or `vibe-coding-bootcamp`

### Google Apps Script (full file)

Copy the complete script from **`scripts/google-apps-script-doPost.gs`** in this repo. It:

- Parses `e.parameter`, urlencoded `postData`, and a `jsonPayload` fallback field
- Writes **`programmePage`** (`Agentic AI` / `Vibe Coding`) and **`course`** on every row
- Infers programme from `source` URL when fields are missing (legacy rows)

After editing the script: **Deploy → Manage deployments → Edit → New version → Deploy** (required or Sheets will keep using the old code).

