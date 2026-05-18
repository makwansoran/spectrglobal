/**
 * Deduplicate and rank company search results (e.g. many us-aapl* stubs → one Apple).
 */

/** Curated profiles win over auto-imported us-* stubs for the same ticker. */
const PREFERRED_SLUG_BY_TICKER = {
  AAPL: "apple-inc-aapl",
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

function queryLooksLikeTicker(query) {
  const q = String(query || "").trim();
  return /^[a-z][a-z0-9.-]{0,9}$/i.test(q);
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

function scoreRow(row, query) {
  const slug = row.id || row.slug || "";
  const q = String(query || "").trim();
  const qLower = q.toLowerCase();
  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  const rowTicker = getRowTicker(row);
  const profile = row.profile_json || row.profile || null;

  let score = 0;

  if (qTicker && PREFERRED_SLUG_BY_TICKER[qTicker] === slug) score += 1000;
  if (!slug.startsWith("us-")) score += 120;
  if (Array.isArray(profile?.people) && profile.people.length > 0) score += 80;
  if (qTicker && rowTicker === qTicker) score += 200;
  if (slug.toLowerCase() === qLower || slug.toLowerCase().includes(qLower)) score += 40;
  if (String(row.name || "").toLowerCase() === qLower) score += 60;
  if (Array.isArray(row.terms) && row.terms.includes(qLower)) score += 30;

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

    const rowTicker = getRowTicker(row);
    if (qTicker && rowTicker && !tickersMatchQuery(q, rowTicker)) continue;

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

module.exports = {
  PREFERRED_SLUG_BY_TICKER,
  dedupeSearchResults,
  formatSearchSubtitle,
  getRowTicker,
  normalizeTicker,
  queryLooksLikeTicker,
};
