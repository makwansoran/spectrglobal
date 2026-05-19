/**
 * Fetch public website metadata (no Finnhub): og:image logo, meta description.
 */
const { fetchText } = require("./company-scrape");

async function fetchWebsiteMeta(websiteUrl) {
  const url = String(websiteUrl || "").trim();
  if (!url) return null;

  let html;
  try {
    html = await fetchText(url.startsWith("http") ? url : `https://${url}`);
  } catch {
    return null;
  }
  if (!html) return null;

  const pick = (re) => {
    const m = html.match(re);
    return m?.[1]?.trim() || null;
  };

  const logoUrl =
    pick(/property=["']og:image(?::url)?["'][^>]*content=["']([^"']+)["']/i) ||
    pick(/content=["']([^"']+)["'][^>]*property=["']og:image/i) ||
    pick(/rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i) ||
    pick(/href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon["']/i);

  const description =
    pick(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    pick(/name=["']description["'][^>]*content=["']([^"']+)["']/i);

  const title = pick(/<title[^>]*>([^<]+)<\/title>/i);

  let resolvedLogo = logoUrl;
  if (resolvedLogo && !resolvedLogo.startsWith("http")) {
    try {
      resolvedLogo = new URL(resolvedLogo, url).href;
    } catch {
      resolvedLogo = null;
    }
  }

  return {
    logoUrl: resolvedLogo,
    description: description || null,
    title: title || null,
  };
}

module.exports = {
  fetchWebsiteMeta,
};
