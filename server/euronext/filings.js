/**
 * Euronext product-page filing / report links (HTTP only).
 */

const { fetchHtml } = require("./client");

const DOC_HREF =
  /(annual|report|financial|result|presentation|prospectus|filing|regulatory|\.pdf|interim|quarterly|shareholder)/i;

function stripTags(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveHref(baseUrl, href) {
  const h = String(href || "").trim();
  if (!h || h.startsWith("#") || /^javascript:/i.test(h)) return null;
  try {
    return new URL(h, baseUrl).href;
  } catch {
    return null;
  }
}

function guessType(title, href) {
  const t = `${title} ${href}`.toLowerCase();
  if (/annual/.test(t)) return "Annual report";
  if (/interim|quarterly/.test(t)) return "Interim report";
  if (/presentation/.test(t)) return "Presentation";
  if (/\.pdf/.test(t)) return "PDF";
  return "Market filing";
}

function parseProductPageLinks(html, pageUrl, listingName) {
  const seen = new Set();
  const out = [];
  const re = /<a\s+[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(html)) && out.length < 25) {
    const href = resolveHref(pageUrl, m[1]);
    if (!href || seen.has(href)) continue;
    const title = stripTags(m[2]) || href.split("/").pop() || listingName;
    if (!DOC_HREF.test(`${title} ${href}`)) continue;
    seen.add(href);
    out.push({
      id: `enx-${Buffer.from(href).toString("base64url").slice(0, 22)}`,
      title: title.slice(0, 200),
      type: guessType(title, href),
      date: "",
      jurisdiction: "Euronext",
      url: href,
      source: "euronext",
    });
  }
  return out;
}

/**
 * @param {object} profile company profile with euronext.productUrl
 */
async function fetchEuronextFilingsForProfile(profile) {
  const productUrl = profile?.euronext?.productUrl;
  if (!productUrl) return [];

  try {
    const html = await fetchHtml(productUrl);
    const rows = parseProductPageLinks(html, productUrl, profile.name || profile.legalName);
    if (rows.length) return rows;

    return [
      {
        id: `enx-product-${profile.euronext.isin || profile.stock?.ticker || "link"}`,
        title: `${profile.name || "Company"} — Euronext instrument`,
        type: "Listing",
        date: "",
        jurisdiction: "Euronext",
        url: productUrl,
        source: "euronext",
      },
    ];
  } catch (err) {
    console.warn("Euronext filings:", err.message);
    return [
      {
        id: `enx-product-${profile.euronext.isin || "link"}`,
        title: `${profile.name || "Company"} — Euronext`,
        type: "Listing",
        date: "",
        jurisdiction: "Euronext",
        url: productUrl,
        source: "euronext",
      },
    ];
  }
}

module.exports = {
  fetchEuronextFilingsForProfile,
  parseProductPageLinks,
};
