/**
 * Supabase public.countries — sovereign states / territories catalog.
 */
const { getAdminClient, requireSupabase, hasSupabaseWrites } = require("./supabase-client");
const {
  countryInitials,
  buildCountryMeta,
  buildCountrySearchTerms,
  seedToCountryProfile,
} = require("./country-utils");

function profileToRow(profile, mapGeojson = null) {
  return {
    slug: profile.slug,
    iso_code: profile.isoCode,
    name: profile.name,
    meta: buildCountryMeta(profile),
    initials: profile.logoInitials || countryInitials(profile.name),
    search_terms: buildCountrySearchTerms(profile),
    profile_json: profile,
    map_geojson: mapGeojson ?? null,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

function rowToIndex(row) {
  return {
    id: row.slug,
    kind: "country",
    name: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/country/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    isoCode: row.iso_code,
    subtitle: row.iso_code || row.meta || null,
  };
}

function fileToRow(file) {
  const profile = seedToCountryProfile(file);
  return profileToRow(profile, file.mapGeojson ?? null);
}

async function listCountries(limit = 500) {
  requireSupabase();
  let query = getAdminClient()
    .from("countries")
    .select("slug, iso_code, name, meta, initials, search_terms, profile_json")
    .order("name");
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function searchCountries(query, limit = 25) {
  requireSupabase();
  const q = String(query || "").trim().toLowerCase();
  if (!q) return listCountries(limit);

  const safe = q.replace(/[%_,.()]/g, "");
  if (!safe) return [];

  const pattern = `%${safe}%`;
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
    .from("countries")
    .select("slug, iso_code, name, meta, initials, search_terms, profile_json")
    .or(`name.ilike.${pattern},meta.ilike.${pattern},slug.ilike.${pattern},iso_code.ilike.${pattern}`)
    .order("name")
    .limit(limit);
  if (byText.error) throw byText.error;
  addRows(byText.data);

  if (merged.length < limit) {
    const byTerms = await client
      .from("countries")
      .select("slug, iso_code, name, meta, initials, search_terms, profile_json")
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (!byTerms.error) addRows(byTerms.data);
  }

  return merged.slice(0, limit).map(rowToIndex);
}

async function getCountry(slug) {
  requireSupabase();
  const { data, error } = await getAdminClient()
    .from("countries")
    .select("profile_json, map_geojson")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    profile: data.profile_json,
    mapGeojson: data.map_geojson ?? null,
  };
}

async function upsertCountriesBatch(files, chunkSize = 50) {
  requireSupabase();
  if (!hasSupabaseWrites()) {
    throw new Error("Writes require SUPABASE_SERVICE_ROLE_KEY");
  }
  const rows = files.map(fileToRow);
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await getAdminClient().from("countries").upsert(chunk, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  countries batch ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
  return rows.length;
}

module.exports = {
  profileToRow,
  rowToIndex,
  listCountries,
  searchCountries,
  getCountry,
  upsertCountriesBatch,
};
