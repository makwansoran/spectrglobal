/**
 * Map duplicate listings (Euronext import, US OTC, etc.) to curated company slugs.
 */

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

/** Primary profile slug when multiple DB rows share the same ticker. */
const PREFERRED_SLUG_BY_TICKER = {
  EQNR: "equinor",
  STOHF: "equinor",
  AAPL: "apple-inc-aapl",
  NVDA: "us-nvda",
};

/** Merge search hits that share the same normalized legal name. */
const CANONICAL_SLUG_BY_NORMALIZED_NAME = {
  equinor: "equinor",
};

function resolveCanonicalSlug({ ticker, name, legalName, slug }) {
  const t = normalizeTicker(ticker || "");
  if (t && PREFERRED_SLUG_BY_TICKER[t]) return PREFERRED_SLUG_BY_TICKER[t];

  const n = normalizeCompanyName(name || legalName || "");
  if (n && CANONICAL_SLUG_BY_NORMALIZED_NAME[n]) return CANONICAL_SLUG_BY_NORMALIZED_NAME[n];

  if (slug && CANONICAL_SLUG_BY_NORMALIZED_NAME[normalizeCompanyName(slug.replace(/-/g, " "))]) {
    return CANONICAL_SLUG_BY_NORMALIZED_NAME[normalizeCompanyName(slug.replace(/-/g, " "))];
  }

  return null;
}

function isDuplicateOfCanonical(slug, { ticker, name, legalName }) {
  const canonical = resolveCanonicalSlug({ ticker, name, legalName, slug });
  return canonical && canonical !== slug;
}

module.exports = {
  PREFERRED_SLUG_BY_TICKER,
  CANONICAL_SLUG_BY_NORMALIZED_NAME,
  normalizeTicker,
  normalizeCompanyName,
  resolveCanonicalSlug,
  isDuplicateOfCanonical,
};
