/**
 * Resolve canonical /api/... pathname for Vercel serverless handlers.
 * Nested route files sometimes receive req.url without the /api/<mount> prefix.
 */
function resolvePathname(url) {
  const pathname = url.pathname;
  const slug = url.searchParams.get("slug");
  if (!slug) return pathname;

  if (pathname === "/api/get-company") return `/api/companies/${slug}`;
  if (pathname === "/api/get-company-market") return `/api/companies/${slug}/market`;
  if (pathname === "/api/get-company-news") return `/api/companies/${slug}/news`;
  if (pathname === "/api/get-company-financials") return `/api/companies/${slug}/financials`;
  if (pathname === "/api/get-company-quote") return `/api/companies/${slug}/quote`;
  if (pathname === "/api/get-person") return `/api/people/${slug}`;
  if (pathname === "/api/get-holder") return `/api/holders/${slug}`;
  if (pathname === "/api/get-commodity") return `/api/commodities/${slug}`;

  return pathname;
}

function pathnameFromRequest(req, mountPrefix) {
  const host = req.headers.host || "localhost";
  const raw = req.url || "/";
  const href = raw.startsWith("http") ? raw : `https://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
  let pathname = resolvePathname(new URL(href));

  if (mountPrefix && !pathname.startsWith(mountPrefix)) {
    pathname = `${mountPrefix}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  }

  return pathname;
}

module.exports = { pathnameFromRequest, resolvePathname };
