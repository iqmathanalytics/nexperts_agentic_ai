/**
 * Local Pages Functions dev — bind selected .dev.vars so they override stale
 * Cloudflare dashboard secrets (Stripe price IDs, webhooks, etc.).
 */
import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const devVarsPath = resolve(root, ".dev.vars");

/** Keys that must override remote dashboard values during local dev. */
const OVERRIDE_KEYS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_VIBE_PRICE_ID",
  "GSHEET_WEBHOOK_URL",
  "ENQUIRY_GSHEET_WEBHOOK_URL",
  "PAYMENTS_GSHEET_WEBHOOK_URL",
  "DEMO_GSHEET_WEBHOOK_URL",
  "DEMO_GSHEET_SPREADSHEET_ID",
];

function parseDevVars(content) {
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

const bindings = [];
if (existsSync(devVarsPath)) {
  const vars = parseDevVars(readFileSync(devVarsPath, "utf8"));
  for (const key of OVERRIDE_KEYS) {
    if (vars[key]) bindings.push("-b", `${key}=${vars[key]}`);
  }
}

const args = [
  "wrangler",
  "pages",
  "dev",
  "dist",
  "--port",
  "8788",
  "--compatibility-date=2024-11-01",
  ...bindings,
];

console.log("Starting wrangler pages dev (.dev.vars overrides dashboard Stripe + sheet URLs)");
const child = spawn("npx", args, { cwd: root, stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
