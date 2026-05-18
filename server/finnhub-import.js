/**
 * Build company seeds from Finnhub symbol list + profile2.
 */
const { buildMeta } = require("./local-store");

const IMPORT_TYPES = new Set([
  "Common Stock",
  "ADR",
  "REIT",
  "ETP",
  "Closed-End Fund",
  "PUBLIC",
  "",
]);

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function initials(name, ticker) {
  const words = String(name || "")
    .replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return (ticker || "US").slice(0, 2).toUpperCase();
}

function mapIndustry(finnhubIndustry) {
  const i = String(finnhubIndustry || "").toLowerCase();
  if (i.includes("bank") || i.includes("financial")) return "finance";
  if (i.includes("oil") || i.includes("gas") || i.includes("energy")) return "oil_gas";
  if (i.includes("ship") || i.includes("marine")) return "shipping";
  if (i.includes("real estate")) return "real_estate";
  if (i.includes("tech") || i.includes("software")) return "technology";
  if (i.includes("biotech") || i.includes("pharma")) return "biotech";
  if (i.includes("mining")) return "mining";
  return "technology";
}

function usCompanySlug(ticker) {
  return `us-${String(ticker).toLowerCase().replace(/[^a-z0-9.-]/g, "")}`;
}

function symbolToSeed(item, profile2 = null) {
  const ticker = String(item.symbol || "").trim().toUpperCase();
  if (!ticker) return null;

  const name = profile2?.name || item.description || ticker;
  const slug = usCompanySlug(ticker);
  const exchange = profile2?.exchange || item.mic || "US";
  const countryCode = profile2?.country || "US";
  const countryName = countryCode === "US" ? "United States" : countryCode;

  const industryTags = profile2?.finnhubIndustry
    ? [profile2.finnhubIndustry]
    : [item.type || "US Listed"].filter(Boolean);

  const finnhubSymbol = profile2?.ticker?.includes(".") ? profile2.ticker : ticker;

  const profile = {
    id: slug,
    name,
    legalName: name,
    logoUrl: profile2?.logo || undefined,
    logoInitials: initials(name, ticker),
    countryCode: countryCode.length === 2 ? countryCode : "US",
    countryName,
    founded: profile2?.ipo ? parseInt(profile2.ipo.slice(0, 4), 10) || 1900 : 1900,
    headquarters: profile2?.exchange || countryName,
    industryTags,
    isPublic: true,
    stock: {
      ticker,
      exchange,
      price: null,
      change: null,
      changePercent: null,
      currency: profile2?.currency || item.currency || "USD",
      finnhubSymbol,
    },
    industry: mapIndustry(profile2?.finnhubIndustry),
    industryTabLabel: "Overview",
    about: profile2?.weburl
      ? `${name} is listed in the United States (${exchange}, ticker ${ticker}). Data sourced from Finnhub.`
      : `${name} (${ticker}) — US-listed security. Data sourced from Finnhub.`,
    quickStats: [
      { label: "Ticker", value: ticker, format: "text" },
      { label: "Exchange", value: exchange, format: "text" },
      { label: "Country", value: countryName, format: "text" },
    ],
    people: [],
    financials: { years: [], metrics: [] },
    news: [],
    filings: [],
    keyFacts: [
      { label: "Listing", value: `${exchange} · ${ticker}` },
      { label: "Source", value: "Finnhub US symbols" },
    ],
    competitors: [],
    funding: [],
    esg: { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    dataSources: [
      { name: "Finnhub", url: "https://finnhub.io" },
      ...(profile2?.weburl ? [{ name: "Company website", url: profile2.weburl }] : []),
    ],
    lastUpdated: new Date().toISOString(),
    finnhub: {
      source: "finnhub-us",
      mic: item.mic || null,
      type: item.type || null,
      marketCap: profile2?.marketCapitalization ?? null,
    },
  };

  if (profile2?.marketCapitalization) {
    profile.financials.metrics.push({
      label: "Market cap (Finnhub)",
      value: 0,
      format: "text",
      display: `USD ${(profile2.marketCapitalization / 1000).toFixed(1)}B`,
    });
  }

  const terms = new Set(
    [
      ticker,
      item.displaySymbol,
      item.description,
      name,
      slug,
      profile2?.exchange,
      finnhubSymbol,
    ]
      .filter(Boolean)
      .map((t) => String(t).toLowerCase())
  );

  return {
    slug,
    profile,
    mapGeojson: null,
    searchTerms: [...terms],
  };
}

function filterUsSymbols(symbols, options = {}) {
  const { types, excludeMic } = options;
  return symbols.filter((item) => {
    if (!item?.symbol) return false;
    if (types && !types.has(item.type)) return false;
    if (!types && !IMPORT_TYPES.has(item.type)) return false;
    if (excludeMic?.length && excludeMic.includes(item.mic)) return false;
    return true;
  });
}

module.exports = {
  usCompanySlug,
  slugify,
  symbolToSeed,
  filterUsSymbols,
  mapIndustry,
};
