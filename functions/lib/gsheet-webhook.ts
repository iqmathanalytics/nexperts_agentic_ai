/** Build a Google Apps Script–friendly form body (urlencoded + JSON fallback). */

export type GsheetLeadPayload = {
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  submittedAt: string;
  programmePage: string;
  course: string;
};

export function resolveGsheetWebhookUrl(env: Record<string, string | undefined>): string | null {
  return (
    env.ENQUIRY_GSHEET_WEBHOOK_URL?.trim() ||
    env.PAYMENTS_GSHEET_WEBHOOK_URL?.trim() ||
    env.GSHEET_WEBHOOK_URL?.trim() ||
    env.VITE_GSHEET_WEBHOOK_URL?.trim() ||
    null
  );
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
  // Duplicate keys Apps Script / Sheets may expect
  if (fields.programmePage) {
    params.set("programme_page", fields.programmePage);
  }
  if (fields.course) {
    params.set("course_key", fields.course);
  }
  params.set("jsonPayload", JSON.stringify(fields));
  return params.toString();
}

/** Google returns 200 even for HTML errors — require JSON { ok: true }. */
export function isGsheetWebhookSuccess(result: { ok: boolean; status: number; body: string }): boolean {
  if (!result.ok || result.status < 200 || result.status >= 300) return false;
  const text = result.body.trim();
  if (!text) return false;
  try {
    const json = JSON.parse(text) as { ok?: boolean };
    return json.ok === true;
  } catch {
    return text.includes('"ok":true') || text.includes('"ok": true');
  }
}

export async function postToGsheetWebhook(
  webhookUrl: string,
  fields: Record<string, string>,
): Promise<{ ok: boolean; status: number; body: string }> {
  const body = buildGsheetFormBody(fields);
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "Content-Length": String(new TextEncoder().encode(body).length),
    },
    body,
    redirect: "follow",
  });
  const text = await res.text();
  const parsed = { ok: res.ok, status: res.status, body: text.slice(0, 2000) };
  return {
    ...parsed,
    ok: isGsheetWebhookSuccess(parsed),
  };
}
