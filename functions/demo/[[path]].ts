const DEMO_UPSTREAM = "https://agentic-ai-demo.pages.dev";

type PagesFunctionContext = {
  request: Request;
};

/**
 * Upstream demo app is already built with base `/demo/`.
 * Keep the same pathname so `/demo/assets/...` maps 1:1.
 */
function toUpstreamUrl(requestUrl: URL): URL {
  const upstreamUrl = new URL(DEMO_UPSTREAM);
  const pathname = requestUrl.pathname.replace(/\/+$/, "") || "/demo";

  // /demo -> /demo/ (upstream SPA entry)
  upstreamUrl.pathname = pathname === "/demo" ? "/demo/" : pathname;
  upstreamUrl.search = requestUrl.search;

  return upstreamUrl;
}

export const onRequest = async ({ request }: PagesFunctionContext): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const upstreamUrl = toUpstreamUrl(requestUrl);

  const upstreamRequest = new Request(upstreamUrl.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  const upstreamResponse = await fetch(upstreamRequest);
  const headers = new Headers(upstreamResponse.headers);

  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");

  const location = headers.get("location");
  if (location) {
    headers.set(
      "location",
      location
        .replace(DEMO_UPSTREAM, requestUrl.origin)
        .replace(`${requestUrl.origin}/`, `${requestUrl.origin}/`),
    );
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
};
