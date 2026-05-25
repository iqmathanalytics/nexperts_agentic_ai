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

export type GsheetPaymentPayload = {
  status: string;
  sessionId: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  currency: string;
  amountTotal: string;
  source: string;
  submittedAt: string;
  note: string;
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

export function buildGsheetFormBody(fields: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    params.set(key, String(value ?? ""));
  }
  // Apps Script can merge this if e.parameter misses camelCase keys.
  params.set("jsonPayload", JSON.stringify(fields));
  return params;
}

export async function postToGsheetWebhook(
  webhookUrl: string,
  fields: Record<string, string>,
): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: buildGsheetFormBody(fields).toString(),
    redirect: "follow",
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body: body.slice(0, 2000) };
}
