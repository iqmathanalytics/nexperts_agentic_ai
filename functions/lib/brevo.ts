import { CONTACT_EMAIL } from "./contact";

export type BrevoEnv = {
  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
};

export type BrevoRecipient = { email: string; name?: string };

export function normalizeEmail(s: string): string {
  return s.trim().toLowerCase();
}

export function brevoSafeDisplayName(s: string | undefined, max = 70): string | undefined {
  if (!s) return undefined;
  const t = s
    .normalize("NFKC")
    .replace(/["\r\n\t]/g, " ")
    .trim()
    .slice(0, max);
  return t || undefined;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendBrevoEmail(
  env: BrevoEnv,
  opts: {
    to: BrevoRecipient[];
    subject: string;
    html: string;
    replyTo?: { email: string; name?: string };
  },
): Promise<{ ok: boolean; status: number; body: string }> {
  const senderEmail = env.BREVO_SENDER_EMAIL?.trim() || CONTACT_EMAIL;
  const senderName = env.BREVO_SENDER_NAME?.trim() || "Nexperts Academy";

  const to = opts.to.map((r) => {
    const display = brevoSafeDisplayName(r.name);
    return {
      email: normalizeEmail(r.email),
      ...(display ? { name: display } : {}),
    };
  });

  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to,
    subject: opts.subject,
    htmlContent: opts.html,
  };

  if (opts.replyTo) {
    payload.replyTo = {
      email: normalizeEmail(opts.replyTo.email),
      ...(brevoSafeDisplayName(opts.replyTo.name) ? { name: brevoSafeDisplayName(opts.replyTo.name) } : {}),
    };
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 2000) };
}
