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

function tickerFromSlug(slug) {
  const s = String(slug || "");
  if (s.startsWith("us-")) return s.slice(3).toUpperCase();
  const m = s.match(/-([a-z0-9]{1,6})$/i);
  return m ? m[1].toUpperCase() : null;
}

function rowToIndex(row) {
  const ticker = tickerFromSlug(row.slug);
  return {
    id: row.slug,
    kind: "company",
    name: row.name,
    legalName: row.legal_name,
    meta: row.meta,
    initials: row.initials,
    url: `/company/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    ticker,
  };
}

async function listCompaniesSupabase(limit) {
  const params = {
    select: "slug,name,legal_name,meta,initials,search_terms",
    order: "name.asc",
  };
  if (limit) params.limit = String(limit);

  const data = await restGet("companies", params);
  return (data || []).map(rowToIndex);
}

async function fetchCompaniesIlike(column, pattern, limit) {
  return restGet("companies", {
    select: SEARCH_SELECT,
    [column]: `ilike.${pattern}`,
    order: "name.asc",
    limit: String(limit),
  });
}

async function searchCompaniesSupabase(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCompaniesSupabase(limit);

  const safe = q.replace(/[%_,.()\\]/g, "");
  if (!safe) return [];

  const pattern = `%${safe}%`;
  const seen = new Set();
  const merged = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(rowToIndex(row));
    }
  };

  for (const column of ["name", "legal_name", "slug", "meta"]) {
    if (merged.length >= limit) break;
    try {
      const data = await fetchCompaniesIlike(column, pattern, limit);
      addRows(data);
    } catch (err) {
      console.warn(`Supabase search ${column}:`, err.message);
    }
  }

  if (merged.length < limit && safe.length >= 2) {
    try {
      const data = await restGet("companies", {
        select: SEARCH_SELECT,
        search_terms: `cs.${JSON.stringify([safe])}`,
        order: "name.asc",
        limit: String(limit),
      });
      addRows(data);
    } catch (err) {
      console.warn("Supabase search terms:", err.message);
    }
  }

  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  if (qTicker) {
    const preferred = PREFERRED_SLUG_BY_TICKER[qTicker];
    if (preferred && !seen.has(preferred)) {
      try {
        const data = await restGet("companies", {
          select: SEARCH_SELECT,
          slug: `eq.${preferred}`,
          limit: "1",
        });
        if (data?.[0]) {
          seen.add(preferred);
          merged.unshift(rowToIndex(data[0]));
        }
      } catch (err) {
        console.warn("Supabase preferred slug:", err.message);
      }
    }

    const slug = `us-${qTicker.toLowerCase()}`;
    if (!seen.has(slug)) {
      try {
        const data = await restGet("companies", {
          select: SEARCH_SELECT,
          slug: `eq.${slug}`,
          limit: "1",
        });
        if (data?.[0]) {
          seen.add(slug);
          merged.unshift(rowToIndex(data[0]));
        }
      } catch (err) {
        console.warn("Supabase ticker slug:", err.message);
      }
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
  hasSupabaseWrites,
  listCompaniesSupabase,
  searchCompaniesSupabase,
  getCompanySupabase,
  upsertCompanySupabase,
  upsertCompaniesBatchSupabase,
  deleteCompanySupabase,
  deleteCompaniesNotInSupabase,
};
