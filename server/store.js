/**
 * Company data — Supabase only (no Finnhub, local JSON, or SQLite fallbacks).
 */
const supabase = require("./supabase-store");
const { isSupabaseEnabled, requireSupabase } = require("./supabase-client");
const {
  dedupeSearchResults,
  formatSearchSubtitle,
  formatCommoditySearchSubtitle,
  mergeSearchResults,
} = require("./search-rank");
const { syncPeopleFromCompany } = require("./people-sync");

async function listCompanies(options = {}) {
  requireSupabase();
  const limit = options.limit || null;
  return supabase.listCompaniesSupabase(limit);
}

/**
 * Company search — public.companies in Supabase only.
 */
async function searchCompanies(query, limit = 25) {
  requireSupabase();

  let rows = [];
  try {
    rows = await supabase.searchCompaniesSupabase(query, limit * 4);
  } catch (err) {
    console.error("[searchCompanies]", err.message);
    return [];
  }

  const ranked = dedupeSearchResults(rows, query, limit);
  return ranked.map((row) => {
    const { profile_json, profile, slug, ...rest } = row;
    const canonicalId = row.id || slug;
    return {
      ...rest,
      id: canonicalId,
      url: `/company/${canonicalId}`,
      kind: "company",
      source: "supabase",
      subtitle: formatSearchSubtitle(row),
    };
  });
}

/**
 * Unified search — companies, commodities, waterways, people, countries, politicians, vessels.
 * Powers the homepage hero search and the in-app nav search.
 */
async function searchUnified(query, limit = 25) {
  const commoditiesStore = require("./commodities-store");
  const waterwaysStore = require("./waterways-store");
  const peopleStore = require("./supabase-people-store");
  const countriesStore = require("./supabase-countries-store");
  const politiciansStore = require("./supabase-politicians-store");
  const fleetStore = require("./supabase-fleet-store");
  const {
    formatWaterwaySearchSubtitle,
    formatPersonSearchSubtitle,
    formatCountrySearchSubtitle,
    formatPoliticianSearchSubtitle,
    queryLooksLikeTicker,
  } = require("./search-rank");
  const euronextSync = require("./euronext/sync");

  let companies = await searchCompanies(query, limit).catch(() => []);

  if (query.trim() && companies.length < 3 && queryLooksLikeTicker(query)) {
    try {
      await euronextSync.ensureOsloTickerSynced(query);
      companies = await searchCompanies(query, limit).catch(() => companies);
    } catch (err) {
      console.warn("[euronext] search sync:", err.message);
    }
  }

  const [commodities, waterways, people, countries, politicians, vessels] = await Promise.all([
    commoditiesStore.searchCommodities(query, limit).catch(() => []),
    waterwaysStore.searchWaterways(query, limit).catch(() => []),
    searchPeople(query, limit).catch(() => []),
    countriesStore.searchCountries(query, limit).catch(() => []),
    politiciansStore.searchPoliticians(query, limit).catch(() => []),
    fleetStore.searchVessels(query, limit).catch(() => []),
  ]);

  const commodityRows = commodities.map((row) => {
    const { profile_json, profile, ...rest } = row;
    return {
      ...rest,
      kind: "commodity",
      source: "supabase",
      subtitle: formatCommoditySearchSubtitle(row),
    };
  });

  const waterwayRows = waterways.map((row) => {
    const { profile_json, profile, ...rest } = row;
    return {
      ...rest,
      kind: "waterway",
      source: "supabase",
      subtitle: formatWaterwaySearchSubtitle(row),
    };
  });

  const personRows = people.map((row) => ({
    ...row,
    kind: "person",
    source: "supabase",
    subtitle: row.subtitle || formatPersonSearchSubtitle(row),
  }));

  const countryRows = countries.map((row) => ({
    ...row,
    kind: "country",
    source: "supabase",
    subtitle: row.subtitle || formatCountrySearchSubtitle(row),
  }));

  const politicianRows = politicians.map((row) => ({
    ...row,
    kind: "politician",
    source: "supabase",
    subtitle: row.subtitle || formatPoliticianSearchSubtitle(row),
  }));

  const vesselRows = vessels.map((row) => ({
    ...row,
    kind: "vessel",
    source: "supabase",
  }));

  return mergeSearchResults({
    companies,
    commodities: commodityRows,
    waterways: waterwayRows,
    people: personRows,
    countries: countryRows,
    politicians: politicianRows,
    vessels: vesselRows,
    query,
    limit,
  });
}

async function searchPeople(query, limit = 25) {
  requireSupabase();
  const peopleStore = require("./supabase-people-store");
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  const safe = q.replace(/[%_,.()]/g, "");
  if (!safe) return [];
  const pattern = `%${safe}%`;
  const { getAdminClient } = require("./supabase-client");
  const client = getAdminClient();
  const seen = new Set();
  const merged = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(row);
    }
  };

  const byText = await client
    .from("company_people")
    .select("slug, name, meta, initials, search_terms, title, company_slug")
    .or(`name.ilike.${pattern},meta.ilike.${pattern},slug.ilike.${pattern},title.ilike.${pattern}`)
    .order("name")
    .limit(limit * 2);
  if (byText.error) throw byText.error;
  addRows(byText.data);

  if (merged.length < limit) {
    const byTerms = await client
      .from("company_people")
      .select("slug, name, meta, initials, search_terms, title, company_slug")
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (!byTerms.error) addRows(byTerms.data);
  }

  return merged.slice(0, limit).map((row) => ({
    id: row.slug,
    kind: "person",
    name: row.name,
    meta: row.meta || "",
    initials: row.initials,
    url: `/person/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    title: row.title || "",
    companySlug: row.company_slug || null,
    subtitle: row.meta || row.title || "",
  }));
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

  const { normalizeCompanyProfile } = require("./normalize-profile");
  company.profile = normalizeCompanyProfile(company.profile);

  const { defaultLogoUrl } = require("./company-logo");
  if (!company.profile.logoUrl) {
    const logoUrl = defaultLogoUrl(company.profile);
    if (logoUrl) company.profile = { ...company.profile, logoUrl };
  }

  const peopleStore = require("./people-store");
  company.profile = await peopleStore.hydrateCompanyPeople(company.profile, slug);

  const { enrichOwnership } = require("./institutions");
  if (company.profile.ownership) {
    company.profile = {
      ...company.profile,
      ownership: enrichOwnership(company.profile.ownership),
    };
  }

  const { profileIrUrl } = require("./company-enrich");
  const canEnrich =
    company.profile.stock?.ticker || profileIrUrl(company.profile);

  if (company.profile.stock?.ticker) {
    try {
      const { fetchLiveQuoteForProfile, applyQuoteToStock } = require("./company-quote");
      const live = await fetchLiveQuoteForProfile(company.profile);
      if (live?.price) {
        company.profile = {
          ...company.profile,
          stock: applyQuoteToStock(company.profile.stock, live),
        };
      }
    } catch {
      /* quote optional */
    }
  }

  if (canEnrich) {
    const { enrichCompanyIfStale } = require("./company-enrich");
    enrichCompanyIfStale(slug);
  }

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
  searchUnified,
  searchPeople,
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
