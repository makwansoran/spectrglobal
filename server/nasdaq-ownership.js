/**
 * Top institutional holders via Nasdaq's public API (US symbols).
 */
const { findInstitution } = require("./institutions");

const NASDAQ_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; SpectrGlobal/1.0)",
  Accept: "application/json",
};

function parseNumber(text) {
  if (text == null) return 0;
  const n = parseFloat(String(text).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function parseShares(text) {
  return parseNumber(text);
}

function parseMarketValueThousands(text) {
  return parseNumber(text);
}

function sharesOutstandingMillions(summary) {
  const raw = summary?.ShareoutstandingTotal?.value || "";
  return parseNumber(raw);
}

async function resolveTotalShares(symbol, summary) {
  const outstandingM = sharesOutstandingMillions(summary);
  if (outstandingM > 0) return outstandingM * 1e6;

  const finnhub = require("./finnhub");
  if (finnhub.isEnabled()) {
    const raw = await finnhub.fetchStockProfile(symbol);
    const so = raw?.shareOutstanding;
    if (so && so > 0) return so * 1e6;
  }
  return null;
}

async function fetchNasdaqInstitutionalHoldings(symbol) {
  const sym = String(symbol || "").trim().toUpperCase();
  if (!sym) return null;

  const url = `https://api.nasdaq.com/api/company/${encodeURIComponent(sym)}/institutional-holdings?limit=50`;
  const res = await fetch(url, { headers: NASDAQ_HEADERS });
  if (!res.ok) {
    const err = new Error(`Nasdaq ownership ${res.status} for ${sym}`);
    err.status = res.status;
    throw err;
  }

  const json = await res.json();
  const data = json?.data;
  if (!data?.holdingsTransactions?.table?.rows?.length) return null;

  const totalShares = await resolveTotalShares(sym, data.ownershipSummary);

  const byInst = new Map();

  for (const row of data.holdingsTransactions.table.rows) {
    const name = String(row.ownerName || "").trim();
    if (!name) continue;

    const shares = parseShares(row.sharesHeld);
    const valueK = parseMarketValueThousands(row.marketValue);
    if (shares <= 0) continue;

    const inst = findInstitution(name);
    const key = inst?.slug || `raw:${name.toLowerCase()}`;
    const displayName = inst?.name || name.replace(/\s*,?\s*(Inc\.?|LLC|Llc|Corp\.?)$/i, "").trim();

    const prev = byInst.get(key) || {
      name: displayName,
      slug: inst?.slug,
      shares: 0,
      valueUsd: 0,
    };
    prev.shares += shares;
    prev.valueUsd += valueK * 1000;
    byInst.set(key, prev);
  }

  if (!totalShares || totalShares <= 0) return null;

  const shareholders = [...byInst.values()]
    .map((row) => {
      const percent = Math.round((row.shares / totalShares) * 10000) / 100;
      return {
        name: row.name,
        slug: row.slug,
        percent,
        detail: formatDetail(row.shares, row.valueUsd),
      };
    })
    .filter((s) => s.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 12);

  const asOf = data.holdingsTransactions.table.rows[0]?.date || null;

  return {
    asOf: asOf ? formatAsOf(asOf) : undefined,
    note: "Top institutional holders (Nasdaq institutional holdings).",
    shareholders,
  };
}

function formatAsOf(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function formatDetail(shares, valueUsd) {
  const parts = [];
  if (shares > 0) parts.push(`~${formatCompact(shares)} shares`);
  if (valueUsd > 0) parts.push(`~$${formatCompact(valueUsd)}`);
  return parts.join(" · ") || undefined;
}

function formatCompact(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return String(n);
  if (v >= 1e12) return `${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(0)}M`;
  if (v >= 1e3) return `${(v / 1e3).toFixed(0)}K`;
  return String(Math.round(v));
}

module.exports = {
  fetchNasdaqInstitutionalHoldings,
};
