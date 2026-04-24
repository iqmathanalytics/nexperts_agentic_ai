type Env = {
  STRIPE_SECRET_KEY: string;
  PAYMENTS_GSHEET_WEBHOOK_URL?: string;
  SITE_URL?: string;
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

type StripeSession = {
  id: string;
  payment_status?: string;
  amount_total?: number;
  currency?: string;
  customer_email?: string;
  created?: number;
  metadata?: Record<string, string>;
  client_reference_id?: string;
};

export async function onRequestOptions({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsFor(origin, env) });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  const cors = corsFor(origin, env);

  if (!env.PAYMENTS_GSHEET_WEBHOOK_URL) {
    return Response.json(
      { error: "Payments sheet webhook is not configured (PAYMENTS_GSHEET_WEBHOOK_URL)." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
  if (!env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Stripe secret is missing on server." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  let body: { session_id?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const sessionId = String(body.session_id || "").trim();
  if (!sessionId) {
    return Response.json({ error: "session_id is required." }, { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
    headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` },
  });
  const stripeJson = (await stripeRes.json()) as StripeSession & { error?: { message?: string } };

  if (!stripeRes.ok) {
    return Response.json(
      { error: stripeJson?.error?.message || "Could not fetch checkout session from Stripe." },
      { status: 502, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const metadata = stripeJson.metadata || {};
  const payload = new URLSearchParams({
    sheet: "Payments",
    status: stripeJson.payment_status || "unknown",
    sessionId: stripeJson.id,
    payerName: metadata.buyer_name || "",
    payerEmail: stripeJson.customer_email || stripeJson.client_reference_id || "",
    payerPhone: metadata.buyer_phone || "",
    currency: stripeJson.currency || "",
    amountTotal: String(stripeJson.amount_total ?? ""),
    source: request.url,
    submittedAt: new Date((stripeJson.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
    note: metadata.note || "",
  });

  await fetch(env.PAYMENTS_GSHEET_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });

  return Response.json({ ok: true }, { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
}
