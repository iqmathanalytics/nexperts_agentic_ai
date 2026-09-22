/**
 * Zoho CRM Leads upsert for nexpertsai.com enquiries.
 *
 * Align with the academy site’s field contract (same org). Defaults use standard
 * Zoho Lead API names; override custom fields via env when academy uses them.
 *
 * Secrets (Cloudflare Pages / `.dev.vars` — never VITE_*):
 *   ZOHO_CLIENT_ID
 *   ZOHO_CLIENT_SECRET
 *   ZOHO_REFRESH_TOKEN
 * Optional:
 *   ZOHO_ACCOUNTS_URL     — default https://accounts.zoho.com (.in / .eu / .com.au / …)
 *   ZOHO_API_DOMAIN       — default https://www.zohoapis.com (match your DC)
 *   ZOHO_CRM_API_VERSION  — default v8
 *   ZOHO_LEAD_SOURCE      — picklist value (default Website)
 *   ZOHO_WEBSITE_VALUE    — default nexpertsai.com (distinguishes multi-site leads)
 *   ZOHO_WEBSITE_FIELD    — API name (default Website)
 *   ZOHO_COMPANY_MODE     — programme (default) | site | off
 *                           programme → Company = programme label (Agentic AI / …)
 *                           site → Company = ZOHO_WEBSITE_VALUE (easy Free-tier list filter)
 *                           off → do not set Company
 *   ZOHO_PROGRAMME_FIELD  — optional custom field API name for programme label
 *   ZOHO_LANDING_URL_FIELD — optional custom field for the page URL
 */

export type ZohoEnv = {
  ZOHO_CLIENT_ID?: string;
  ZOHO_CLIENT_SECRET?: string;
  ZOHO_REFRESH_TOKEN?: string;
  ZOHO_ACCOUNTS_URL?: string;
  ZOHO_API_DOMAIN?: string;
  ZOHO_CRM_API_VERSION?: string;
  ZOHO_LEAD_SOURCE?: string;
  ZOHO_WEBSITE_VALUE?: string;
  ZOHO_WEBSITE_FIELD?: string;
  ZOHO_COMPANY_MODE?: string;
  ZOHO_PROGRAMME_FIELD?: string;
  ZOHO_LANDING_URL_FIELD?: string;
};

export type EnquiryLeadInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  programmePage: string;
  course: string;
  channel: string;
};

export type ZohoUpsertResult = {
  ok: boolean;
  skipped?: boolean;
  status: number;
  body: string;
  action?: string;
  recordId?: string;
  error?: string;
};

const DEFAULT_ACCOUNTS = "https://accounts.zoho.com";
const DEFAULT_API = "https://www.zohoapis.com";
const DEFAULT_API_VERSION = "v8";

/** In-memory access token cache (per isolate). */
let cachedAccessToken: { token: string; expiresAtMs: number } | null = null;

export function isZohoConfigured(env: ZohoEnv): boolean {
  return Boolean(
    env.ZOHO_CLIENT_ID?.trim() && env.ZOHO_CLIENT_SECRET?.trim() && env.ZOHO_REFRESH_TOKEN?.trim(),
  );
}

export function zohoAccountsUrl(env: ZohoEnv): string {
  return (env.ZOHO_ACCOUNTS_URL?.trim() || DEFAULT_ACCOUNTS).replace(/\/$/, "");
}

export function zohoApiDomain(env: ZohoEnv): string {
  return (env.ZOHO_API_DOMAIN?.trim() || DEFAULT_API).replace(/\/$/, "");
}

export function zohoApiVersion(env: ZohoEnv): string {
  const v = (env.ZOHO_CRM_API_VERSION?.trim() || DEFAULT_API_VERSION).replace(/^\//, "");
  return v.startsWith("v") ? v : `v${v}`;
}

/** Split full name into First_Name / Last_Name (Last_Name required by Zoho). */
export function splitLeadName(fullName: string): { First_Name?: string; Last_Name: string } {
  const cleaned = fullName.replace(/\s+/g, " ").trim();
  if (!cleaned) return { Last_Name: "Website Lead" };
  const parts = cleaned.split(" ");
  if (parts.length === 1) return { Last_Name: parts[0]! };
  return {
    First_Name: parts.slice(0, -1).join(" ").slice(0, 40),
    Last_Name: parts[parts.length - 1]!.slice(0, 80),
  };
}

export function buildEnquiryDescription(input: EnquiryLeadInput): string {
  const msg = input.message.trim() || "(none)";
  return [
    "Source site: nexpertsai.com",
    `Programme: ${input.programmePage}`,
    `Course key: ${input.course}`,
    `Channel: ${input.channel}`,
    `Landing: ${input.source}`,
    "",
    "Message:",
    msg,
  ].join("\n");
}

function companyValueForLead(env: ZohoEnv, input: EnquiryLeadInput, websiteValue: string): string | null {
  const mode = (env.ZOHO_COMPANY_MODE?.trim() || "programme").toLowerCase();
  if (mode === "off" || mode === "false" || mode === "0") return null;
  if (mode === "site") return websiteValue;
  // default: programme — visible column + filterable without a custom field
  return input.programmePage.slice(0, 200);
}

/**
 * Standard Lead fields + optional custom fields from env.
 * Upsert duplicate check uses Email.
 */
export function buildEnquiryLeadRecord(
  env: ZohoEnv,
  input: EnquiryLeadInput,
): Record<string, string> {
  const names = splitLeadName(input.name);
  const websiteField = env.ZOHO_WEBSITE_FIELD?.trim() || "Website";
  const websiteValue = env.ZOHO_WEBSITE_VALUE?.trim() || "nexpertsai.com";
  const leadSource = env.ZOHO_LEAD_SOURCE?.trim() || "Website";

  const record: Record<string, string> = {
    ...names,
    Email: input.email.trim().toLowerCase(),
    Phone: input.phone.trim(),
    Mobile: input.phone.trim(),
    Lead_Source: leadSource,
    Description: buildEnquiryDescription(input).slice(0, 32000),
    [websiteField]: websiteValue,
  };

  const company = companyValueForLead(env, input, websiteValue);
  if (company) {
    record.Company = company;
  }

  const programmeField = env.ZOHO_PROGRAMME_FIELD?.trim();
  if (programmeField) {
    record[programmeField] = input.programmePage;
  }

  const landingField = env.ZOHO_LANDING_URL_FIELD?.trim();
  if (landingField) {
    record[landingField] = input.source.slice(0, 2000);
  }

  return record;
}

function clearAccessTokenCache(): void {
  cachedAccessToken = null;
}

async function refreshAccessToken(env: ZohoEnv): Promise<{ token: string; expiresInSec: number }> {
  const accounts = zohoAccountsUrl(env);
  const body = new URLSearchParams({
    refresh_token: env.ZOHO_REFRESH_TOKEN!.trim(),
    client_id: env.ZOHO_CLIENT_ID!.trim(),
    client_secret: env.ZOHO_CLIENT_SECRET!.trim(),
    grant_type: "refresh_token",
  });

  const res = await fetch(`${accounts}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const text = await res.text();
  let json: { access_token?: string; expires_in?: number | string; error?: string } = {};
  try {
    json = JSON.parse(text) as typeof json;
  } catch {
    /* ignore */
  }

  if (!res.ok || !json.access_token) {
    throw new Error(
      `Zoho token refresh failed (${res.status}): ${json.error || text.slice(0, 300)}`,
    );
  }

  const expiresInSec = Number(json.expires_in) || 3600;
  return { token: json.access_token, expiresInSec };
}

async function getAccessToken(env: ZohoEnv, forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedAccessToken && cachedAccessToken.expiresAtMs > now + 60_000) {
    return cachedAccessToken.token;
  }

  const { token, expiresInSec } = await refreshAccessToken(env);
  cachedAccessToken = {
    token,
    expiresAtMs: now + expiresInSec * 1000,
  };
  return token;
}

type ZohoUpsertResponse = {
  data?: Array<{
    code?: string;
    status?: string;
    message?: string;
    action?: string;
    details?: { id?: string };
  }>;
};

function parseUpsertSuccess(status: number, body: string): ZohoUpsertResult {
  let json: ZohoUpsertResponse | null = null;
  try {
    json = JSON.parse(body) as ZohoUpsertResponse;
  } catch {
    /* ignore */
  }

  const row = json?.data?.[0];
  const code = row?.code || "";
  const okHttp = status >= 200 && status < 300;
  const okZoho = row?.status === "success" || code === "SUCCESS" || code === "DUPLICATE_DATA";

  if (okHttp && okZoho) {
    return {
      ok: true,
      status,
      body: body.slice(0, 2000),
      action: row?.action,
      recordId: row?.details?.id,
    };
  }

  return {
    ok: false,
    status,
    body: body.slice(0, 2000),
    error: row?.message || row?.code || `HTTP ${status}`,
  };
}

async function postLeadUpsert(
  env: ZohoEnv,
  accessToken: string,
  record: Record<string, string>,
): Promise<{ status: number; body: string }> {
  const api = zohoApiDomain(env);
  const version = zohoApiVersion(env);
  const url = `${api}/crm/${version}/Leads/upsert`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [record],
      duplicate_check_fields: ["Email"],
      trigger: ["workflow"],
    }),
  });

  const body = await res.text();
  return { status: res.status, body };
}

/**
 * Upsert a Lead by Email. Soft-skips when Zoho secrets are missing.
 * Retries once on HTTP 401 after forcing a token refresh.
 */
export async function upsertEnquiryLead(
  env: ZohoEnv,
  input: EnquiryLeadInput,
): Promise<ZohoUpsertResult> {
  if (!isZohoConfigured(env)) {
    return {
      ok: false,
      skipped: true,
      status: 0,
      body: "",
      error: "Zoho CRM is not configured (missing client id/secret/refresh token).",
    };
  }

  const record = buildEnquiryLeadRecord(env, input);

  try {
    let token = await getAccessToken(env, false);
    let { status, body } = await postLeadUpsert(env, token, record);

    if (status === 401) {
      console.warn("[zoho] 401 on upsert — refreshing access token and retrying once");
      clearAccessTokenCache();
      token = await getAccessToken(env, true);
      ({ status, body } = await postLeadUpsert(env, token, record));
    }

    const result = parseUpsertSuccess(status, body);
    if (!result.ok) {
      console.warn("[zoho] Lead upsert failed:", result.error, result.body.slice(0, 400));
    } else {
      console.log(
        `[zoho] Lead upsert ok action=${result.action || "unknown"} id=${result.recordId || "n/a"} programme=${input.programmePage}`,
      );
    }
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[zoho] Lead upsert error:", message);
    return {
      ok: false,
      status: 0,
      body: "",
      error: message,
    };
  }
}

/** Test helper — reset token cache between unit tests. */
export function __resetZohoTokenCacheForTests(): void {
  clearAccessTokenCache();
}
