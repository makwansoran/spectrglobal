/**
 * Supabase people + company_people stores.
 */
const {
  personInitials,
  buildPersonMeta,
  buildPersonSearchTerms,
} = require("./person-utils");

let adminClient;
let createClient;

function loadSupabaseSdk() {
  if (createClient) return true;
  try {
    createClient = require("@supabase/supabase-js").createClient;
    return true;
  } catch {
    return false;
  }
}

function isSupabaseEnabled() {
  return Boolean(
    process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      loadSupabaseSdk()
  );
}

function getAdminClient() {
  if (!isSupabaseEnabled()) {
    throw new Error("Supabase is not configured");
  }
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function personToRow(profile) {
  return {
    slug: profile.slug,
    name: profile.name,
    meta: buildPersonMeta(profile),
    initials: personInitials(profile.name),
    search_terms: buildPersonSearchTerms(profile),
    profile_json: profile,
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

async function upsertPersonSupabase(profile) {
  const { error } = await getAdminClient().from("people").upsert(personToRow(profile), {
    onConflict: "slug",
  });
  if (error) throw error;
}

async function upsertCompanyPeopleLinksSupabase(companySlug, links) {
  const client = getAdminClient();
  const { error: delError } = await client.from("company_people").delete().eq("company_slug", companySlug);
  if (delError) throw delError;

  if (!links.length) return;

  const rows = links.map((l, i) => ({
    company_slug: companySlug,
    person_slug: l.personSlug,
    title: l.title || "",
    local_id: l.localId || null,
    sort_order: i,
  }));

  const { error } = await client.from("company_people").insert(rows);
  if (error) throw error;
}

async function listPeopleSupabase() {
  const { data, error } = await getAdminClient()
    .from("people")
    .select("slug, name, meta, initials, search_terms")
    .order("name");
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function getPersonSupabase(slug) {
  const { data, error } = await getAdminClient()
    .from("people")
    .select("profile_json")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data?.profile_json ?? null;
}

async function getPeopleBySlugsSupabase(slugs) {
  if (!slugs.length) return {};
  const { data, error } = await getAdminClient()
    .from("people")
    .select("slug, profile_json")
    .in("slug", [...new Set(slugs)]);
  if (error) throw error;
  const map = {};
  for (const row of data || []) {
    map[row.slug] = row.profile_json;
  }
  return map;
}

async function getCompanyPeopleRefsSupabase(companySlug) {
  const { data, error } = await getAdminClient()
    .from("company_people")
    .select("person_slug, title, local_id, sort_order")
    .eq("company_slug", companySlug)
    .order("sort_order");
  if (error) throw error;
  return (data || []).map((r) => ({
    personSlug: r.person_slug,
    title: r.title,
    id: r.local_id || r.person_slug,
    sortOrder: r.sort_order,
  }));
}

module.exports = {
  isSupabaseEnabled,
  upsertPersonSupabase,
  upsertCompanyPeopleLinksSupabase,
  listPeopleSupabase,
  getPersonSupabase,
  getPeopleBySlugsSupabase,
  getCompanyPeopleRefsSupabase,
};
