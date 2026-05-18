/**
 * Finnhub market data (quotes, basic financials).
 * https://finnhub.io/docs/api
 *
 * Set FINNHUB_API_KEY in .env
 */
const FINNHUB_BASE = "https://finnhub.io/api/v1";

const cache = new Map();
const CACHE_MS = 60_000;

function getApiKey() {
  return process.env.FINNHUB_API_KEY || "";
}

function isEnabled() {
  return Boolean(getApiKey());
}

function cacheGet(key) {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.at > CACHE_MS) return null;
  return hit.data;
}

function cacheSet(key, data) {
  cache.set(key, { at: Date.now(), data });
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
    currency: raw.currency || null,
    series: {
      revenue: series.annual?.revenue || series.quarterly?.revenue || null,
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

async function fetchCompanyMarket(profile) {
  if (!profile?.stock?.ticker) {
    return { symbol: null, quote: null, metrics: null };
  }

  const finnhubSymbol = profile.stock.finnhubSymbol || null;
  const candidates = symbolCandidates(
    profile.stock.ticker,
    profile.stock.exchange,
    profile.countryCode,
    finnhubSymbol
  );
  if (!candidates.length) return { symbol: null, quote: null, metrics: null };

  const quote = await fetchQuoteWithFallback(
    profile.stock.ticker,
    profile.stock.exchange,
    profile.countryCode,
    finnhubSymbol
  );

  const symbol = quote?.symbol || candidates[0];
  let metrics = null;
  for (const sym of [symbol, ...candidates]) {
    try {
      metrics = await fetchBasicFinancials(sym);
      if (metrics?.marketCap != null) break;
    } catch (err) {
      if (err.status === 403 || err.status === 401) continue;
      console.warn(`Finnhub metrics(${sym}):`, err.message);
    }
  }

  const useUsd = quote?.symbol && !quote.symbol.endsWith(".OL") && quote.symbol === profile.stock.ticker.toUpperCase();

  return {
    symbol,
    ticker: profile.stock.ticker,
    currency: useUsd ? "USD" : profile.stock.currency || metrics?.currency || "NOK",
    quote,
    metrics,
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

async function fetchStockProfile(symbol) {
  const key = `profile2:${symbol}`;
  const cached = cacheGet(key);
  if (cached) return cached;
  try {
    const data = await finnhubGet("/stock/profile2", { symbol });
    cacheSet(key, data);
    return data;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

module.exports = {
  isEnabled,
  toFinnhubSymbol,
  symbolCandidates,
  fetchQuote,
  fetchQuoteWithFallback,
  fetchBasicFinancials,
  fetchCompanyMarket,
  fetchUsStockSymbols,
  fetchStockProfile,
};
