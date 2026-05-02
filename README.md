# Agentic AI Launchpad

Landing page for the Agentic AI Engineering programme, built with React, Vite, TypeScript, Tailwind, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:8080`.

## Enquiry form (Brevo email + optional Google Sheets)

The enquiry form in `src/components/landing/Enquire.tsx` sends email through your Cloudflare Pages Function `POST /api/send-enquiry-emails` (Brevo). Optionally it still posts to a Google Apps Script Web App if `VITE_GSHEET_WEBHOOK_URL` is set.

### Brevo (required for enquiries to succeed)

1. In **Cloudflare Pages → Settings → Secrets** (or `wrangler pages secret put BREVO_API_KEY`), add:
   - `BREVO_API_KEY` — your Brevo API key (server-only; never commit or prefix with `VITE_`)
   - `BREVO_SENDER_EMAIL` — a **verified sender** in Brevo (e.g. `info@nexpertsai.com`)
2. Optional secrets: `BREVO_SENDER_NAME`, `ENQUIRY_LEAD_EMAIL` (default `enquiry@nexpertsacademy.com`), `SITE_PUBLIC_URL` (canonical URL for CTA buttons in the user email, e.g. `https://nexpertsacademy.com`).

Two emails are sent on each successful enquiry: a branded acknowledgement to the visitor, and a lead summary to the admissions inbox.

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

1. Create a **Product** and a **one-time Price** (e.g. RM 399 + handle SST the way you prefer — often a tax rate or inclusive price).
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

### Expected payload fields

The form sends urlencoded fields:

- `name`
- `phone` (sent with a leading `'` so Google Sheets keeps it as **plain text**; see Apps Script note below)
- `email`
- `message`
- `submittedAt` (ISO timestamp)
- `source` (page URL)

### Minimal Google Apps Script example

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Leads");
  var phone = e.parameter.phone || "";
  sheet.appendRow([
    new Date(),
    e.parameter.name || "",
    phone,
    e.parameter.email || "",
    e.parameter.message || "",
    e.parameter.source || "",
    e.parameter.submittedAt || ""
  ]);
  // Phone column is index 3 here — force text format so +60 numbers never become scientific notation.
  var phoneCell = sheet.getRange(sheet.getLastRow(), 3);
  phoneCell.setNumberFormat("@");
  phoneCell.setValue(phone.replace(/^'/, ""));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
