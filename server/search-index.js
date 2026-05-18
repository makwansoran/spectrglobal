/**
 * Lightweight company index shipped with the repo (Oslo seeds + any built entries).
 * Used when Supabase is unavailable (e.g. Vercel without env vars).
 */
const fs = require("fs");
const path = require("path");
const { buildMeta } = require("./local-store");

const INDEX_PATH = path.join(__dirname, "..", "data", "company-search-index.json");

let cached;

function loadIndex() {
  if (cached) return cached;
  if (!fs.existsSync(INDEX_PATH)) {
    cached = [];
    return cached;
  }
  try {
    cached = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
  } catch {
    cached = [];
  }
  return cached;
}

function seedToIndexItem(seed) {
  const profile = seed.profile;
  const slug = seed.slug || profile?.id;
  if (!slug || !profile?.name) return null;
  const terms = new Set(
    [
      ...(seed.searchTerms || []),
      slug,
      profile.name,
      profile.legalName,
      profile.stock?.ticker,
    ]
      .filter(Boolean)
      .map((t) => String(t).toLowerCase())
  );
  return {
    id: slug,
    name: profile.name,
    legalName: profile.legalName || profile.name,
    meta: buildMeta(profile),
    initials: profile.logoInitials || "??",
    url: `/company/${slug}`,
    terms: [...terms],
    ticker: profile.stock?.ticker || null,
    profile_json: profile,
  };
}

function searchIndex(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return loadIndex().slice(0, limit);

  return loadIndex()
    .filter((row) => {
      if (row.name.toLowerCase().includes(q)) return true;
      if (row.legalName.toLowerCase().includes(q)) return true;
      if (row.id.includes(q)) return true;
      return row.terms.some((t) => t.includes(q) || t.startsWith(q));
    })
    .slice(0, limit);
}

function listIndex(limit) {
  const all = loadIndex();
  return limit ? all.slice(0, limit) : all;
}

module.exports = {
  INDEX_PATH,
  loadIndex,
  seedToIndexItem,
  searchIndex,
  listIndex,
};
