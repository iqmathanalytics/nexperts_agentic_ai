const DEMO_UPSTREAM = "https://agentic-ai-demo.pages.dev";

type PagesFunctionContext = {
  request: Request;
};

function toUpstreamUrl(requestUrl: URL): URL {
  const upstreamUrl = new URL(DEMO_UPSTREAM);
  const pathAfterDemo = requestUrl.pathname.replace(/^\/demo\/?/, "");

  upstreamUrl.pathname = pathAfterDemo ? `/${pathAfterDemo}` : "/";
  upstreamUrl.search = requestUrl.search;

  return upstreamUrl;
}

function rewriteHtml(html: string): string {
  return html
    .replaceAll('href="/', 'href="/demo/')
    .replaceAll("href='/", "href='/demo/")
    .replaceAll('src="/', 'src="/demo/')
    .replaceAll("src='/", "src='/demo/")
    .replaceAll('url("/', 'url("/demo/')
    .replaceAll("url('/", "url('/demo/")
    .replaceAll('url(/', "url(/demo/");
}

export const onRequest = async ({ request }: PagesFunctionContext): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const upstreamUrl = toUpstreamUrl(requestUrl);
  const upstreamRequest = new Request(upstreamUrl.toString(), request);
  const upstreamResponse = await fetch(upstreamRequest);
  const headers = new Headers(upstreamResponse.headers);

  headers.delete("content-security-policy");
  headers.delete("content-security-policy-report-only");
  headers.delete("x-frame-options");

  const location = headers.get("location");
  if (location) {
    headers.set("location", location.replace(DEMO_UPSTREAM, `${requestUrl.origin}/demo`));
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
