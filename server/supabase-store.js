/**
 * Supabase (Postgres) company store.
 * Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 */
const { buildMeta } = require("./local-store");
const { PREFERRED_SLUG_BY_TICKER, normalizeTicker, queryLooksLikeTicker } = require("./search-rank");
const { restGet } = require("./supabase-rest");

const {
  getAdminClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");

const SEARCH_SELECT = "slug,name,legal_name,meta,initials,search_terms";

function rowToIndex(row) {
  const slug = row.slug || "";
  let ticker = null;
  if (slug.startsWith("us-")) ticker = slug.slice(3).toUpperCase();
  else {
    const m = slug.match(/-([a-z0-9]{1,6})$/i);
    if (m) ticker = m[1].toUpperCase();
  }
  return {
    id: slug,
    kind: "company",
    name: row.name,
    legalName: row.legal_name,
    meta: row.meta,
    initials: row.initials,
    url: `/company/${slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    ticker,
  };
}

async function listCompaniesSupabase(limit) {
  let query = getAdminClient()
    .from("companies")
    .select(SEARCH_SELECT)
    .order("name");
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function searchWithClient(client, safe, limit) {
  const pattern = `%${safe}%`;
  const seen = new Set();
  const merged = [];
  const errors = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(rowToIndex(row));
    }
  };

  for (const column of ["name", "legal_name", "slug", "meta"]) {
    if (merged.length >= limit) break;
    const { data, error } = await client
      .from("companies")
      .select(SEARCH_SELECT)
      .ilike(column, pattern)
      .order("name")
      .limit(limit);
    if (error) {
      errors.push(`${column}: ${error.message}`);
      continue;
    }
    addRows(data);
  }

  if (merged.length < limit) {
    const { data, error } = await client
      .from("companies")
      .select(SEARCH_SELECT)
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (error) errors.push(`terms: ${error.message}`);
    else addRows(data);
  }

  return { merged, seen, errors };
}

async function searchWithRest(safe, limit) {
  const star = `*${safe}*`;
  const errors = [];
  let data = [];

  try {
    data = await restGet("companies", {
      select: SEARCH_SELECT,
      or: `(name.ilike.${star},legal_name.ilike.${star},slug.ilike.${star},meta.ilike.${star})`,
      order: "name.asc",
      limit: String(limit),
    });
  } catch (err) {
    errors.push(`rest: ${err.message}`);
  }

  return { merged: (data || []).map(rowToIndex), seen: new Set((data || []).map((r) => r.slug)), errors };
}

async function searchCompaniesSupabase(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCompaniesSupabase(limit);

  const safe = q.replace(/[%_,.()\\]/g, "");
  if (!safe) return [];

  const client = getAdminClient();
  let { merged, seen, errors } = await searchWithClient(client, safe, limit);

  if (!merged.length) {
    const rest = await searchWithRest(safe, limit);
    merged = rest.merged;
    seen = rest.seen;
    errors = errors.concat(rest.errors);
  }

  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  if (qTicker) {
    const preferred = PREFERRED_SLUG_BY_TICKER[qTicker];
    if (preferred && !seen.has(preferred)) {
      const { data, error } = await client
        .from("companies")
        .select(SEARCH_SELECT)
        .eq("slug", preferred)
        .maybeSingle();
      if (!error && data) {
        seen.add(preferred);
        merged.unshift(rowToIndex(data));
      }
    }

    const slug = `us-${qTicker.toLowerCase()}`;
    if (!seen.has(slug)) {
      const { data, error } = await client
        .from("companies")
        .select(SEARCH_SELECT)
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) {
        seen.add(slug);
        merged.unshift(rowToIndex(data));
      }
    }
  }

  if (!merged.length) {
    const hint = errors.length ? errors.join("; ") : "no rows matched";
    throw new Error(`Company search failed (${hint})`);
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
  hasSupabaseWrites,
  listCompaniesSupabase,
  searchCompaniesSupabase,
  getCompanySupabase,
  upsertCompanySupabase,
  upsertCompaniesBatchSupabase,
  deleteCompanySupabase,
  deleteCompaniesNotInSupabase,
};
