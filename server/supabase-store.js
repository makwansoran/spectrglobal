/**
 * Supabase (Postgres) company store.
 * Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 */
const { buildMeta } = require("./local-store");

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

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
}

function isSupabaseEnabled() {
  return Boolean(process.env.SUPABASE_URL && getSupabaseKey() && loadSupabaseSdk());
}

function getAdminClient() {
  if (!isSupabaseEnabled()) {
    throw new Error(
      "Supabase is not configured (set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY)"
    );
  }
  if (!loadSupabaseSdk()) {
    throw new Error("Install @supabase/supabase-js (run npm install in repo root)");
  }
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function rowToIndex(row) {
  return {
    id: row.slug,
    name: row.name,
    legalName: row.legal_name,
    meta: row.meta,
    initials: row.initials,
    url: `/company/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
  };
}

async function listCompaniesSupabase(limit) {
  let query = getAdminClient()
    .from("companies")
    .select("slug, name, legal_name, meta, initials, search_terms")
    .order("name");
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

function hasSupabaseWrites() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && loadSupabaseSdk());
}

async function searchCompaniesSupabase(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCompaniesSupabase(limit);

  const safe = q.replace(/[%_,.()]/g, "");
  const pattern = `%${safe}%`;
  const client = getAdminClient();
  const select = "slug, name, legal_name, meta, initials, search_terms";

  const { data, error } = await client
    .from("companies")
    .select(select)
    .or(`name.ilike.${pattern},legal_name.ilike.${pattern},slug.ilike.${pattern}`)
    .order("name")
    .limit(limit);

  if (error) throw error;

  const seen = new Set();
  const merged = (data || []).map((row) => {
    seen.add(row.slug);
    return rowToIndex(row);
  });

  if (/^[a-z0-9.-]{1,8}$/i.test(safe) && merged.length < limit) {
    const slug = `us-${safe.replace(/\./g, "").toLowerCase()}`;
    if (!seen.has(slug)) {
      const { data: exact } = await client.from("companies").select(select).eq("slug", slug).maybeSingle();
      if (exact) merged.unshift(rowToIndex(exact));
    }
  }

  return merged.slice(0, limit);
}

async function getCompanySupabase(slug) {
  const { data, error } = await getAdminClient()
    .from("companies")
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

function seedToRow({ slug, profile, mapGeojson, searchTerms }) {
  const meta = buildMeta(profile);
  return {
    slug,
    name: profile.name,
    legal_name: profile.legalName,
    meta,
    initials: profile.logoInitials,
    search_terms: searchTerms,
    profile_json: profile,
    map_geojson: mapGeojson ?? null,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

async function upsertCompanySupabase(seed) {
  if (!seed?.profile || !seed?.slug) return;
  if (!hasSupabaseWrites()) {
    throw new Error("Writes require SUPABASE_SERVICE_ROLE_KEY");
  }
  const { error } = await getAdminClient()
    .from("companies")
    .upsert(seedToRow(seed), { onConflict: "slug" });
  if (error) throw error;
}

async function upsertCompaniesBatchSupabase(seeds, chunkSize = 40) {
  if (!hasSupabaseWrites()) {
    throw new Error("Writes require SUPABASE_SERVICE_ROLE_KEY");
  }
  const rows = seeds.filter((s) => s?.profile && s?.slug).map(seedToRow);
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await getAdminClient().from("companies").upsert(chunk, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  Supabase batch ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
}

async function deleteCompanySupabase(slug) {
  const { error } = await getAdminClient().from("companies").delete().eq("slug", slug);
  if (error) throw error;
}

async function deleteCompaniesNotInSupabase(activeSlugs) {
  const { data, error } = await getAdminClient().from("companies").select("slug");
  if (error) throw error;

  const toDelete = (data || []).map((r) => r.slug).filter((slug) => !activeSlugs.includes(slug));
  if (!toDelete.length) return;

  const { error: delError } = await getAdminClient().from("companies").delete().in("slug", toDelete);
  if (delError) throw delError;

  for (const slug of toDelete) {
    console.log(`  Removed from Supabase: ${slug}`);
  }
}

module.exports = {
  isSupabaseEnabled,
  listCompaniesSupabase,
  searchCompaniesSupabase,
  getCompanySupabase,
  upsertCompanySupabase,
  upsertCompaniesBatchSupabase,
  deleteCompanySupabase,
  deleteCompaniesNotInSupabase,
};
