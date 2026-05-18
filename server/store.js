/**
 * Company data — Supabase only (no Finnhub, local JSON, or SQLite fallbacks).
 */
const supabase = require("./supabase-store");
const { isSupabaseEnabled, requireSupabase } = require("./supabase-client");
const { dedupeSearchResults, formatSearchSubtitle } = require("./search-rank");
const { syncPeopleFromCompany } = require("./people-sync");

async function listCompanies(options = {}) {
  requireSupabase();
  const limit = options.limit || null;
  return supabase.listCompaniesSupabase(limit);
}

/**
 * Company search — public.companies in Supabase only (no Finnhub, JSON index, or commodities).
 */
async function searchCompanies(query, limit = 25) {
  requireSupabase();

  const rows = await supabase.searchCompaniesSupabase(query, limit * 4);

  return dedupeSearchResults(rows, query, limit).map((row) => {
    const { profile_json, profile, ...rest } = row;
    return {
      ...rest,
      kind: "company",
      source: "supabase",
      subtitle: formatSearchSubtitle(row),
    };
  });
}

async function getCompanyRaw(slug) {
  requireSupabase();
  return supabase.getCompanySupabase(slug);
}

async function saveCompanySeed(seed) {
  requireSupabase();
  await supabase.upsertCompanySupabase(seed);
}

async function getCompany(slug) {
  const company = await getCompanyRaw(slug);
  if (!company?.profile) return company;

  const { defaultLogoUrl } = require("./company-logo");
  if (!company.profile.logoUrl) {
    const logoUrl = defaultLogoUrl(company.profile);
    if (logoUrl) company.profile = { ...company.profile, logoUrl };
  }

  const peopleStore = require("./people-store");
  company.profile = await peopleStore.hydrateCompanyPeople(company.profile, slug);
  return company;
}

async function upsertCompany(seed) {
  if (!seed?.profile || !seed?.slug) return "skipped";

  const profileWithRefs = await syncPeopleFromCompany(seed);
  const nextSeed = { ...seed, profile: profileWithRefs };

  requireSupabase();
  await supabase.upsertCompanySupabase(nextSeed);
  return "supabase";
}

async function syncAfterSeed(activeSlugs) {
  requireSupabase();
  await supabase.deleteCompaniesNotInSupabase(activeSlugs);
}

function storageMode() {
  return isSupabaseEnabled() ? "supabase" : "unconfigured";
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
  isSupabaseEnabled,
  listPeople: (...args) => require("./people-store").listPeople(...args),
  getPerson: (...args) => require("./people-store").getPerson(...args),
};
