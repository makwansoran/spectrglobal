/**
 * Commodity directory: Supabase when configured, else local JSON seed + index.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SEED_PATH = path.join(ROOT, "data", "seed", "commodities.json");
const INDEX_PATH = path.join(ROOT, "data", "commodity-search-index.json");

let supabase;
function getSupabase() {
  if (supabase !== undefined) return supabase;
  try {
    supabase = require("./supabase-commodities-store");
  } catch {
    supabase = null;
  }
  return supabase;
}

function loadSeedFile() {
  if (!fs.existsSync(SEED_PATH)) return [];
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
}

function seedToRow(seed) {
  const p = seed.profile;
  return {
    slug: seed.slug,
    name: p.name,
    category: p.category,
    meta: seed.meta || p.categoryLabel,
    initials: seed.initials,
    search_terms: seed.searchTerms || [],
    profile_json: p,
    updated_at: p.lastUpdated || new Date().toISOString(),
  };
}

function rowToIndex(row) {
  const profile = row.profile_json || row.profile || {};
  return {
    id: row.slug,
    kind: "commodity",
    name: row.name,
    legalName: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/commodity/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    ticker: profile.symbol || null,
    category: row.category || profile.category,
    subtitle: profile.symbol || profile.exchange || profile.categoryLabel || null,
  };
}

function loadLocalIndex() {
  if (fs.existsSync(INDEX_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
    } catch {
      /* fall through */
    }
  }
  return loadSeedFile().map((s) =>
    rowToIndex({
      slug: s.slug,
      name: s.profile.name,
      meta: s.meta,
      initials: s.initials,
      search_terms: s.searchTerms,
      profile_json: s.profile,
      category: s.profile.category,
    })
  );
}

function searchLocal(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return loadLocalIndex().slice(0, limit);

  return loadLocalIndex()
    .filter((row) => {
      if (row.name.toLowerCase().includes(q)) return true;
      if (row.meta.toLowerCase().includes(q)) return true;
      if (row.id.includes(q)) return true;
      if (row.ticker && row.ticker.toLowerCase().includes(q)) return true;
      return row.terms.some((t) => t.includes(q) || t.startsWith(q));
    })
    .slice(0, limit);
}

async function searchCommodities(query, limit = 25) {
  const sb = getSupabase();
  if (sb?.isSupabaseEnabled?.()) {
    try {
      const rows = await sb.searchCommoditiesSupabase(query, limit);
      if (rows.length) return rows;
    } catch (err) {
      console.warn("Supabase commodity search failed:", err.message);
    }
  }
  return searchLocal(query, limit);
}

async function getCommodity(slug) {
  const sb = getSupabase();
  if (sb?.isSupabaseEnabled?.()) {
    try {
      const row = await sb.getCommoditySupabase(slug);
      if (row) return row;
    } catch (err) {
      console.warn(`Supabase commodity get(${slug}):`, err.message);
    }
  }
  const seed = loadSeedFile().find((s) => s.slug === slug);
  if (!seed) return null;
  return { profile: seed.profile };
}

async function upsertCommodity(seed) {
  if (!seed?.slug || !seed?.profile) return "skipped";
  const sb = getSupabase();
  if (sb?.hasSupabaseWrites?.()) {
    await sb.upsertCommoditySupabase(seedToRow(seed));
    return "supabase";
  }
  return "local-only";
}

async function upsertCommoditiesBatch(seeds) {
  const sb = getSupabase();
  if (sb?.hasSupabaseWrites?.()) {
    await sb.upsertCommoditiesBatchSupabase(seeds.map(seedToRow));
    return "supabase";
  }
  return "local-only";
}

function buildSearchIndexFile() {
  const rows = loadSeedFile().map((s) =>
    rowToIndex({
      slug: s.slug,
      name: s.profile.name,
      meta: s.meta,
      initials: s.initials,
      search_terms: s.searchTerms,
      profile_json: s.profile,
      category: s.profile.category,
    })
  );
  fs.mkdirSync(path.dirname(INDEX_PATH), { recursive: true });
  fs.writeFileSync(INDEX_PATH, JSON.stringify(rows));
  return rows.length;
}

module.exports = {
  SEED_PATH,
  INDEX_PATH,
  loadSeedFile,
  seedToRow,
  rowToIndex,
  searchCommodities,
  getCommodity,
  upsertCommodity,
  upsertCommoditiesBatch,
  buildSearchIndexFile,
  loadLocalIndex,
};
