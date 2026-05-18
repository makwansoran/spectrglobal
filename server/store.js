/**
 * Company data: Supabase when configured, else local SQLite/JSON.
 */
const local = require("./local-store");
const supabase = require("./supabase-store");
const searchIndex = require("./search-index");
const seedStore = require("./seed-store");
const finnhub = require("./finnhub");
const commoditiesStore = require("./commodities-store");
const { dedupeSearchResults, formatSearchSubtitle, scoreUnifiedSearch } = require("./search-rank");
const { syncPeopleFromCompany } = require("./people-sync");
const peopleStore = require("./people-store");

async function listCompanies(options = {}) {
  const limit = options.limit || null;
  if (supabase.isSupabaseEnabled()) {
    try {
      return await supabase.listCompaniesSupabase(limit);
    } catch (err) {
      console.warn("Supabase list failed:", err.message);
    }
  }
  const indexed = searchIndex.listIndex(limit || 500);
  if (indexed.length) return indexed;
  return local.listCompaniesLocal(limit);
}

async function searchCompanies(query, limit = 25) {
  let rows = [];

  if (supabase.isSupabaseEnabled()) {
    try {
      rows = await supabase.searchCompaniesSupabase(query, limit * 4);
    } catch (err) {
      console.warn("Supabase search failed:", err.message);
    }
  }

  if (!rows.length && finnhub.isEnabled()) {
    try {
      rows = await finnhub.searchToIndexItems(query, limit * 4);
    } catch (err) {
      console.warn("Finnhub search failed:", err.message);
    }
  }

  if (!rows.length) {
    rows = searchIndex.searchIndex(query, limit * 4);
  }
  if (!rows.length) {
    rows = local.searchCompaniesLocal(query, limit * 4);
  }

  const companies = dedupeSearchResults(rows, query, limit * 2).map((row) => {
    const { profile_json, profile, ...rest } = row;
    return {
      ...rest,
      kind: rest.kind || "company",
      subtitle: formatSearchSubtitle(row),
    };
  });

  let commodities = [];
  try {
    commodities = await commoditiesStore.searchCommodities(query, limit * 2);
  } catch (err) {
    console.warn("Commodity search failed:", err.message);
  }

  return [...companies, ...commodities]
    .sort((a, b) => scoreUnifiedSearch(b, query) - scoreUnifiedSearch(a, query))
    .slice(0, limit)
    .map((row) => {
      const { profile_json, profile, ...rest } = row;
      return rest;
    });
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
  const fromSeed = seedStore.readSeed(slug);
  if (fromSeed?.profile) return fromSeed;

  if (finnhub.isEnabled() && String(slug).startsWith("us-")) {
    try {
      const built = await finnhub.buildCompanyFromSlug(slug);
      if (built?.profile) return built;
    } catch (err) {
      console.warn(`Finnhub profile(${slug}):`, err.message);
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
  if (finnhub.isEnabled()) return "finnhub";
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
