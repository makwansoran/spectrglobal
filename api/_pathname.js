/**
 * Resolve canonical /api/... pathname for Vercel serverless handlers.
 * Nested route files sometimes receive req.url without the full /api/<mount> prefix.
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
  if (pathname === "/api/get-company-assets") return `/api/companies/${slug}/assets`;
  if (pathname === "/api/get-company-filings") return `/api/companies/${slug}/filings`;
  if (pathname === "/api/get-company-enrich") return `/api/companies/${slug}/enrich`;
  if (pathname === "/api/get-person") return `/api/people/${slug}`;
  if (pathname === "/api/get-holder") return `/api/holders/${slug}`;
  if (pathname === "/api/get-commodity") return `/api/commodities/${slug}`;
  if (pathname === "/api/get-vessel") return `/api/vessels/${slug}`;
  if (pathname === "/api/get-country") return `/api/countries/${slug}`;
  if (pathname === "/api/get-politician") return `/api/politicians/${slug}`;

  return pathname;
}

function joinResource(resource) {
  if (resource == null || resource === "") return "";
  if (Array.isArray(resource)) return resource.filter(Boolean).join("/");
  return String(resource);
}

function pathnameFromRequest(req, mountPrefix) {
  const host = req.headers.host || "localhost";
  const raw = req.url || "/";
  const href = raw.startsWith("http") ? raw : `https://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
  let pathname = resolvePathname(new URL(href));

  const qSlug = req.query?.slug;
  const resourceTail = joinResource(req.query?.resource);

  if (mountPrefix === "/api/companies" && qSlug) {
    const canonical = resourceTail
      ? `${mountPrefix}/${encodeURIComponent(qSlug)}/${resourceTail}`
      : `${mountPrefix}/${encodeURIComponent(qSlug)}`;
    const decodedPath = decodeURIComponent(pathname);
    if (
      !decodedPath.includes(qSlug) ||
      pathname === mountPrefix ||
      pathname === `${mountPrefix}/` ||
      pathname === `/${qSlug}`
    ) {
      pathname = canonical;
    }
  }

  if (mountPrefix && !pathname.startsWith(mountPrefix)) {
    const tail = pathname.startsWith("/") ? pathname : `/${pathname}`;
    pathname = `${mountPrefix}${tail}`;
  }

  return pathname;
}

module.exports = { pathnameFromRequest, resolvePathname };
