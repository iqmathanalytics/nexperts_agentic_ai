/** Run: node scripts/test-enquiry-api.mjs [agentic|vibe] */
const mode = process.argv[2] || "agentic";
const api = process.env.API_URL || "http://127.0.0.1:8788/api/send-enquiry-emails";

const payload =
  mode === "vibe"
    ? {
        name: "Vibe API Local Test",
        email: `vibe.api.test+${Date.now()}@example.com`,
        phone: "601112216873",
        message: "Vibe API sheet test",
        source: "http://localhost:8080/Vibe%20coding.html",
        course: "vibe-coding-bootcamp",
        programmePage: "Vibe Coding",
        channel: "vibe_page",
      }
    : {
        name: "Agentic API Local Test",
        email: `agentic.api.test+${Date.now()}@example.com`,
        phone: "601112216874",
        message: "Agentic API sheet test",
        source: "http://localhost:8080/#enquire",
        course: "agentic-ai-founding",
        programmePage: "Agentic AI",
      };

console.log("POST", api, mode);

const res = await fetch(api, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Origin: "http://localhost:8080",
  },
  body: JSON.stringify(payload),
});

const json = await res.json().catch(() => ({}));
console.log("Status:", res.status);
console.log(JSON.stringify(json, null, 2));

if (!res.ok || !json.ok) process.exit(1);
if (json.sheetLogged !== true) {
  console.warn(
    "WARN: sheetLogged is not true — API hit an old Apps Script deployment or wrong URL. " +
      "Set ENQUIRY_GSHEET_WEBHOOK_URL in .dev.vars to the same /exec URL as VITE_GSHEET_WEBHOOK_URL; remove stale GSHEET_WEBHOOK_URL in Cloudflare.",
  );
  process.exit(2);
}
if (!json.sheetProgrammePage || !json.sheetCourse) {
  console.warn("WARN: sheet response missing programmePage/course — redeploy Apps Script to latest version.");
  process.exit(2);
}
console.log("OK — sheetLogged:", json.sheetLogged, json.sheetProgrammePage, json.sheetCourse);
