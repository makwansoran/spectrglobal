/**
 * Supabase commodities table access.
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
}

function isSupabaseEnabled() {
  return Boolean(process.env.SUPABASE_URL && getSupabaseKey());
}

function hasSupabaseWrites() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function getAdminClient() {
  if (!isSupabaseEnabled()) {
    throw new Error("Supabase is not configured");
  }
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function rowToIndex(row) {
  const profile = row.profile_json || {};
  return {
    id: row.slug,
    kind: "commodity",
    name: row.name,
    legalName: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/commodity/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    ticker: profile.symbol || null,
    category: row.category,
    subtitle: profile.symbol || profile.exchange || profile.categoryLabel || null,
    profile_json: row.profile_json,
  };
}

async function searchCommoditiesSupabase(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCommoditiesSupabase(limit);

  const safe = q.replace(/[%_,.()]/g, "");
  const pattern = `%${safe}%`;
  const client = getAdminClient();
  const select = "slug, name, category, meta, initials, search_terms, profile_json";

  const seen = new Set();
  const merged = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(rowToIndex(row));
    }
  };

  const byText = await client
    .from("commodities")
    .select(select)
    .or(`name.ilike.${pattern},meta.ilike.${pattern},slug.ilike.${pattern}`)
    .order("name")
    .limit(limit);
  if (byText.error) throw byText.error;
  addRows(byText.data);

  if (merged.length < limit && safe.length >= 1) {
    const byTerms = await client
      .from("commodities")
      .select(select)
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (!byTerms.error) addRows(byTerms.data);
  }

  return merged.slice(0, limit);
}

async function listCommoditiesSupabase(limit = 500) {
  let query = getAdminClient()
    .from("commodities")
    .select("slug, name, category, meta, initials, search_terms, profile_json")
    .order("name");
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function getCommoditySupabase(slug) {
  const { data, error } = await getAdminClient()
    .from("commodities")
    .select("profile_json")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { profile: data.profile_json };
}

async function upsertCommoditySupabase(row) {
  const { error } = await getAdminClient().from("commodities").upsert(row, { onConflict: "slug" });
  if (error) throw error;
}

async function upsertCommoditiesBatchSupabase(rows, chunkSize = 50) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await getAdminClient().from("commodities").upsert(chunk, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  Commodities batch ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
}

module.exports = {
  isSupabaseEnabled,
  hasSupabaseWrites,
  searchCommoditiesSupabase,
  listCommoditiesSupabase,
  getCommoditySupabase,
  upsertCommoditySupabase,
  upsertCommoditiesBatchSupabase,
};
