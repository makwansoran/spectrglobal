/**
 * Map duplicate listings (Euronext import, US OTC/ADR, etc.) to curated company slugs.
 */

const fs = require("fs");
const path = require("path");

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
  AKRBP: "aker-bp-asa-akrbp",
  AKRBF: "aker-bp-asa-akrbp",
  AKRBY: "aker-bp-asa-akrbp",
  AAPL: "apple-inc-aapl",
  NVDA: "us-nvda",
};

/** Merge search hits that share the same normalized legal name. */
const CANONICAL_SLUG_BY_NORMALIZED_NAME = {
  equinor: "equinor",
  akerbp: "aker-bp-asa-akrbp",
};

let registryCache = null;

function loadRegistry() {
  if (registryCache) return registryCache;
  try {
    const p = path.join(__dirname, "../data/canonical-registry.json");
    if (fs.existsSync(p)) {
      registryCache = JSON.parse(fs.readFileSync(p, "utf8"));
      return registryCache;
    }
  } catch {
    /* ignore */
  }
  registryCache = { byName: {}, byTicker: {} };
  return registryCache;
}

function resolveCanonicalSlug({ ticker, name, legalName, slug }) {
  const t = normalizeTicker(ticker || "");
  if (t && PREFERRED_SLUG_BY_TICKER[t]) return PREFERRED_SLUG_BY_TICKER[t];

  const n = normalizeCompanyName(name || legalName || "");
  if (n && CANONICAL_SLUG_BY_NORMALIZED_NAME[n]) return CANONICAL_SLUG_BY_NORMALIZED_NAME[n];

  const reg = loadRegistry();
  if (t && reg.byTicker?.[t]) return reg.byTicker[t];
  if (n && reg.byName?.[n]) return reg.byName[n];

  if (slug && CANONICAL_SLUG_BY_NORMALIZED_NAME[normalizeCompanyName(slug.replace(/-/g, " "))]) {
    return CANONICAL_SLUG_BY_NORMALIZED_NAME[normalizeCompanyName(slug.replace(/-/g, " "))];
  }

  return null;
}

function isDuplicateOfCanonical(slug, { ticker, name, legalName }) {
  const canonical = resolveCanonicalSlug({ ticker, name, legalName, slug });
  return canonical && canonical !== slug;
}

/** Pick the best slug when several rows share the same company name. */
function scoreCanonicalCandidate(row) {
  const slug = row.slug || row.id || "";
  const profile = row.profile_json || row.profile || {};
  let score = 0;
  if (!slug.startsWith("us-")) score += 150;
  if (profile.logoUrl) score += 80;
  if (Array.isArray(profile.people) && profile.people.length > 0) score += 100;
  if ((profile.about || "").length > 150) score += 70;
  if (profile.euronext) score += 40;
  if (/^[a-z0-9-]+-[a-z0-9]{2,8}$/.test(slug) && !slug.startsWith("us-")) score += 50;
  if (resolveCanonicalSlug({ slug, name: row.name, legalName: row.legal_name || row.legalName }) === slug) {
    score += 200;
  }
  return score;
}

function pickCanonicalFromRows(rows) {
  if (!rows?.length) return null;
  let best = rows[0];
  let bestScore = scoreCanonicalCandidate(best);
  for (let i = 1; i < rows.length; i += 1) {
    const s = scoreCanonicalCandidate(rows[i]);
    if (s > bestScore) {
      best = rows[i];
      bestScore = s;
    }
  }
  return best.slug || best.id;
}

module.exports = {
  PREFERRED_SLUG_BY_TICKER,
  CANONICAL_SLUG_BY_NORMALIZED_NAME,
  normalizeTicker,
  normalizeCompanyName,
  resolveCanonicalSlug,
  isDuplicateOfCanonical,
  scoreCanonicalCandidate,
  pickCanonicalFromRows,
  loadRegistry,
};
