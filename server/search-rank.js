/**
 * Deduplicate and rank company search results (e.g. many us-aapl* stubs → one Apple).
 */

/** Curated profiles win over auto-imported us-* stubs for the same ticker. */
const PREFERRED_SLUG_BY_TICKER = {
  AAPL: "apple-inc-aapl",
  NVDA: "us-nvda",
};

function normalizeTicker(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

function normalizeCompanyName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/\s+(inc|corp|corporation|ltd|plc|asa|as|sa)\.?$/i, "")
    .replace(/[^a-z0-9]/g, "");
}

/** Short symbols only (e.g. AAPL, NVDA) — not company names like "nvidia" or "apple". */
function queryLooksLikeTicker(query) {
  const q = String(query || "").trim();
  if (q.length < 1 || q.length > 5) return false;
  return /^[A-Za-z][A-Za-z0-9.-]*$/.test(q);
}

function tickerFromSlug(slug) {
  const s = String(slug || "");
  if (s.startsWith("us-")) return normalizeTicker(s.slice(3));
  const m = s.match(/-([a-z0-9]{1,6})$/i);
  return m ? normalizeTicker(m[1]) : "";
}

function getRowTicker(row) {
  const profile = row.profile_json || row.profile || null;
  const fromProfile = profile?.stock?.ticker;
  if (fromProfile) return normalizeTicker(fromProfile);
  if (row.ticker) return normalizeTicker(row.ticker);
  return tickerFromSlug(row.id || row.slug);
}

function getGroupKey(row) {
  const ticker = getRowTicker(row);
  if (ticker) return `ticker:${ticker}`;
  const name = normalizeCompanyName(row.name || row.legalName);
  if (name) return `name:${name}`;
  return `slug:${row.id || row.slug}`;
}

function isDerivativeListing(row) {
  const name = String(row.name || row.legalName || "");
  const profile = row.profile_json || row.profile || null;
  const type = String(profile?.finnhub?.type || profile?.stock?.type || "");
  return /ETP|ETF|ADR|Fund|Leverage|Inverse|2X|3X/i.test(`${type} ${name}`);
}

function scoreRow(row, query) {
  const slug = row.id || row.slug || "";
  const q = String(query || "").trim();
  const qLower = q.toLowerCase();
  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  const rowTicker = getRowTicker(row);
  const profile = row.profile_json || row.profile || null;
  const nameLower = String(row.name || "").toLowerCase();

  let score = 0;

  if (qTicker && PREFERRED_SLUG_BY_TICKER[qTicker] === slug) score += 1000;
  if (!slug.startsWith("us-")) score += 120;
  if (Array.isArray(profile?.people) && profile.people.length > 0) score += 80;
  if (qTicker && rowTicker === qTicker) score += 200;
  if (slug.toLowerCase() === qLower || slug.toLowerCase().includes(qLower)) score += 40;
  if (nameLower === qLower) score += 60;
  if (qLower.length >= 3 && nameLower.includes(qLower)) score += 150;
  if (Array.isArray(row.terms) && row.terms.includes(qLower)) score += 30;
  if (isDerivativeListing(row)) score -= 90;

  return score;
}

function tickersMatchQuery(query, rowTicker) {
  const qn = normalizeTicker(query);
  const tn = normalizeTicker(rowTicker);
  if (!qn || !tn) return true;
  return tn === qn;
}

/**
 * @param {Array<object>} rows
 * @param {string} query
 * @param {number} limit
 */
function dedupeSearchResults(rows, query, limit = 25) {
  const q = String(query || "").trim();
  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  const groups = new Map();

  for (const row of rows || []) {
    if (!row?.id && !row?.slug) continue;

    const key = getGroupKey(row);
    const existing = groups.get(key);
    if (!existing || scoreRow(row, q) > scoreRow(existing, q)) {
      groups.set(key, row);
    }
  }

  return [...groups.values()]
    .sort((a, b) => scoreRow(b, q) - scoreRow(a, q))
    .slice(0, limit);
}

/** Subtitle for search UI — avoid "APPLE INC · APPLE INC". */
function formatSearchSubtitle(row) {
  const name = String(row.name || "").trim();
  const legal = String(row.legalName || "").trim();
  const ticker = getRowTicker(row);
  const meta = String(row.meta || "").trim();

  if (ticker && normalizeCompanyName(name) === normalizeCompanyName(legal)) {
    return ticker;
  }
  if (legal && legal.toLowerCase() !== name.toLowerCase()) return legal;
  if (meta && meta.toLowerCase() !== name.toLowerCase()) return meta;
  return ticker || legal || "";
}

function scoreUnifiedSearch(row, query) {
  const ql = String(query || "")
    .trim()
    .toLowerCase();
  if (!ql) return 0;

  let score = 0;
  const name = String(row.name || "").toLowerCase();
  const meta = String(row.meta || "").toLowerCase();
  const ticker = String(row.ticker || "").toLowerCase();

  if (name === ql) score += 200;
  else if (name.startsWith(ql)) score += 120;
  else if (name.includes(ql)) score += 70;

  if (ticker && ticker === ql) score += 190;
  else if (ticker && ticker.startsWith(ql)) score += 100;

  if (Array.isArray(row.terms) && row.terms.some((t) => t === ql)) score += 95;
  if (meta.includes(ql)) score += 40;
  if (row.id && String(row.id).includes(ql)) score += 30;
  if (row.kind === "commodity" && row.category && String(row.category).includes(ql)) score += 25;

  return score;
}

function formatCommoditySearchSubtitle(row) {
  const profile = row.profile_json || row.profile || {};
  const parts = [];
  if (profile.symbol) parts.push(profile.symbol);
  else if (row.ticker) parts.push(row.ticker);
  if (profile.exchange) parts.push(profile.exchange);
  else if (profile.categoryLabel) parts.push(profile.categoryLabel);
  parts.push("Commodity");
  return parts.filter(Boolean).join(" · ");
}

/** Merge company + commodity hits; exact commodity/symbol matches can outrank weak company hits. */
function mergeSearchResults(companies, commodities, query, limit = 25) {
  const pool = [
    ...companies.map((row) => ({ row, score: scoreUnifiedSearch(row, query) + 40 })),
    ...commodities.map((row) => ({ row, score: scoreUnifiedSearch(row, query) })),
  ];
  pool.sort((a, b) => b.score - a.score || String(a.row.name).localeCompare(String(b.row.name)));
  return pool.slice(0, limit).map((x) => x.row);
}

module.exports = {
  PREFERRED_SLUG_BY_TICKER,
  dedupeSearchResults,
  formatSearchSubtitle,
  mergeSearchResults,
  formatCommoditySearchSubtitle,
  scoreUnifiedSearch,
  getRowTicker,
  normalizeTicker,
  queryLooksLikeTicker,
};
