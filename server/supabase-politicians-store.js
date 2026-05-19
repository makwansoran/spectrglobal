/**
 * Supabase public.politicians — office holders per country.
 */
const { getAdminClient, requireSupabase } = require("./supabase-client");
const {
  buildPoliticianMeta,
  buildPoliticianSearchTerms,
  politicianInitials,
} = require("./country-utils");

function profileToRow(countrySlug, profile, { office = "", sortOrder = 0 } = {}) {
  const slug = profile.slug;
  return {
    country_slug: countrySlug,
    slug,
    name: profile.name,
    office: office || profile.office || profile.currentOffice || "",
    meta: buildPoliticianMeta(profile),
    initials: politicianInitials(profile.name),
    search_terms: buildPoliticianSearchTerms(profile),
    profile_json: profile,
    sort_order: sortOrder,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

function rowToIndex(row) {
  return {
    id: row.slug,
    kind: "politician",
    name: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/politician/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    countrySlug: row.country_slug,
    subtitle: row.office || row.meta || null,
  };
}

function rowToDisplay(row) {
  const p = row.profile_json || {};
  return {
    slug: row.slug,
    name: row.name || p.name,
    office: row.office || p.office || "",
    party: p.party,
    photoUrl: p.photoUrl,
    bio: p.bio,
  };
}

async function upsertCountryPoliticians(countrySlug, entries) {
  const client = getAdminClient();
  const { error: delError } = await client.from("politicians").delete().eq("country_slug", countrySlug);
  if (delError) throw delError;

  if (!entries.length) return;

  const rows = entries
    .filter((e) => e.profile?.slug || e.slug)
    .map((e, i) =>
      profileToRow(countrySlug, e.profile || e, {
        office: e.office || e.title || "",
        sortOrder: i,
      })
    );

  const { error } = await client.from("politicians").insert(rows);
  if (error) throw error;
}

async function listPoliticians() {
  requireSupabase();
  const { data, error } = await getAdminClient()
    .from("politicians")
    .select("slug, name, meta, initials, search_terms, country_slug, office")
    .order("name");
  if (error) throw error;

  const seen = new Set();
  const out = [];
  for (const row of data || []) {
    if (seen.has(row.slug)) continue;
    seen.add(row.slug);
    out.push(rowToIndex(row));
  }
  return out;
}

async function searchPoliticians(query, limit = 25) {
  requireSupabase();
  const q = String(query || "").trim().toLowerCase();
  if (!q) return listPoliticians().then((rows) => rows.slice(0, limit));

  const safe = q.replace(/[%_,.()]/g, "");
  if (!safe) return [];

  const pattern = `%${safe}%`;
  const { data, error } = await getAdminClient()
    .from("politicians")
    .select("slug, name, meta, initials, search_terms, country_slug, office")
    .or(`name.ilike.${pattern},meta.ilike.${pattern},office.ilike.${pattern},slug.ilike.${pattern}`)
    .order("name")
    .limit(limit);
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function getPolitician(slug) {
  const { data, error } = await getAdminClient()
    .from("politicians")
    .select("profile_json, name, office, country_slug")
    .eq("slug", slug);
  if (error) throw error;

  const rows = data || [];
  if (!rows.length) return null;

  const row = rows[0];
  const profile = row.profile_json && typeof row.profile_json === "object" ? { ...row.profile_json } : {};
  if (!profile.slug) profile.slug = slug;
  if (!profile.name && row.name) profile.name = row.name;
  if (!profile.office && row.office) profile.office = row.office;
  if (!profile.countrySlug && row.country_slug) profile.countrySlug = row.country_slug;

  if (!profile.countryName && profile.countrySlug) {
    const { data: country } = await getAdminClient()
      .from("countries")
      .select("name")
      .eq("slug", profile.countrySlug)
      .maybeSingle();
    if (country?.name) profile.countryName = country.name;
  }

  return profile;
}

async function getPoliticiansForCountry(countrySlug) {
  const { data, error } = await getAdminClient()
    .from("politicians")
    .select("slug, name, office, meta, initials, search_terms, profile_json, sort_order")
    .eq("country_slug", countrySlug)
    .order("sort_order");
  if (error) throw error;
  return (data || []).map(rowToDisplay);
}

module.exports = {
  profileToRow,
  rowToIndex,
  rowToDisplay,
  upsertCountryPoliticians,
  listPoliticians,
  searchPoliticians,
  getPolitician,
  getPoliticiansForCountry,
};
