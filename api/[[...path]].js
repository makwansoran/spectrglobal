/**
 * Single Vercel serverless entry for all /api/* routes (Hobby plan: max 12 functions).
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

module.exports = async (req, res) => {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `https://${host}`);
  const pathname = resolvePathname(url);

  const handled = await handleApi(req, res, pathname);
  if (!handled) {
    res.status(404).json({ error: "Not found", path: pathname });
  }
};
