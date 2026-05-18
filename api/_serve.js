/**
 * Shared Vercel serverless entry — resolves pathname and delegates to handleApi.
 */
require("../scripts/load-env").loadEnv();
const { handleApi } = require("../server/api");

/** Map legacy rewrite targets (?slug=) to canonical /api paths. */
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

function pathnameFromRequest(req) {
  const host = req.headers.host || "localhost";
  const raw = req.url || "/";
  const href = raw.startsWith("http") ? raw : `https://${host}${raw.startsWith("/") ? raw : `/${raw}`}`;
  return resolvePathname(new URL(href));
}

module.exports = async function serveApi(req, res) {
  const pathname = pathnameFromRequest(req);
  const handled = await handleApi(req, res, pathname);
  if (!handled) {
    res.status(404).json({ error: "Not found", path: pathname });
  }
};
