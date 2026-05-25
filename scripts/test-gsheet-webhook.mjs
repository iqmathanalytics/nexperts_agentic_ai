/** Run: node scripts/test-gsheet-webhook.mjs */
const webhook = process.env.ENQUIRY_GSHEET_WEBHOOK_URL || process.argv[2];
if (!webhook) {
  console.error("Set ENQUIRY_GSHEET_WEBHOOK_URL or pass URL as argv[2]");
  process.exit(1);
}

const fields = {
  sheet: "Leads",
  name: "Local Webhook Test",
  phone: "'601112216870",
  email: `local.webhook.test+${Date.now()}@example.com`,
  message: "programmePage column verification",
  source: "http://localhost:8080/#enquire",
  submittedAt: new Date().toISOString(),
  programmePage: "Agentic AI",
  course: "agentic-ai-founding",
  channel: "local_test",
};

const params = new URLSearchParams();
for (const [k, v] of Object.entries(fields)) params.set(k, String(v));
params.set("jsonPayload", JSON.stringify(fields));

const body = params.toString();
console.log("POST", webhook);
console.log("Body keys:", [...params.keys()].join(", "));

const res = await fetch(webhook, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Content-Length": String(Buffer.byteLength(body)),
  },
  body,
  redirect: "follow",
});

const text = await res.text();
console.log("Status:", res.status, res.statusText);
console.log("Response:", text.slice(0, 500));

try {
  const json = JSON.parse(text);
  if (json.ok === true && json.programmePage && json.course) {
    console.log("OK — programmePage:", json.programmePage, "course:", json.course);
    process.exit(0);
  }
  if (json.ok === true) {
    console.error(
      "Script returned ok:true but missing programmePage/course — deployment is still an OLD version. Redeploy Apps Script (Manage deployments → edit → Version: latest).",
    );
    process.exit(1);
  }
  console.error("Script returned error:", json.error || json);
  process.exit(1);
} catch {
  console.error("Response was not valid JSON:", text.slice(0, 200));
  process.exit(1);
}
