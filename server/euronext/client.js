/**
 * Euronext Live HTTP client (product directory JSON gateway).
 * @see https://live.euronext.com/nb/markets/oslo
 */

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

function directoryUrl(offset, length) {
  const params = new URLSearchParams({
    mics: OSLO_MICS,
    iDisplayStart: String(offset),
    iDisplayLength: String(length),
    sEcho: "1",
  });
  return `https://live.euronext.com${OSLO_DIRECTORY_PATH}?${params}`;
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

function parseOsloCsv(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

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
    const mic =
      /growth/i.test(marketLabel) ? "XOAS" : /merkur/i.test(marketLabel) ? "MERK" : "XOSL";

    rows.push({
      name,
      isin,
      ticker: String(ticker).trim(),
      mic,
      marketLabel: marketLabel || "Oslo Børs",
      currency: cols[4] || "NOK",
      lastPrice: Number.isFinite(lastPrice) ? lastPrice : null,
      dayChangePct: null,
      lastTradeLabel: cols[9] ? String(cols[9]).trim() : null,
      productPath: `/nb/product/equities/${isin}-${mic}`,
      productUrl: `https://live.euronext.com/nb/product/equities/${isin}-${mic}`,
      rawRow: cols,
    });
  }
  return rows;
}

async function fetchAllOsloListingsFromCsv() {
  const url = `https://live.euronext.com${OSLO_DIRECTORY_DOWNLOAD}`;
  const text = await fetchHtml(url);
  const listings = parseOsloCsv(text);
  return { total: listings.length, rows: listings, format: "csv" };
}

async function fetchAllOsloListingsFromJson() {
  const first = await fetchJson(directoryUrl(0, PAGE_SIZE));
  const total = Number(first.iTotalRecords || 0);
  const rows = [...(first.aaData || [])];
  return { total, rows, format: "datatables" };
}

async function fetchAllOsloListings() {
  try {
    const csv = await fetchAllOsloListingsFromCsv();
    if (csv.rows.length > 50) return csv;
  } catch (err) {
    console.warn("[euronext] CSV download failed:", err.message);
  }
  return fetchAllOsloListingsFromJson();
}

async function fetchOsloMarketHtml() {
  return fetchHtml(OSLO_MARKET_URL);
}

module.exports = {
  OSLO_MARKET_URL,
  fetchAllOsloListings,
  fetchAllOsloListingsFromCsv,
  parseOsloCsv,
  fetchOsloMarketHtml,
  fetchHtml,
};
