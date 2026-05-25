/**
 * Google Sheets Apps Script webhook — server-side only.
 * Use ONE deployment URL (latest script with header-map). Never use VITE_* here (client-only, may be an old deployment).
 */

const SERVER_WEBHOOK_ENV_KEYS = [
  "GSHEET_WEBHOOK_URL",
  "ENQUIRY_GSHEET_WEBHOOK_URL",
  "PAYMENTS_GSHEET_WEBHOOK_URL",
] as const;

/** Previous web-app deployment (Version 1 script — empty programmePage/course). */
const LEGACY_GSHEET_DEPLOYMENT_MARKERS = ["AKfycbzF65kSQKBrih2fL-b66uTbrnU3Yrm7V5t6DKWDl15LAjvCIjgcTIPtiuKDVChOIAR7qg"];

export type GsheetWebhookJson = {
  ok?: boolean;
  programmePage?: string;
  course?: string;
  sheet?: string;
  scriptTag?: string;
  error?: string;
};

export function gsheetDeploymentId(url: string): string | null {
  return url.match(/\/macros\/s\/([^/]+)\//)?.[1] ?? null;
}

function isLegacyGsheetWebhookUrl(url: string): boolean {
  return LEGACY_GSHEET_DEPLOYMENT_MARKERS.some((marker) => url.includes(marker));
}

type WebhookCandidate = { key: (typeof SERVER_WEBHOOK_ENV_KEYS)[number]; url: string };

function collectWebhookCandidates(
  env: Record<string, string | undefined>,
  priority: readonly (typeof SERVER_WEBHOOK_ENV_KEYS)[number][],
): WebhookCandidate[] {
  const candidates: WebhookCandidate[] = [];
  for (const key of priority) {
    const url = env[key]?.trim();
    if (url) candidates.push({ key, url });
  }
  return candidates;
}

function pickWebhookUrl(
  env: Record<string, string | undefined>,
  priority: readonly (typeof SERVER_WEBHOOK_ENV_KEYS)[number][],
): string | null {
  const candidates = collectWebhookCandidates(env, priority);
  if (candidates.length === 0) return null;

  const uniqueUrls = [...new Set(candidates.map((c) => c.url))];
  const modern = candidates.filter((c) => !isLegacyGsheetWebhookUrl(c.url));

  if (uniqueUrls.length > 1) {
    const pick = (modern[0] ?? candidates[0])!;
    console.warn(
      `[gsheet] Multiple webhook URLs in env (deployments: ${uniqueUrls.map(gsheetDeploymentId).join(", ")}). ` +
        `Using ${pick.key}. Update Cloudflare Pages secrets to the latest /exec URL.`,
    );
    return pick.url;
  }

  const only = candidates[0]!.url;
  if (isLegacyGsheetWebhookUrl(only)) {
    console.warn(
      "[gsheet] Webhook URL points at legacy Apps Script deployment (Version 1). " +
        "Skipping server-side sheet log — update ENQUIRY_GSHEET_WEBHOOK_URL / PAYMENTS_GSHEET_WEBHOOK_URL in Cloudflare Pages to the latest /exec URL.",
    );
    return null;
  }

  return only;
}

export function resolveGsheetWebhookUrl(env: Record<string, string | undefined>): string | null {
  return pickWebhookUrl(env, ["ENQUIRY_GSHEET_WEBHOOK_URL", "PAYMENTS_GSHEET_WEBHOOK_URL", "GSHEET_WEBHOOK_URL"]);
}

export function resolvePaymentsGsheetWebhookUrl(env: Record<string, string | undefined>): string | null {
  return pickWebhookUrl(env, ["PAYMENTS_GSHEET_WEBHOOK_URL", "ENQUIRY_GSHEET_WEBHOOK_URL", "GSHEET_WEBHOOK_URL"]);
}

export function parseGsheetWebhookJson(body: string): GsheetWebhookJson | null {
  const text = body.trim();
  if (!text) return null;
  try {
    return JSON.parse(text) as GsheetWebhookJson;
  } catch {
    return null;
  }
}

/**
 * Version 4+ script returns programmePage + course in JSON.
 * Old deployments only return { ok: true } — treat as failure so browser fallback can run.
 */
export function isGsheetWebhookSuccess(result: { ok: boolean; status: number; body: string }): boolean {
  if (!result.ok || result.status < 200 || result.status >= 300) return false;
  const json = parseGsheetWebhookJson(result.body);
  if (!json || json.ok !== true) return false;
  return Boolean(json.programmePage?.trim() && json.course?.trim());
}

/** Phone with leading apostrophe so Sheets keeps +60 as text. */
export function phoneForGsheet(phone: string): string {
  const clean = String(phone || "").trim();
  return clean.startsWith("'") ? clean : `'${clean}`;
}

export function buildGsheetFormBody(fields: Record<string, string>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    params.set(key, String(value ?? ""));
  }
  if (fields.programmePage) params.set("programme_page", fields.programmePage);
  if (fields.course) params.set("course_key", fields.course);
  params.set("jsonPayload", JSON.stringify(fields));
  return params.toString();
}

async function fetchGsheetPost(
  url: string,
  body: string,
): Promise<{ res: Response; text: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
    redirect: "follow",
  });
  const text = await res.text();
  return { res, text };
}

export async function postToGsheetWebhook(
  webhookUrl: string,
  fields: Record<string, string>,
): Promise<{ ok: boolean; status: number; body: string; json: GsheetWebhookJson | null }> {
  const body = buildGsheetFormBody(fields);
  const { res, text } = await fetchGsheetPost(webhookUrl, body);
  const json = parseGsheetWebhookJson(text);
  const parsed = { ok: res.ok, status: res.status, body: text.slice(0, 2000), json };
  return {
    ...parsed,
    ok: isGsheetWebhookSuccess(parsed),
  };
}
