/**
 * Generic Supabase table access for profile_json entities (commodities, banks, etc.).
 */
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites, requireSupabase } = require("./supabase-client");

function createCatalogStore(tableName, options) {
  const { kind, urlPrefix, hasCategory = false } = options;

  function rowToIndex(row) {
    const profile = row.profile_json || {};
    return {
      id: row.slug,
      kind,
      name: row.name,
      legalName: row.name,
      meta: row.meta,
      initials: row.initials,
      url: `${urlPrefix}/${row.slug}`,
      terms: Array.isArray(row.search_terms) ? row.search_terms : [],
      ticker: profile.symbol || null,
      category: hasCategory ? row.category || profile.category : undefined,
      subtitle: profile.symbol || profile.exchange || row.meta || null,
      profile_json: row.profile_json,
    };
  }

  function seedToRow(seed) {
    const p = seed.profile || seed;
    const row = {
      slug: seed.slug || p.id,
      name: p.name || seed.name,
      meta: seed.meta || p.meta || "",
      initials: seed.initials || p.logoInitials || (p.name || "?").slice(0, 2).toUpperCase(),
      search_terms: seed.searchTerms || p.searchTerms || [],
      profile_json: p,
      updated_at: p.lastUpdated || new Date().toISOString(),
    };
    if (hasCategory) {
      row.category = seed.category || p.category || "general";
    }
    return row;
  }

  async function list(limit = 500) {
    requireSupabase();
    let query = getAdminClient()
      .from(tableName)
      .select(hasCategory ? "slug, name, category, meta, initials, search_terms, profile_json" : "slug, name, meta, initials, search_terms, profile_json")
      .order("name");
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(rowToIndex);
  }

  async function search(query, limit = 25) {
    requireSupabase();
    const q = String(query || "").trim().toLowerCase();
    if (!q) return list(limit);

    const safe = q.replace(/[%_,.()]/g, "");
    if (!safe) return [];

    const pattern = `%${safe}%`;
    const select = hasCategory
      ? "slug, name, category, meta, initials, search_terms, profile_json"
      : "slug, name, meta, initials, search_terms, profile_json";

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
      .from(tableName)
      .select(select)
      .or(`name.ilike.${pattern},meta.ilike.${pattern},slug.ilike.${pattern}`)
      .order("name")
      .limit(limit);
    if (byText.error) throw byText.error;
    addRows(byText.data);

    if (merged.length < limit) {
      const byTerms = await client
        .from(tableName)
        .select(select)
        .contains("search_terms", [safe])
        .order("name")
        .limit(limit);
      if (!byTerms.error) addRows(byTerms.data);
    }

    return merged.slice(0, limit).map(rowToIndex);
  }

  async function get(slug) {
    requireSupabase();
    const { data, error } = await getAdminClient()
      .from(tableName)
      .select("profile_json")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return { profile: data.profile_json };
  }

  async function upsertBatch(seeds, chunkSize = 50) {
    requireSupabase();
    if (!hasSupabaseWrites()) {
      throw new Error("Writes require SUPABASE_SERVICE_ROLE_KEY");
    }
    const rows = seeds.map(seedToRow);
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const { error } = await getAdminClient().from(tableName).upsert(chunk, { onConflict: "slug" });
      if (error) throw error;
      console.log(`  ${tableName} batch ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
    }
    return rows.length;
  }

  return {
    tableName,
    rowToIndex,
    seedToRow,
    list,
    search,
    get,
    upsertBatch,
  };
}

module.exports = {
  createCatalogStore,
  isSupabaseEnabled,
  hasSupabaseWrites,
};
