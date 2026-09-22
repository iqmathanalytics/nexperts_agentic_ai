# Agentic AI Launchpad

Landing page for the Agentic AI Engineering programme, built with React, Vite, TypeScript, Tailwind, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:8080`.

The enquiry acknowledgement email links to **`/Agentic_AI_Engineering_Curriculum.pdf`**, which must live in **`public/Agentic_AI_Engineering_Curriculum.pdf`** so it is copied to the site root on build.

## Enquiry form (Brevo email + optional Google Sheets + optional Zoho CRM)

The enquiry form in `src/components/landing/Enquire.tsx` sends email through your Cloudflare Pages Function `POST /api/send-enquiry-emails` (Brevo). When `ENQUIRY_GSHEET_WEBHOOK_URL` (or `PAYMENTS_GSHEET_WEBHOOK_URL` / `GSHEET_WEBHOOK_URL`) is set on the server, the same handler also appends a **Leads** row (including `programmePage`: Agentic AI vs Vibe Coding). When Zoho secrets are set, it also **upserts a Zoho CRM Lead** by Email (soft-fail: email/Sheets still succeed if Zoho errors).

**Important:** Use one Apps Script **Web app** deployment URL everywhere (`.env`, `.dev.vars`, Cloudflare secrets). The API only treats a sheet write as successful when the script JSON includes `programmePage` and `course` (latest `scripts/google-apps-script-doPost.gs`). If an old deployment only returns `{ ok: true }`, the browser posts again via `VITE_GSHEET_WEBHOOK_URL`. Delete any stale `GSHEET_WEBHOOK_URL` secret that points at an older `/exec` URL.

### Brevo (required for enquiries to succeed)

1. In **Cloudflare Pages → Settings → Secrets** (or `wrangler pages secret put BREVO_API_KEY`), add:
   - `BREVO_API_KEY` — your Brevo API key (server-only; never commit or prefix with `VITE_`)
   - `BREVO_SENDER_EMAIL` — a **verified sender** in Brevo (e.g. `enquiry@nexpertsacademy.com`)
2. Optional secrets: `BREVO_SENDER_NAME`, `ENQUIRY_LEAD_EMAIL` (default `enquiry@nexpertsacademy.com`), `SITE_PUBLIC_URL` (canonical URL for CTA buttons in the user email, e.g. `https://nexpertsai.com`).

Two emails are sent on each successful enquiry: a branded acknowledgement to the visitor, and a lead summary to the admissions inbox.

**If `enquiry@nexpertsacademy.com` does not receive mail:** on some Brevo plans or sandbox modes, only **authorised / test recipients** receive outbound mail. Add that address (and your own test inbox) under **Transactional → authorised recipients** in Brevo, or disable sandbox restrictions. The acknowledgement email also **BCCs** the lead inbox so you still get a copy of the visitor confirmation when the separate lead summary cannot be delivered.

Local testing with Functions: create `.dev.vars` (gitignored) with `BREVO_API_KEY=...` and run `npm run build` then `npx wrangler pages dev dist`. For Vite-only dev, set `VITE_CHECKOUT_API_URL` in `.env` to a preview URL that serves the Functions.

### Google Sheets (optional)

1. Copy `.env.example` to `.env`.
2. Set your Google Apps Script Web App URL:

```bash
VITE_GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec
```

In `.dev.vars` (local Functions) set the **same** URL:

```bash
ENQUIRY_GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec
PAYMENTS_GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec
```

After pasting `scripts/google-apps-script-doPost.gs` into Apps Script: **Deploy → Manage deployments → edit your Web app → Version: latest** (or create a new deployment and update all env vars to the new `/exec` URL).

**Cloudflare Pages secrets:** If `ENQUIRY_GSHEET_WEBHOOK_URL` still points at an older `/exec` URL (e.g. deployment id starting with `AKfycbzF65…`), the API will skip that deployment and the browser will log the row via `VITE_GSHEET_WEBHOOK_URL` instead. Update all server secrets to the **same** latest `/exec` URL as in `.env` / `.dev.vars` (e.g. `AKfycbz3a4g0…`).

3. Restart `npm run dev` and `npm run dev:api` after changing env vars.

Verify:

```bash
npm run test:gsheet
npm run test:enquiry-api
```

### Zoho CRM (optional — enquiry Leads)

Same Free/paid Zoho org as other Nexperts sites. Enquiries upsert into **Leads** by **Email** via `functions/lib/zoho-crm.ts` (server-only OAuth refresh + upsert). Brevo and Sheets keep working if Zoho fails.

1. In Zoho API Console (**India:** [api-console.zoho.in](https://api-console.zoho.in/)), create a **Self Client** for nexpertsai (or reuse academy credentials if you accept shared rotation risk).
2. Generate a refresh token with scopes that allow creating/updating Leads (e.g. `ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.UPDATE` or modules ALL).
3. In Cloudflare Pages secrets (and `.dev.vars` locally) set:

```bash
ZOHO_CLIENT_ID=...
ZOHO_CLIENT_SECRET=...
ZOHO_REFRESH_TOKEN=...
# India CRM (crm.zoho.in):
ZOHO_ACCOUNTS_URL=https://accounts.zoho.in
ZOHO_API_DOMAIN=https://www.zohoapis.in
```

Optional: `ZOHO_LEAD_SOURCE` (default `Website`), `ZOHO_WEBSITE_VALUE` (default `nexpertsai.com`), `ZOHO_COMPANY_MODE` (`programme` | `site` | `off`, default `programme` → **Company** = programme label), `ZOHO_PROGRAMME_FIELD` / `ZOHO_LANDING_URL_FIELD` for custom API names.

#### Field map (what to verify on a Lead)

| CRM field | Value from nexpertsai |
|-----------|------------------------|
| First / Last Name | Split from form name |
| Email | Upsert key |
| Phone / Mobile | Form phone |
| Lead Source | `Website` (unless overridden) |
| Website | `nexpertsai.com` |
| Company | Programme label (`Agentic AI`, `Vibe Coding`, `Generative AI Corporate`) |
| Description | Site, programme, course, channel, landing URL, message |

#### Separate Nexperts AI leads (Free tier — custom list view)

Free Zoho cannot add a second Leads module. Use a **custom view** instead:

1. Open **Leads** → views menu → **Create Custom View**.
2. Name: `Nexperts AI`.
3. Criteria: **Website** → **is** → `nexpertsai.com`.
4. Add columns: Last Name, Email, Phone, **Company** (programme), Website, Created Time.
5. Save. Use this view as the “AI tab”; keep **All Leads** (or another view) for academy.

Optional second view: **Company** → **is** → `Agentic AI` (or Vibe / Corporate) for programme-level queues.

#### Production checklist (do not break Brevo / Sheets)

1. Confirm Cloudflare has the same `ZOHO_*` secrets as `.dev.vars` (including `.in` hosts).
2. Redeploy / wait for Functions to pick up secrets.
3. Submit one live enquiry → response includes `"zohoLogged": true`.
4. Confirm Lead in CRM under the **Nexperts AI** view; Brevo ack email and Sheets row still arrive as before.

5. Unit tests (no live Zoho call):

```bash
npm test
```

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
- Writes **`Timestamp`** (server time), **`programmePage`** (`Agentic AI` / `Vibe Coding`), and **`course`** on every row (Leads and Payments)
- Infers programme from `source` URL when fields are missing (legacy rows)

After editing the script: **Deploy → Manage deployments → Edit → New version → Deploy** (required or Sheets will keep using the old code).

