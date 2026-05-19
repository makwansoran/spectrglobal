/**
 * Parse Euronext product-directory DataTables rows (aaData).
 */

const BASE = "https://live.euronext.com";

function stripTags(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePercent(html) {
  const text = stripTags(html).replace(",", ".").replace("%", "").trim();
  const n = parseFloat(text);
  return Number.isFinite(n) ? n : null;
}

function parsePrice(html) {
  const m = String(html || "").match(/pd_last_price_es[^>]*>([^<]+)/i);
  const raw = (m ? m[1] : stripTags(html)).replace(/\s/g, "").replace(",", ".");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

function parseProductPath(nameCell) {
  const m = String(nameCell || "").match(/href="([^"]+)"/i);
  if (!m) return null;
  return m[1].startsWith("http") ? new URL(m[1]).pathname : m[1];
}

function parseListingRow(cells) {
  if (!Array.isArray(cells) || cells.length < 4) return null;

  const productPath = parseProductPath(cells[0]);
  if (!productPath) return null;

  const name =
    (String(cells[0]).match(/data-title-hover="([^"]+)"/i) || [])[1] ||
    stripTags(cells[0]);

  const isin = String(cells[1] || "").trim();
  const ticker = String(cells[2] || "").trim();
  const marketLabel = stripTags(cells[3]);

  const micMatch = String(cells[3] || "").match(/title="([^"]+)"/i);
  const mic =
    (String(cells[3] || "").match(/>\s*([A-Z]{4})\s*</) || [])[1] ||
    (marketLabel.includes("Growth") ? "XOAS" : "XOSL");

  return {
    name,
    isin,
    ticker,
    mic: mic.toUpperCase(),
    marketLabel: micMatch ? micMatch[1] : marketLabel,
    currency: "NOK",
    lastPrice: parsePrice(cells[4]),
    dayChangePct: cells[5] ? parsePercent(cells[5]) : null,
    lastTradeLabel: cells[6] ? stripTags(cells[6]) : null,
    productPath,
    productUrl: `${BASE}${productPath.startsWith("/") ? productPath : `/${productPath}`}`,
    rawRow: cells,
  };
}

function slugifyOsloCompany(legalName, ticker) {
  const base = legalName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base}-${ticker.toLowerCase()}`.replace(/-+/g, "-");
}

function initials(name, ticker) {
  const words = String(name)
    .replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (ticker.length >= 2) return ticker.slice(0, 2).toUpperCase();
  return (words[0] || "CO").slice(0, 2).toUpperCase();
}

function listingToCompanySeed(listing, pageHtml) {
  const slug = slugifyOsloCompany(listing.name, listing.ticker);
  const ini = initials(listing.name, listing.ticker);
  const now = new Date().toISOString();

  const profile = {
    id: slug,
    name: listing.name,
    legalName: listing.name,
    logoInitials: ini,
    countryCode: "NO",
    countryName: "Norway",
    headquarters: "Norway",
    industryTags: ["Oslo Børs", listing.marketLabel].filter(Boolean),
    isPublic: true,
    stock: {
      ticker: listing.ticker,
      exchange: listing.marketLabel || "Oslo Børs",
      price: listing.lastPrice ?? 0,
      change: 0,
      changePercent: listing.dayChangePct ?? 0,
      currency: listing.currency || "NOK",
    },
    industry: "listed",
    industryTabLabel: "Overview",
    about: `${listing.name} (${listing.ticker}) is listed on ${listing.marketLabel || "Oslo Børs"}. Live quote and instrument data are synced from Euronext.`,
    quickStats: [
      { label: "ISIN", value: listing.isin },
      { label: "MIC", value: listing.mic },
      { label: "Last price", value: listing.lastPrice != null ? `${listing.lastPrice} NOK` : "—" },
    ],
    people: [],
    financials: { years: [], metrics: [] },
    news: [],
    filings: [],
    keyFacts: [
      { label: "Listing", value: listing.marketLabel || "Oslo Børs" },
      { label: "Euronext", value: listing.productUrl },
    ],
    competitors: [],
    funding: [],
    esg: { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    dataSources: [
      { name: "Euronext Live", url: listing.productUrl },
      { name: "Oslo Børs", url: "https://www.oslobors.no" },
    ],
    euronext: {
      isin: listing.isin,
      mic: listing.mic,
      productPath: listing.productPath,
      productUrl: listing.productUrl,
      lastPrice: listing.lastPrice,
      dayChangePct: listing.dayChangePct,
      lastTradeLabel: listing.lastTradeLabel,
      syncedAt: now,
      pageHtml: pageHtml ? pageHtml.slice(0, 500000) : undefined,
    },
    lastUpdated: now,
  };

  const terms = [
    listing.name.toLowerCase(),
    listing.ticker.toLowerCase(),
    listing.isin.toLowerCase(),
    slug,
    "oslo",
    "euronext",
    "norway",
    "norge",
  ];

  return {
    slug,
    profile,
    mapGeojson: null,
    searchTerms: [...new Set(terms)],
    listing: { ...listing, companySlug: slug },
  };
}

module.exports = {
  parseListingRow,
  listingToCompanySeed,
  slugifyOsloCompany,
};
