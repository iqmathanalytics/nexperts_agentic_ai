import { brevoSafeDisplayName, normalizeEmail, sendBrevoEmail, type BrevoEnv } from "../lib/brevo";
import { DEMO_CONTACT_EMAIL } from "../lib/contact";
import { getDemoDetails } from "../lib/demo-details";
import { demoConfirmationEmailHtml } from "../lib/demo-registration-email";
import { phoneForGsheet, postToDemoGsheetWebhook, resolveDemoGsheetWebhookUrl } from "../lib/gsheet-webhook";

type Env = BrevoEnv & {
  DEMO_GSHEET_WEBHOOK_URL?: string;
  DEMO_GSHEET_SPREADSHEET_ID?: string;
  ALLOWED_ORIGINS?: string;
  SITE_PUBLIC_URL?: string;
};

function parseAllowed(env: Env): string[] {
  const raw =
    env.ALLOWED_ORIGINS ||
    "http://localhost:8080,http://127.0.0.1:8080,http://localhost:8788,http://127.0.0.1:8788,https://nexpertsai.com";
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

function publicSiteUrl(env: Env, request: Request): string {
  const fromEnv = env.SITE_PUBLIC_URL?.replace(/\/$/, "").trim();
  if (fromEnv) return fromEnv;
  const origin = request.headers.get("Origin")?.replace(/\/$/, "");
  if (origin) return origin;
  return "https://nexpertsai.com";
}

export async function onRequestOptions({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsFor(origin, env) });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  const cors = corsFor(origin, env);

  const webhookUrl = resolveDemoGsheetWebhookUrl(env);
  if (!webhookUrl) {
    return Response.json(
      { ok: false, error: "Demo registration sheet is not configured (DEMO_GSHEET_WEBHOOK_URL)." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  if (!env.BREVO_API_KEY) {
    return Response.json(
      { ok: false, error: "Confirmation email is not configured (missing BREVO_API_KEY)." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    demoType?: string;
    demoTitle?: string;
    sessionDate?: string;
    sessionDateLabel?: string;
    source?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body." }, { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const name = String(body.name || "").trim().slice(0, 200);
  const email = normalizeEmail(String(body.email || "").trim()).slice(0, 320);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const demoType = String(body.demoType || "").trim();
  const sessionDate = String(body.sessionDate || "").trim().slice(0, 40);
  const source = String(body.source || "").trim().slice(0, 2000) || "https://nexpertsai.com/demo";

  const demo = getDemoDetails(demoType);
  if (!demo) {
    return Response.json(
      { ok: false, error: "Please select a valid demo programme." },
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  if (!name || !email.includes("@") || !phone) {
    return Response.json(
      { ok: false, error: "Please provide your full name, a valid email, and phone number." },
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  if (sessionDate !== demo.sessionId) {
    return Response.json(
      { ok: false, error: "Invalid session date for this demo." },
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const demoTitle = demo.title;
  const sessionDateLabel = demo.sessionLabel;
  const site = publicSiteUrl(env, request);
  const demoReplyTo = DEMO_CONTACT_EMAIL;
  const visitorDisplay = brevoSafeDisplayName(name, 120) || "Demo attendee";

  const sheetResult = await postToDemoGsheetWebhook(webhookUrl, env.DEMO_GSHEET_SPREADSHEET_ID?.trim(), {
    name,
    email,
    phone: phoneForGsheet(phone),
    demoType,
    demoTitle,
    demotitle: demoTitle,
    sessionDate,
    sessionDateLabel,
    sessionlabel: sessionDateLabel,
    source,
    submittedAt: new Date().toISOString(),
    channel: "demo_page",
  });

  if (!sheetResult.ok) {
    return Response.json(
      { ok: false, error: "Could not save registration to Google Sheets.", detail: sheetResult.body },
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const confirmation = await sendBrevoEmail(env, {
    to: [{ email, name: visitorDisplay }],
    subject: `Your ${demo.title} is confirmed — ${demo.dateDisplay} (${demo.day})`,
    html: demoConfirmationEmailHtml(name, demo, site, demoReplyTo),
    replyTo: { email: demoReplyTo, name: "Nexperts AI" },
  });

  if (!confirmation.ok) {
    return Response.json(
      {
        ok: false,
        error: "Registration was saved but the confirmation email could not be sent. Please contact us.",
        detail: confirmation.body,
      },
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  return Response.json(
    {
      ok: true,
      demoType,
      sessionDate,
      sessionDateLabel,
      emailSent: true,
    },
    { status: 200, headers: { ...cors, "Content-Type": "application/json" } },
  );
}
