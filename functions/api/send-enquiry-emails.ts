/**
 * Cloudflare Pages Function — sends enquiry acknowledgement (Brevo) to the visitor
 * and a lead notification to the admissions inbox.
 *
 * Secrets (dashboard or `wrangler pages secret` / `.dev.vars` locally):
 *   BREVO_API_KEY
 * Optional:
 *   BREVO_SENDER_EMAIL   — verified sender in Brevo (default: info@nexpertsai.com)
 *   BREVO_SENDER_NAME    — display name (default: Nexperts Academy)
 *   ENQUIRY_LEAD_EMAIL   — internal recipient (default: enquiry@nexpertsacademy.com)
 *   SITE_PUBLIC_URL      — canonical site for CTA links (default: https://nexpertsacademy.com)
 *   ALLOWED_ORIGINS      — same pattern as checkout (CORS)
 */

type Env = {
  BREVO_API_KEY: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  ENQUIRY_LEAD_EMAIL?: string;
  SITE_PUBLIC_URL?: string;
  ALLOWED_ORIGINS?: string;
};

function parseAllowed(env: Env): string[] {
  const raw = env.ALLOWED_ORIGINS || "http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function corsFor(origin: string | null, env: Env): Record<string, string> {
  const allowed = parseAllowed(env);
  const o = origin && allowed.includes(origin) ? origin : allowed[0] || "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function publicSiteUrl(env: Env, request: Request): string {
  const fromEnv = env.SITE_PUBLIC_URL?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv;
  const origin = request.headers.get("Origin")?.replace(/\/$/, "");
  if (origin) return origin;
  const ref = request.headers.get("Referer");
  if (ref) {
    try {
      return new URL(ref).origin;
    } catch {
      /* ignore */
    }
  }
  return "https://nexpertsacademy.com";
}

function userAckHtml(name: string, site: string): string {
  const safeName = escapeHtml(name);
  const curriculum = `${site}/#curriculum`;
  const explore = `${site}/#top`;
  const enquire = `${site}/#enquire`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>We received your enquiry</title>
</head>
<body style="margin:0;padding:0;background:#0b0c10;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#e8e8ec;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0b0c10;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#12131a;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 20px;background:linear-gradient(135deg,#1a1f2e 0%,#12131a 55%);border-bottom:1px solid rgba(94,234,212,0.25);">
              <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#5eead4;font-weight:600;">Nexperts Academy</div>
              <h1 style="margin:12px 0 0;font-size:22px;line-height:1.25;font-weight:600;color:#ffffff;">Thank you, ${safeName}</h1>
              <p style="margin:12px 0 0;font-size:15px;line-height:1.65;color:rgba(255,255,255,0.72);">
                We have received your enquiry for the <strong style="color:#a7f3d0;">Professional Agentic AI Engineering</strong> programme.
                Our team will review your details and respond within one business day.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 8px;">
              <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:rgba(255,255,255,0.68);">
                While you wait, explore the curriculum, founding cohort offer, and live lab preview on our site.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 12px;">
                <tr>
                  <td style="padding:0 8px 12px 0;">
                    <a href="${explore}" style="display:inline-block;padding:12px 22px;border-radius:8px;background:linear-gradient(135deg,#14b8a6,#0d9488);color:#042f2e;font-size:13px;font-weight:700;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
                      Explore programme
                    </a>
                  </td>
                  <td style="padding:0 8px 12px 0;">
                    <a href="${curriculum}" style="display:inline-block;padding:12px 22px;border-radius:8px;background:rgba(255,255,255,0.06);border:1px solid rgba(94,234,212,0.35);color:#5eead4;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
                      View curriculum
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:8px 0 0;font-size:13px;line-height:1.6;color:rgba(255,255,255,0.45);">
                Prefer to add more context? You can reply to this email or use
                <a href="${enquire}" style="color:#5eead4;text-decoration:underline;">the enquiry form</a> again anytime.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <p style="margin:0;font-size:12px;line-height:1.55;color:rgba(255,255,255,0.38);">
                Nexperts Academy · Malaysia · Live instructor-led cohorts
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function leadNotificationHtml(name: string, email: string, phone: string, message: string, source: string): string {
  const m = message.trim() ? escapeHtml(message).replace(/\n/g, "<br/>") : "<span style=\"color:#888\">(none)</span>";
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /></head>
<body style="margin:0;padding:24px;background:#f4f4f5;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;">
    <tr><td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6b7280;">New lead</div>
      <h1 style="margin:8px 0 0;font-size:20px;">Website enquiry</h1>
    </td></tr>
    <tr><td style="padding:20px 24px;font-size:14px;line-height:1.65;">
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:0 0 8px;"><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p style="margin:16px 0 0;"><strong>Message:</strong></p>
      <div style="margin-top:8px;padding:12px;background:#f9fafb;border-radius:6px;border:1px solid #e5e7eb;">${m}</div>
    </td></tr>
  </table>
</body></html>`;
}

async function sendBrevoEmail(
  env: Env,
  to: { email: string; name?: string }[],
  subject: string,
  html: string,
  replyTo?: { email: string; name?: string },
): Promise<{ ok: boolean; status: number; body: string }> {
  const senderEmail = env.BREVO_SENDER_EMAIL?.trim() || "info@nexpertsai.com";
  const senderName = env.BREVO_SENDER_NAME?.trim() || "Nexperts Academy";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to,
      subject,
      htmlContent: html,
      ...(replyTo ? { replyTo } : {}),
    }),
  });

  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 500) };
}

export async function onRequestOptions({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsFor(origin, env) });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const originHdr = request.headers.get("Origin");
  const cors = corsFor(originHdr, env);

  if (!env.BREVO_API_KEY) {
    return Response.json(
      { error: "Email is not configured (missing BREVO_API_KEY on the server)." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string; source?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 320);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const message = String(body.message || "").trim().slice(0, 4000);
  const source = String(body.source || "").trim().slice(0, 2000) || "website";

  if (!name || !email || !email.includes("@") || !phone) {
    return Response.json(
      { error: "Please provide your full name, a valid email, and phone number." },
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const site = publicSiteUrl(env, request);
  const leadTo = env.ENQUIRY_LEAD_EMAIL?.trim() || "enquiry@nexpertsacademy.com";

  const ack = await sendBrevoEmail(
    env,
    [{ email, name }],
    "We received your enquiry — Nexperts Academy",
    userAckHtml(name, site),
    { email: leadTo, name: "Nexperts Academy Admissions" },
  );

  if (!ack.ok) {
    return Response.json(
      { error: "Could not send confirmation email. Please try again later.", detail: ack.body },
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const lead = await sendBrevoEmail(
    env,
    [{ email: leadTo, name: "Admissions" }],
    `New enquiry: ${name}`,
    leadNotificationHtml(name, email, phone, message, source),
    { email, name },
  );

  if (!lead.ok) {
    return Response.json(
      { error: "Your confirmation was sent, but we could not notify our team. Please email us directly.", detail: lead.body },
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  return Response.json({ ok: true }, { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
}
