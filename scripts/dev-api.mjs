/**
 * Local Pages Functions dev — binds .dev.vars webhook URLs so they override
 * stale Cloudflare dashboard secrets (old Apps Script deployment).
 */
import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const devVarsPath = resolve(root, ".dev.vars");

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
  for (const key of [
    "GSHEET_WEBHOOK_URL",
    "ENQUIRY_GSHEET_WEBHOOK_URL",
    "PAYMENTS_GSHEET_WEBHOOK_URL",
    "DEMO_GSHEET_WEBHOOK_URL",
    "DEMO_GSHEET_SPREADSHEET_ID",
  ]) {
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

console.log("Starting wrangler pages dev (webhook URLs from .dev.vars bindings)");
const child = spawn("npx", args, { cwd: root, stdio: "inherit", shell: true });
child.on("exit", (code) => process.exit(code ?? 0));
