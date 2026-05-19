/**
 * Finnhub market data (quotes, basic financials).
 * https://finnhub.io/docs/api
 *
 * Set FINNHUB_API_KEY in .env
 */
const FINNHUB_BASE = "https://finnhub.io/api/v1";

const cache = new Map();
const CACHE_MS = 60_000;
const CACHE_LONG_MS = 300_000;

function getApiKey() {
  return process.env.FINNHUB_API_KEY || "";
}

function isEnabled() {
  return Boolean(getApiKey());
}

function cacheGet(key, maxAge = CACHE_MS) {
  const hit = cache.get(key);
  if (!hit) return null;
  const ttl = hit.maxAge ?? maxAge;
  if (Date.now() - hit.at > ttl) return null;
  return hit.data;
}

function cacheSet(key, data, maxAge = CACHE_MS) {
  cache.set(key, { at: Date.now(), data, maxAge });
}

async function finnhubGet(path, params = {}) {
  const token = getApiKey();
  if (!token) throw new Error("FINNHUB_API_KEY is not configured");

  const url = new URL(`${FINNHUB_BASE}${path}`);
  url.searchParams.set("token", token);
  for (const [k, v] of Object.entries(params)) {
    if (v != null && v !== "") url.searchParams.set(k, String(v));
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`Finnhub ${path} failed (${res.status}): ${text.slice(0, 120)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

/** Symbols to try (Oslo suffix, then plain ticker for US cross-listings). */
function symbolCandidates(ticker, exchange, countryCode, finnhubSymbol) {
  const t = String(ticker || "")
    .trim()
    .toUpperCase();
  if (!t) return [];

  const out = [];
  const add = (s) => {
    if (s && !out.includes(s)) out.push(s);
  };

  if (finnhubSymbol) add(String(finnhubSymbol).toUpperCase());

  if (t.includes(".")) {
    add(t);
    return out;
  }

  add(toFinnhubSymbol(ticker, exchange, countryCode));

  const ex = String(exchange || "").toLowerCase();
  const cc = String(countryCode || "").toUpperCase();
  if (cc === "NO" || ex.includes("oslo") || ex.includes("euronext")) {
    add(t);
  }

  return out;
}

/**
 * Map listing exchange to Finnhub symbol suffix.
 */
function toFinnhubSymbol(ticker, exchange, countryCode) {
  const t = String(ticker || "")
    .trim()
    .toUpperCase();
  if (!t) return null;

  const ex = String(exchange || "").toLowerCase();
  const cc = String(countryCode || "").toUpperCase();

  if (t.includes(".")) return t;

  if (ex.includes("oslo") || (ex.includes("euronext") && ex.includes("oslo"))) return `${t}.OL`;
  if (ex.includes("growth oslo") || ex.includes("euronext growth")) return `${t}.OL`;
  if (cc === "NO" && (ex.includes("oslo") || ex.includes("euronext") || !ex)) return `${t}.OL`;
  if (ex.includes("copenhagen") || cc === "DK") return `${t}.CO`;
  if (ex.includes("stockholm") || cc === "SE") return `${t}.ST`;
  if (ex.includes("helsinki") || cc === "FI") return `${t}.HE`;
  if (ex.includes("xetra") || ex.includes("frankfurt") || cc === "DE") return `${t}.DE`;
  if (ex.includes("london") || cc === "GB") return `${t}.L`;

  return t;
}

/**
 * Live quote (price, change, % change).
 */
async function fetchQuote(symbol) {
  const key = `quote:${symbol}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const raw = await finnhubGet("/quote", { symbol });
  const price = raw.c;
  if (price == null || price === 0) {
    const empty = { symbol, price: null, change: null, changePercent: null, asOf: raw.t || null };
    cacheSet(key, empty);
    return empty;
  }

  const out = {
    symbol,
    price,
    change: raw.d ?? null,
    changePercent: raw.dp ?? null,
    high: raw.h ?? null,
    low: raw.l ?? null,
    open: raw.o ?? null,
    previousClose: raw.pc ?? null,
    asOf: raw.t ? new Date(raw.t * 1000).toISOString() : null,
  };
  cacheSet(key, out);
  return out;
}

/**
 * Key financial metrics (annual / quarterly series available in full payload).
 */
async function fetchBasicFinancials(symbol) {
  const key = `metric:${symbol}`;
  const cached = cacheGet(key);
  if (cached) return cached;

  const raw = await finnhubGet("/stock/metric", { symbol, metric: "all" });
  const m = raw.metric || {};
  const series = raw.series || {};

  const pick = (k) => (m[k] != null && !Number.isNaN(m[k]) ? m[k] : null);

  const revenueAnnual = series.annual?.revenue || null;
  const revenueYears = revenueAnnual
    ? Object.entries(revenueAnnual)
        .map(([year, revenue]) => ({ year: parseInt(year, 10), revenue }))
        .filter((y) => y.year && revenue != null)
        .sort((a, b) => a.year - b.year)
    : [];

  const out = {
    symbol,
    marketCap: pick("marketCapitalization"),
    peRatio: pick("peBasicExclExtraTTM") ?? pick("peTTM"),
    eps: pick("epsBasicExclExtraItemsTTM"),
    revenuePerShare: pick("revenuePerShareTTM"),
    dividendYield: pick("dividendYieldIndicatedAnnual"),
    beta: pick("beta"),
    week52High: pick("52WeekHigh"),
    week52Low: pick("52WeekLow"),
    roe: pick("roeTTM"),
    roa: pick("roaTTM"),
    currentRatio: pick("currentRatioAnnual"),
    debtEquity: pick("totalDebt/totalEquityAnnual"),
    grossMargin: pick("grossMarginTTM"),
    operatingMargin: pick("operatingMarginTTM"),
    revenueGrowth3Y: pick("revenueGrowth3Y"),
    payoutRatio: pick("payoutRatioAnnual"),
    currency: raw.currency || null,
    revenueYears,
    series: {
      revenue: revenueAnnual,
      netIncome: series.annual?.netIncome || series.quarterly?.netIncome || null,
    },
  };
  cacheSet(key, out);
  return out;
}

async function fetchQuoteWithFallback(ticker, exchange, countryCode, finnhubSymbol) {
  for (const symbol of symbolCandidates(ticker, exchange, countryCode, finnhubSymbol)) {
    try {
      const quote = await fetchQuote(symbol);
      if (quote.price != null && quote.price > 0) return quote;
    } catch (err) {
      if (err.status === 403 || err.status === 401) continue;
      console.warn(`Finnhub quote(${symbol}):`, err.message);
    }
  }
  return null;
}

function newsDateRange(days = 90) {
  const to = new Date();
  const from = new Date(to);
  from.setDate(from.getDate() - days);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

function normalizeProfile2(raw) {
  if (!raw?.name) return null;
  return {
    name: raw.name,
    ticker: raw.ticker || null,
    exchange: raw.exchange || null,
    ipo: raw.ipo || null,
    marketCap: raw.marketCapitalization ?? null,
    sharesOutstanding: raw.shareOutstanding ?? null,
    weburl: raw.weburl || null,
    phone: raw.phone || null,
    industry: raw.finnhubIndustry || null,
    logo: raw.logo || null,
    country: raw.country || null,
    currency: raw.currency || null,
    employees: raw.employeeTotal ?? null,
  };
}

function normalizeNews(items, max = 15) {
  return (items || []).slice(0, max).map((n, i) => ({
    id: String(n.id ?? `fh-${i}`),
    title: n.headline || "",
    summary: n.summary || "",
    source: n.source || "Finnhub",
    date: n.datetime ? new Date(n.datetime * 1000).toISOString().slice(0, 10) : "",
    publishedAt: n.datetime ? new Date(n.datetime * 1000).toISOString() : "",
    url: n.url || null,
    image: n.image || null,
    category: n.category || null,
  }));
}

/** Market headlines — Finnhub /news (general, forex, merger, etc.). */
async function fetchMarketNews(category = "general", limit = 30) {
  const cat = String(category || "general").toLowerCase();
  const key = `market-news:${cat}:${limit}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/news", { category: cat });
  const out = normalizeNews(data, limit);
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function fetchMarketNewsFeed({ limit = 24, categories = ["general", "forex", "merger"] } = {}) {
  if (!isEnabled()) return [];
  const seen = new Set();
  const merged = [];

  for (const cat of categories) {
    const batch = await tryFinnhub(() => fetchMarketNews(cat, limit));
    if (!batch?.length) continue;
    for (const item of batch) {
      const key = item.title.toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push({ ...item, category: item.category || cat });
    }
  }

  return merged
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);
}

function normalizeRecommendations(rows) {
  const list = Array.isArray(rows) ? rows : [];
  if (!list.length) return null;
  const latest = list[list.length - 1];
  return {
    period: latest.period || null,
    strongBuy: latest.strongBuy ?? 0,
    buy: latest.buy ?? 0,
    hold: latest.hold ?? 0,
    sell: latest.sell ?? 0,
    strongSell: latest.strongSell ?? 0,
  };
}

function normalizeEarnings(rows) {
  return (rows || [])
    .slice(0, 8)
    .map((e) => ({
      period: e.period || null,
      year: e.year ?? null,
      quarter: e.quarter ?? null,
      actual: e.actual ?? null,
      estimate: e.estimate ?? null,
      surprise: e.surprise ?? null,
      surprisePercent: e.surprisePercent ?? null,
      date: e.period || null,
    }))
    .filter((e) => e.period);
}

async function fetchCompanyNews(symbol, days = 90) {
  const { from, to } = newsDateRange(days);
  const key = `news:${symbol}:${from}:${to}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/company-news", { symbol, from, to });
  const out = normalizeNews(data);
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function fetchPeers(symbol) {
  const key = `peers:${symbol}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/stock/peers", { symbol });
  const out = Array.isArray(data) ? data : Array.isArray(data?.peers) ? data.peers : [];
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function fetchRecommendations(symbol) {
  const key = `rec:${symbol}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/stock/recommendation", { symbol });
  const out = normalizeRecommendations(data);
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function fetchEarnings(symbol) {
  const key = `earnings:${symbol}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/stock/earnings", { symbol });
  const out = normalizeEarnings(data);
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function tryFinnhub(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err.status !== 403 && err.status !== 401) {
      console.warn("Finnhub:", err.message);
    }
    return null;
  }
}

function finnhubSymbolCandidates(profile) {
  if (!profile?.stock?.ticker) return [];
  return symbolCandidates(
    profile.stock.ticker,
    profile.stock.exchange,
    profile.countryCode,
    profile.stock.finnhubSymbol || null
  );
}

/** Latest headlines for a profile (Finnhub company-news). */
async function fetchCompanyNewsForProfile(profile) {
  if (!isEnabled()) return [];
  const candidates = finnhubSymbolCandidates(profile);
  for (const sym of candidates) {
    const news = await tryFinnhub(() => fetchCompanyNews(sym));
    if (news?.length) return news;
  }
  return [];
}

function normalizeSecFilings(rows) {
  return (rows || []).map((f, i) => ({
    id: String(f.accessNumber || f.filingUrl || `fh-sec-${i}`),
    title: f.reportUrl ? String(f.reportUrl).split("/").pop() || f.form : f.form || "SEC filing",
    type: f.form || "SEC",
    date: f.filedDate || f.acceptedDate || "",
    jurisdiction: "SEC",
    url: f.filingUrl || f.reportUrl || null,
    source: "finnhub-sec",
  }));
}

/** SEC filings via Finnhub (10-K, 10-Q, 8-K, etc.). */
async function fetchSecFilings(symbol, yearsBack = 8) {
  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - yearsBack);
  const fmt = (d) => d.toISOString().slice(0, 10);
  const key = `filings:${symbol}:${fmt(from)}:${fmt(to)}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  const data = await finnhubGet("/stock/filings", { symbol, from: fmt(from), to: fmt(to) });
  const out = normalizeSecFilings(Array.isArray(data) ? data : []);
  cacheSet(key, out, CACHE_LONG_MS);
  return out;
}

async function fetchSecFilingsForProfile(profile, yearsBack = 8) {
  if (!isEnabled() || !profile?.stock?.ticker) return [];
  const candidates = finnhubSymbolCandidates(profile);
  for (const sym of candidates) {
    const rows = await tryFinnhub(() => fetchSecFilings(sym, yearsBack));
    if (rows?.length) return rows;
  }
  return [];
}

async function fetchCompanyMarket(profile) {
  if (!profile?.stock?.ticker) {
    return { symbol: null, quote: null, metrics: null, profile: null, news: [], peers: [], recommendations: null, earnings: [] };
  }

  const candidates = finnhubSymbolCandidates(profile);
  if (!candidates.length) {
    return { symbol: null, quote: null, metrics: null, profile: null, news: [], peers: [], recommendations: null, earnings: [] };
  }

  const finnhubSymbol = profile.stock.finnhubSymbol || null;

  const quote = await fetchQuoteWithFallback(
    profile.stock.ticker,
    profile.stock.exchange,
    profile.countryCode,
    finnhubSymbol
  );

  const symbol = quote?.symbol || candidates[0];

  let metrics = null;
  for (const sym of [symbol, ...candidates]) {
    const m = await tryFinnhub(() => fetchBasicFinancials(sym));
    if (m?.marketCap != null || m?.peRatio != null) {
      metrics = m;
      break;
    }
    if (m && !metrics) metrics = m;
  }

  const symForExtras = metrics?.symbol || symbol;
  const [companyProfile, news, peers, recommendations, earnings] = await Promise.all([
    tryFinnhub(() => fetchStockProfile(symForExtras).then(normalizeProfile2)),
    tryFinnhub(() => fetchCompanyNews(symForExtras)),
    tryFinnhub(() => fetchPeers(symForExtras)),
    tryFinnhub(() => fetchRecommendations(symForExtras)),
    tryFinnhub(() => fetchEarnings(symForExtras)),
  ]);

  const useUsd =
    quote?.symbol && !quote.symbol.endsWith(".OL") && quote.symbol === profile.stock.ticker.toUpperCase();

  return {
    symbol: symForExtras,
    ticker: profile.stock.ticker,
    currency: useUsd ? "USD" : profile.stock.currency || metrics?.currency || companyProfile?.currency || "NOK",
    quote,
    metrics,
    profile: companyProfile,
    news: news || [],
    peers: peers || [],
    recommendations,
    earnings: earnings || [],
  };
}

async function fetchUsStockSymbols() {
  const key = "symbols:US";
  const cached = cacheGet(key);
  if (cached) return cached;
  const data = await finnhubGet("/stock/symbol", { exchange: "US" });
  cacheSet(key, data);
  return data;
}

/** Finnhub symbol search — import/seed only; runtime company search uses Supabase public.companies. */
async function searchSymbols(query) {
  const q = String(query || "").trim();
  if (!q) return [];
  const key = `search:${q.toLowerCase()}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  const data = await finnhubGet("/search", { q });
  const results = Array.isArray(data?.result) ? data.result : [];
  cacheSet(key, results);
  return results;
}

async function searchToIndexItems(query, limit = 25) {
  const { symbolToSeed } = require("./finnhub-import");
  const { buildMeta } = require("./local-store");
  const { dedupeSearchResults, normalizeTicker, queryLooksLikeTicker } = require("./search-rank");

  const hits = await searchSymbols(query);
  const qTicker = queryLooksLikeTicker(query) ? normalizeTicker(query) : "";
  const preferred = hits.filter((h) => {
    const t = String(h.type || "").toLowerCase();
    return !t || t.includes("stock") || t === "adr" || t === "etp";
  });

  const rows = [];
  const seen = new Set();
  for (const hit of preferred.length ? preferred : hits) {
    const ticker = String(hit.symbol || hit.displaySymbol || "").trim();
    if (!ticker || seen.has(ticker)) continue;
    if (qTicker && normalizeTicker(ticker) !== qTicker) continue;
    seen.add(ticker);

    const seed = symbolToSeed(
      {
        symbol: ticker,
        description: hit.description || hit.symbol,
        type: hit.type || "Common Stock",
        displaySymbol: hit.displaySymbol,
      },
      null
    );
    if (!seed) continue;

    rows.push({
      id: seed.slug,
      name: seed.profile.name,
      legalName: seed.profile.legalName,
      meta: buildMeta(seed.profile),
      initials: seed.profile.logoInitials,
      url: `/company/${seed.slug}`,
      terms: seed.searchTerms,
      ticker: seed.profile.stock?.ticker || ticker,
    });
    if (rows.length >= limit * 4) break;
  }
  return dedupeSearchResults(rows, query, limit);
}

async function buildCompanyFromSlug(slug) {
  if (!String(slug).startsWith("us-")) return null;
  const ticker = String(slug).slice(3).replace(/\./g, "").toUpperCase();
  if (!ticker) return null;

  const { symbolToSeed } = require("./finnhub-import");
  const profile2 = await fetchStockProfile(ticker);
  const seed = symbolToSeed(
    {
      symbol: ticker,
      description: profile2?.name || ticker,
      type: "Common Stock",
    },
    profile2
  );
  if (!seed) return null;
  return { profile: seed.profile, mapGeojson: null };
}

async function fetchStockProfile(symbol) {
  const key = `profile2:${symbol}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  try {
    const data = await finnhubGet("/stock/profile2", { symbol });
    cacheSet(key, data, CACHE_LONG_MS);
    return data;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

/** Top institutional holders (premium on many Finnhub plans). */
async function fetchInstitutionalOwnership(symbol) {
  const sym = String(symbol || "").trim().toUpperCase();
  if (!sym) return null;
  const key = `ownership:${sym}`;
  const cached = cacheGet(key, CACHE_LONG_MS);
  if (cached) return cached;
  try {
    const data = await finnhubGet("/stock/ownership", { symbol: sym, limit: 20 });
    cacheSet(key, data, CACHE_LONG_MS);
    return data;
  } catch (err) {
    if (err.status === 403 || err.status === 401) return null;
    throw err;
  }
}

module.exports = {
  isEnabled,
  finnhubGet,
  toFinnhubSymbol,
  symbolCandidates,
  fetchQuote,
  fetchQuoteWithFallback,
  fetchBasicFinancials,
  fetchCompanyMarket,
  fetchUsStockSymbols,
  fetchStockProfile,
  fetchInstitutionalOwnership,
  searchSymbols,
  searchToIndexItems,
  buildCompanyFromSlug,
  fetchCompanyNews,
  fetchMarketNews,
  fetchMarketNewsFeed,
  fetchCompanyNewsForProfile,
  fetchSecFilings,
  fetchSecFilingsForProfile,
  finnhubSymbolCandidates,
  fetchPeers,
  fetchRecommendations,
  fetchEarnings,
};
