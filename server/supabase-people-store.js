/**
 * Supabase company_people — single table for executives / board per company.
 */
const {
  personInitials,
  buildPersonMeta,
  buildPersonSearchTerms,
} = require("./person-utils");

const { getAdminClient, isSupabaseEnabled } = require("./supabase-client");

function profileToRow(companySlug, profile, { title = "", localId = null, sortOrder = 0 } = {}) {
  const slug = profile.slug;
  return {
    company_slug: companySlug,
    slug,
    name: profile.name,
    title: title || profile.currentTitle || "",
    meta: buildPersonMeta(profile),
    initials: personInitials(profile.name),
    search_terms: buildPersonSearchTerms(profile, companySlug),
    profile_json: profile,
    local_id: localId,
    sort_order: sortOrder,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

function rowToIndex(row) {
  return {
    id: row.slug,
    name: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/person/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
  };
}

function rowToDisplayPerson(row) {
  const p = row.profile_json || {};
  return {
    id: row.local_id || row.slug,
    personSlug: row.slug,
    name: row.name || p.name,
    title: row.title || p.currentTitle || "",
    photoUrl: p.photoUrl,
    bio: p.bio,
  };
}

function mergeProfiles(profiles) {
  if (!profiles.length) return null;
  const base = { ...profiles[0] };
  const affiliations = [...(base.affiliations || [])];
  for (let i = 1; i < profiles.length; i++) {
    for (const a of profiles[i].affiliations || []) {
      if (!affiliations.some((x) => x.companySlug === a.companySlug)) {
        affiliations.push(a);
      }
    }
    if (!base.bio && profiles[i].bio) base.bio = profiles[i].bio;
    if (!base.photoUrl && profiles[i].photoUrl) base.photoUrl = profiles[i].photoUrl;
  }
  base.affiliations = affiliations;
  return base;
}

async function upsertCompanyPeopleSupabase(companySlug, entries) {
  const client = getAdminClient();
  const { error: delError } = await client.from("company_people").delete().eq("company_slug", companySlug);
  if (delError) throw delError;

  if (!entries.length) return;

  const rows = entries.map((e, i) =>
    profileToRow(companySlug, e.profile, {
      title: e.title,
      localId: e.localId,
      sortOrder: i,
    })
  );

  const { error } = await client.from("company_people").insert(rows);
  if (error) throw error;
}

async function listPeopleSupabase() {
  const { data, error } = await getAdminClient()
    .from("company_people")
    .select("slug, name, meta, initials, search_terms")
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

async function getPersonSupabase(slug) {
  const { data, error } = await getAdminClient()
    .from("company_people")
    .select("profile_json")
    .eq("slug", slug);
  if (error) throw error;
  const profiles = (data || []).map((r) => r.profile_json).filter(Boolean);
  return mergeProfiles(profiles);
}

async function getCompanyPeopleForCompanySupabase(companySlug) {
  const { data, error } = await getAdminClient()
    .from("company_people")
    .select(
      "slug, name, title, meta, initials, search_terms, profile_json, local_id, sort_order"
    )
    .eq("company_slug", companySlug)
    .order("sort_order");
  if (error) throw error;
  return data || [];
}

module.exports = {
  isSupabaseEnabled,
  profileToRow,
  rowToIndex,
  rowToDisplayPerson,
  upsertCompanyPeopleSupabase,
  listPeopleSupabase,
  getPersonSupabase,
  getCompanyPeopleForCompanySupabase,
};
