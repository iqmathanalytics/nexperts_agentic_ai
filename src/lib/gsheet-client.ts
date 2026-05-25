/** Browser-side Google Sheets webhook (urlencoded + jsonPayload fallback). */

export const GSHEET_WEBHOOK_URL =
  (import.meta.env.VITE_GSHEET_WEBHOOK_URL as string | undefined)?.trim() || "";

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

export async function postToGsheetClient(fields: Record<string, string>): Promise<void> {
  const url = GSHEET_WEBHOOK_URL;
  if (!url) return;

  await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: buildGsheetFormBody(fields),
  });
}
