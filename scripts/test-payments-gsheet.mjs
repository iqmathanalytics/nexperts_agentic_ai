/** Run: node scripts/test-payments-gsheet.mjs */
const webhook = process.env.PAYMENTS_GSHEET_WEBHOOK_URL || process.env.ENQUIRY_GSHEET_WEBHOOK_URL || process.argv[2];
if (!webhook) {
  console.error("Set PAYMENTS_GSHEET_WEBHOOK_URL or pass URL as argv[2]");
  process.exit(1);
}

const fields = {
  sheet: "Payments",
  status: "paid",
  sessionId: `cs_test_${Date.now()}`,
  payerName: "Payments Sheet Test",
  payerEmail: `payments.sheet.test+${Date.now()}@example.com`,
  payerPhone: "'601112216876",
  currency: "myr",
  amountTotal: "79900",
  source: "http://localhost:8080/payment-success",
  submittedAt: new Date().toISOString(),
  programmePage: "Agentic AI",
  course: "agentic-ai-founding",
  note: "local payments webhook test",
};

const params = new URLSearchParams();
for (const [k, v] of Object.entries(fields)) params.set(k, String(v));
params.set("programme_page", fields.programmePage);
params.set("course_key", fields.course);
params.set("jsonPayload", JSON.stringify(fields));

const body = params.toString();
console.log("POST", webhook, "sheet=Payments");

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
console.log("Status:", res.status);
console.log("Response:", text.slice(0, 500));

try {
  const json = JSON.parse(text);
  if (json.ok === true && json.programmePage && json.course) {
    console.log("OK — programmePage:", json.programmePage, "course:", json.course, "scriptTag:", json.scriptTag);
    process.exit(0);
  }
  console.error("Missing ok/programmePage/course:", json);
  process.exit(1);
} catch {
  console.error("Invalid JSON:", text.slice(0, 200));
  process.exit(1);
}
