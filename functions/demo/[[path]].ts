const DEMO_UPSTREAM = "https://agentic-ai-demo.pages.dev";

type PagesFunctionContext = {
  request: Request;
};

function isLikelyStaticAsset(pathname: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg|ico|css|js|map|woff2?|ttf|txt|json)$/i.test(pathname);
}

function isHtmlResponse(res: Response): boolean {
  return (res.headers.get("content-type") || "").includes("text/html");
}

/**
 * Upstream demo app is built with Vite `base: "/demo/"`.
 * Keep `/demo/...` paths 1:1 with upstream, and collapse any `/demo/demo/...` doubles.
 */
function toUpstreamUrl(requestUrl: URL): URL {
  const upstreamUrl = new URL(DEMO_UPSTREAM);
  let pathname = requestUrl.pathname;

  pathname = pathname.replace(/^\/demo\/demo(\/|$)/, "/demo$1");
  pathname = pathname.replace(/\/+$/, "") || "/demo";
  upstreamUrl.pathname = pathname === "/demo" ? "/demo/" : pathname;
  upstreamUrl.search = requestUrl.search;

  return upstreamUrl;
}

function rewriteHtml(html: string): string {
  let out = html.replaceAll("/demo/demo/", "/demo/");
  out = out.replace(/(href|src)=(["'])\/(?!demo\/)/g, "$1=$2/demo/");
  out = out.replace(/url\((["']?)\/(?!demo\/)/g, "url($1/demo/");
  return out;
}

async function fetchUpstream(request: Request, url: URL): Promise<Response> {
  const upstreamRequest = new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
    redirect: "manual",
  });

  let upstreamResponse = await fetch(upstreamRequest);

  // Some files (e.g. nexperts-logo.png) live at upstream root, not under /demo/.
  if (isLikelyStaticAsset(url.pathname) && isHtmlResponse(upstreamResponse)) {
    const fallbackUrl = new URL(url.toString());
    fallbackUrl.pathname = url.pathname.replace(/^\/demo/, "") || "/";
    if (fallbackUrl.pathname !== url.pathname) {
      const fallbackRes = await fetch(
        new Request(fallbackUrl.toString(), {
          method: "GET",
          headers: request.headers,
          redirect: "manual",
        }),
      );
      if (!isHtmlResponse(fallbackRes) && fallbackRes.ok) {
        upstreamResponse = fallbackRes;
      }
    }
  }

  return upstreamResponse;
}

export const onRequest = async ({ request }: PagesFunctionContext): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const upstreamUrl = toUpstreamUrl(requestUrl);
  const upstreamResponse = await fetchUpstream(request, upstreamUrl);
  const headers = new Headers(upstreamResponse.headers);

  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");
  headers.set("cache-control", "no-store");

  const location = headers.get("location");
  if (location) {
    headers.set(
      "location",
      location
        .replaceAll(`${DEMO_UPSTREAM}/demo/demo/`, `${requestUrl.origin}/demo/`)
        .replaceAll(`${DEMO_UPSTREAM}/demo/`, `${requestUrl.origin}/demo/`)
        .replaceAll(`${DEMO_UPSTREAM}/`, `${requestUrl.origin}/demo/`)
        .replaceAll("/demo/demo/", "/demo/"),
    );
  }

  const contentType = headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    const html = await upstreamResponse.text();
    headers.set("content-type", "text/html; charset=utf-8");
    return new Response(rewriteHtml(html), {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
};
