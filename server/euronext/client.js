/**
 * Euronext Live HTTP client (product directory CSV + JSON gateway).
 */

const { getMarket, listMarkets } = require("./markets");

const OSLO_MARKET_URL = "https://live.euronext.com/nb/markets/oslo";
const OSLO_DIRECTORY_PATH = "/nb/product_directory/data/stocks-oslo";
const OSLO_DIRECTORY_DOWNLOAD =
  "/nb/product_directory/data/stocks-oslo/download?mics=MERK%2CXOAS%2CXOSL";
const OSLO_MICS = "MERK,XOAS,XOSL";
const PAGE_SIZE = 20;

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "User-Agent": "Spectr/1.0 (+https://spectr.no; market data sync)",
    },
  });
  if (!res.ok) {
    throw new Error(`Euronext HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Spectr/1.0 (+https://spectr.no; market data sync)",
    },
  });
  if (!res.ok) {
    throw new Error(`Euronext HTTP ${res.status} for ${url}`);
  }
  return res.text();
}

function directoryUrl(market, offset, length) {
  const params = new URLSearchParams({
    mics: market.mics,
    iDisplayStart: String(offset),
    iDisplayLength: String(length),
    sEcho: "1",
  });
  return `https://live.euronext.com/${market.locale}/product_directory/data/${market.pathSegment}?${params}`;
}

function directoryDownloadUrl(market) {
  const mics = encodeURIComponent(market.mics);
  return `https://live.euronext.com/${market.locale}/product_directory/data/${market.pathSegment}/download?mics=${mics}`;
}

function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ";" && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function inferMic(marketLabel, market) {
  const label = String(marketLabel || "");
  const fromLabel = label.match(/\b(X[A-Z]{3})\b/);
  if (fromLabel) return fromLabel[1];

  if (market.micRules) {
    for (const rule of market.micRules) {
      if (rule.test.test(label)) return rule.mic;
    }
  }
  return market.defaultMic || "XOSL";
}

function parseEuronextCsv(text, market) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const locale = market.locale || "en";
  const rows = [];
  for (const line of lines) {
    if (!line.includes(";") || line.startsWith("European Equities")) continue;
    if (/^All datapoints|^Name;ISIN/i.test(line)) continue;
    if (/^\d{1,2} [A-Za-z]+ \d{4}$/.test(line)) continue;

    const cols = parseCsvLine(line);
    if (cols.length < 5) continue;
    const [name, isin, ticker, marketLabel] = cols;
    if (!isin || !ticker || isin === "ISIN") continue;

    const lastPriceRaw = cols[8] || cols[7];
    const lastPrice = parseFloat(String(lastPriceRaw || "").replace(",", "."));
    const mic = inferMic(marketLabel, market);

    rows.push({
      name,
      isin,
      ticker: String(ticker).trim(),
      mic,
      marketLabel: marketLabel || market.key,
      marketKey: market.key,
      currency: cols[4] || market.defaultCurrency || "EUR",
      lastPrice: Number.isFinite(lastPrice) ? lastPrice : null,
      dayChangePct: null,
      lastTradeLabel: cols[9] ? String(cols[9]).trim() : null,
      productPath: `/${locale}/product/equities/${isin}-${mic}`,
      productUrl: `https://live.euronext.com/${locale}/product/equities/${isin}-${mic}`,
      rawRow: cols,
    });
  }
  return rows;
}

/** @deprecated use parseEuronextCsv */
function parseOsloCsv(text) {
  const oslo = getMarket("oslo");
  return parseEuronextCsv(text, oslo);
}

async function fetchMarketListingsFromCsv(market) {
  const url = directoryDownloadUrl(market);
  const text = await fetchHtml(url);
  const listings = parseEuronextCsv(text, market);
  return { total: listings.length, rows: listings, format: "csv", marketKey: market.key };
}

async function fetchMarketListingsFromJson(market) {
  const first = await fetchJson(directoryUrl(market, 0, PAGE_SIZE));
  const total = Number(first.iTotalRecords || 0);
  const rows = [...(first.aaData || [])];
  return { total, rows, format: "datatables", marketKey: market.key };
}

async function fetchMarketListings(marketKey) {
  const market = typeof marketKey === "string" ? getMarket(marketKey) : marketKey;
  if (!market) throw new Error(`Unknown Euronext market: ${marketKey}`);

  try {
    const csv = await fetchMarketListingsFromCsv(market);
    if (csv.rows.length > 10) return csv;
  } catch (err) {
    console.warn(`[euronext:${market.key}] CSV download failed:`, err.message);
  }
  return fetchMarketListingsFromJson(market);
}

async function fetchAllOsloListingsFromCsv() {
  return fetchMarketListingsFromCsv(getMarket("oslo"));
}

async function fetchAllOsloListingsFromJson() {
  return fetchMarketListingsFromJson(getMarket("oslo"));
}

async function fetchAllOsloListings() {
  return fetchMarketListings("oslo");
}

async function fetchOsloMarketHtml() {
  return fetchHtml(OSLO_MARKET_URL);
}

module.exports = {
  OSLO_MARKET_URL,
  OSLO_DIRECTORY_PATH,
  OSLO_DIRECTORY_DOWNLOAD,
  OSLO_MICS,
  fetchMarketListings,
  fetchAllOsloListings,
  fetchAllOsloListingsFromCsv,
  parseOsloCsv,
  parseEuronextCsv,
  fetchOsloMarketHtml,
  fetchHtml,
  listMarkets,
};
