/**
 * Company data: Supabase when configured, else local SQLite/JSON.
 */
const local = require("./local-store");
const supabase = require("./supabase-store");
const searchIndex = require("./search-index");
const { syncPeopleFromCompany } = require("./people-sync");
const peopleStore = require("./people-store");

async function listCompanies(options = {}) {
  const limit = options.limit || null;
  if (supabase.isSupabaseEnabled()) {
    try {
      const rows = await supabase.listCompaniesSupabase(limit);
      if (rows.length) return rows;
    } catch (err) {
      console.warn("Supabase list failed:", err.message);
    }
  }
  const indexed = searchIndex.listIndex(limit || 500);
  if (indexed.length) return indexed;
  return local.listCompaniesLocal(limit);
}

async function searchCompanies(query, limit = 25) {
  if (supabase.isSupabaseEnabled()) {
    try {
      const rows = await supabase.searchCompaniesSupabase(query, limit);
      return rows;
    } catch (err) {
      console.warn("Supabase search failed:", err.message);
    }
  }
  const indexed = searchIndex.searchIndex(query, limit);
  if (indexed.length) return indexed;
  return local.searchCompaniesLocal(query, limit);
}

async function getCompanyRaw(slug) {
  if (supabase.isSupabaseEnabled()) {
    try {
      const company = await supabase.getCompanySupabase(slug);
      if (company) return company;
    } catch (err) {
      console.warn(`Supabase get(${slug}) failed, using local:`, err.message);
    }
  }
  return local.getCompanyLocal(slug);
}

async function saveCompanySeed(seed) {
  local.upsertCompanyLocal(seed);
  if (supabase.isSupabaseEnabled()) {
    try {
      await supabase.upsertCompanySupabase(seed);
    } catch (err) {
      console.warn(`  Supabase company save(${seed.slug}) skipped:`, err.message);
    }
  }
}

async function getCompany(slug) {
  const company = await getCompanyRaw(slug);
  if (!company?.profile) return company;

  company.profile = await peopleStore.hydrateCompanyPeople(company.profile, slug);
  return company;
}

async function upsertCompany(seed) {
  if (!seed?.profile || !seed?.slug) return "skipped";

  const profileWithRefs = await syncPeopleFromCompany(seed);
  const nextSeed = { ...seed, profile: profileWithRefs };

  local.upsertCompanyLocal(nextSeed);

  if (supabase.isSupabaseEnabled()) {
    await supabase.upsertCompanySupabase(nextSeed);
    return "supabase+local";
  }
  return "local";
}

async function syncAfterSeed(activeSlugs) {
  local.removeStaleExports(activeSlugs);

  if (supabase.isSupabaseEnabled()) {
    try {
      await supabase.deleteCompaniesNotInSupabase(activeSlugs);
    } catch (err) {
      console.warn("Supabase cleanup failed:", err.message);
    }
  }
}

function storageMode() {
  if (supabase.isSupabaseEnabled()) return "supabase";
  if (searchIndex.loadIndex().length) return "index";
  return "local";
}

module.exports = {
  listCompanies,
  searchCompanies,
  getCompany,
  getCompanyRaw,
  saveCompanySeed,
  upsertCompany,
  syncAfterSeed,
  storageMode,
  isSupabaseEnabled: supabase.isSupabaseEnabled,
  listPeople: peopleStore.listPeople,
  getPerson: peopleStore.getPerson,
  DB_PATH: local.DB_PATH,
  EXPORT_DIR: local.EXPORT_DIR,
};
