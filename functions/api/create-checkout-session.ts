/**
 * Cloudflare Pages Function — creates a Stripe Checkout Session (hosted).
 * Set secrets in the dashboard: STRIPE_SECRET_KEY, STRIPE_PRICE_ID.
 * Optional: SITE_URL (canonical origin for redirects), ALLOWED_ORIGINS (comma-separated, for CORS).
 */
type Env = {
  STRIPE_SECRET_KEY: string;
  STRIPE_PRICE_ID: string;
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

function siteOrigin(request: Request, env: Env): string {
  const fromEnv = env.SITE_URL?.replace(/\/$/, "").trim();
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
  return "http://localhost:8080";
}

export async function onRequestOptions({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const origin = request.headers.get("Origin");
  return new Response(null, { status: 204, headers: corsFor(origin, env) });
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  const originHdr = request.headers.get("Origin");
  const cors = corsFor(originHdr, env);

  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_PRICE_ID) {
    return Response.json(
      { error: "Checkout is not configured (missing Stripe secrets on the server)." },
      { status: 503, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  let body: { name?: string; email?: string; phone?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const name = String(body.name || "").trim().slice(0, 200);
  const email = String(body.email || "").trim().slice(0, 320);
  const phone = String(body.phone || "").trim().slice(0, 40);
  const message = String(body.message || "").trim().slice(0, 2000);

  if (!name || !email || !email.includes("@") || !phone) {
    return Response.json(
      { error: "Please provide your full name, a valid email, and phone number." },
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }

  const base = siteOrigin(request, env);
  const successUrl = `${base}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${base}/payment/cancel`;

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  params.set("customer_email", email);
  params.set("client_reference_id", email.slice(0, 200));
  params.set("line_items[0][price]", env.STRIPE_PRICE_ID);
  params.set("line_items[0][quantity]", "1");
  params.set("metadata[buyer_name]", name);
  params.set("metadata[buyer_phone]", phone);
  params.set("metadata[course]", "agentic-ai-founding");
  if (message) params.set("metadata[note]", message);

  const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const stripeJson = (await stripeRes.json()) as { url?: string; error?: { message?: string } };

  if (!stripeRes.ok || !stripeJson.url) {
    const msg = stripeJson.error?.message || "Could not start checkout. Please try again later.";
    return Response.json({ error: msg }, { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
  }

  return Response.json({ url: stripeJson.url }, { status: 200, headers: { ...cors, "Content-Type": "application/json" } });
}
