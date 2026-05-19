/**
 * SEC EDGAR submissions (official, free) — all recent SEC filings for US-listed tickers.
 * @see https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data
 */

const SEC_HEADERS = {
  "User-Agent": "Spectr spectr.no (contact@spectr.no)",
  Accept: "application/json",
};

const TICKERS_URL = "https://www.sec.gov/files/company_tickers.json";

let tickerToCik = null;
let tickerMapLoadedAt = 0;
const MAP_TTL_MS = 24 * 60 * 60 * 1000;

async function loadTickerCikMap() {
  if (tickerToCik && Date.now() - tickerMapLoadedAt < MAP_TTL_MS) return tickerToCik;
  const res = await fetch(TICKERS_URL, { headers: SEC_HEADERS });
  if (!res.ok) throw new Error(`SEC tickers HTTP ${res.status}`);
  const raw = await res.json();
  const map = new Map();
  for (const row of Object.values(raw)) {
    if (!row?.ticker || row.cik_str == null) continue;
    map.set(String(row.ticker).toUpperCase(), String(row.cik_str));
  }
  tickerToCik = map;
  tickerMapLoadedAt = Date.now();
  return map;
}

async function resolveCik(ticker) {
  const t = String(ticker || "")
    .trim()
    .toUpperCase()
    .replace(/\.(OL|US|L|DE)$/i, "");
  if (!t) return null;
  const map = await loadTickerCikMap();
  return map.get(t) || null;
}

function filingUrl(cik, accessionNumber, primaryDocument) {
  if (!accessionNumber) return null;
  const acc = String(accessionNumber).replace(/-/g, "");
  const cikNum = String(parseInt(cik, 10));
  if (primaryDocument) {
    return `https://www.sec.gov/Archives/edgar/data/${cikNum}/${acc}/${primaryDocument}`;
  }
  return `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cikNum}&type=&dateb=&owner=exclude&count=40`;
}

function parseSubmissions(submissions, cik, limit = 100) {
  const recent = submissions?.filings?.recent;
  if (!recent?.form?.length) return [];

  const out = [];
  const n = recent.form.length;
  for (let i = 0; i < n && out.length < limit; i += 1) {
    const form = recent.form[i];
    const filed = recent.filingDate?.[i] || recent.reportDate?.[i] || "";
    const desc = recent.primaryDocDescription?.[i] || form;
    const acc = recent.accessionNumber?.[i];
    const doc = recent.primaryDocument?.[i];
    out.push({
      id: `sec-${acc || `${cik}-${i}`}`,
      title: String(desc || form).trim() || form,
      type: form,
      date: filed,
      jurisdiction: "SEC (EDGAR)",
      url: filingUrl(cik, acc, doc),
      source: "sec-edgar",
    });
  }
  return out;
}

/**
 * @param {string} ticker US ticker (e.g. AAPL, EQNR for ADR if in SEC list)
 * @param {number} limit max filings
 */
async function fetchEdgarFilings(ticker, limit = 100) {
  const cik = await resolveCik(ticker);
  if (!cik) return [];

  const padded = String(cik).padStart(10, "0");
  const url = `https://data.sec.gov/submissions/CIK${padded}.json`;
  const res = await fetch(url, { headers: SEC_HEADERS });
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`SEC submissions HTTP ${res.status}`);
  }
  const data = await res.json();
  const filings = parseSubmissions(data, cik, limit);

  const extra = data.filings?.files;
  if (Array.isArray(extra) && filings.length < limit) {
    for (const file of extra.slice(0, 2)) {
      if (!file?.name) continue;
      try {
        const histRes = await fetch(`https://data.sec.gov/submissions/${file.name}`, { headers: SEC_HEADERS });
        if (!histRes.ok) continue;
        const hist = await histRes.json();
        filings.push(...parseSubmissions(hist, cik, limit - filings.length));
      } catch {
        /* optional history */
      }
    }
  }

  return filings.slice(0, limit);
}

module.exports = { resolveCik, fetchEdgarFilings };
