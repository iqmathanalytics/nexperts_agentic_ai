/** Browser-side Google Sheets webhook (urlencoded + jsonPayload fallback). */

export function buildGsheetFormBody(fields: Record<string, string>): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    params.set(key, String(value ?? ""));
  }
  params.set("jsonPayload", JSON.stringify(fields));
  return params;
}

export async function postToGsheetClient(webhookUrl: string, fields: Record<string, string>): Promise<void> {
  await fetch(webhookUrl, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: buildGsheetFormBody(fields).toString(),
  });
}
