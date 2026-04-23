# Agentic AI Launchpad

Landing page for the Agentic AI Engineering programme, built with React, Vite, TypeScript, Tailwind, and shadcn/ui.

## Run locally

```bash
npm install
npm run dev
```

App runs on `http://localhost:8080`.

## Enquiry form -> Google Sheets integration

The enquiry form in `src/components/landing/Enquire.tsx` posts to a Google Apps Script Web App endpoint.

1. Copy `.env.example` to `.env`.
2. Set your Google Apps Script Web App URL:

```bash
VITE_GSHEET_WEBHOOK_URL=https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec
```

3. Restart `npm run dev` after changing env vars.

### Expected payload fields

The form sends urlencoded fields:

- `name`
- `phone`
- `email`
- `message`
- `submittedAt` (ISO timestamp)
- `source` (page URL)

### Minimal Google Apps Script example

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Leads");
  sheet.appendRow([
    new Date(),
    e.parameter.name || "",
    e.parameter.phone || "",
    e.parameter.email || "",
    e.parameter.message || "",
    e.parameter.source || "",
    e.parameter.submittedAt || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```
