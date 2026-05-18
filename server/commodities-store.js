/**
 * Commodities — Supabase only (table: public.commodities).
 */
const { commodities } = require("./catalog-stores");
const { isSupabaseEnabled } = require("./supabase-client");

function requireConfigured() {
  if (!isSupabaseEnabled()) {
    throw new Error("Supabase is not configured");
  }
}

async function searchCommodities(query, limit = 25) {
  requireConfigured();
  return commodities.search(query, limit);
}

async function listCommodities(limit = 500) {
  requireConfigured();
  return commodities.list(limit);
}

async function getCommodity(slug) {
  requireConfigured();
  return commodities.get(slug);
}

async function upsertCommoditiesBatch(seeds) {
  requireConfigured();
  return commodities.upsertBatch(seeds);
}

function loadSeedFile() {
  const fs = require("fs");
  const path = require("path");
  const SEED_PATH = path.join(__dirname, "..", "data", "seed", "commodities.json");
  if (!fs.existsSync(SEED_PATH)) return [];
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
}

function buildSearchIndexFile() {
  console.warn("buildSearchIndexFile is deprecated — search reads from Supabase commodities table.");
  return loadSeedFile().length;
}

module.exports = {
  searchCommodities,
  listCommodities,
  getCommodity,
  upsertCommoditiesBatch,
  loadSeedFile,
  buildSearchIndexFile,
  seedToRow: commodities.seedToRow,
  rowToIndex: commodities.rowToIndex,
  search: searchCommodities,
  list: listCommodities,
  get: getCommodity,
};
