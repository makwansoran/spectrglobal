/**
 * Supabase (Postgres) company store — reads via PostgREST fetch (reliable on Vercel).
 */
const { buildMeta } = require("./local-store");
const { normalizeTicker, queryLooksLikeTicker } = require("./search-rank");
const { PREFERRED_SLUG_BY_TICKER } = require("./company-canonical");
const { restGet } = require("./supabase-rest");

const {
  getAdminClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");

const SEARCH_SELECT = "slug,name,legal_name,meta,initials,search_terms,profile_json";

function rowToIndex(row) {
  const slug = row.slug || "";
  let ticker = null;
  if (slug.startsWith("us-")) ticker = slug.slice(3).toUpperCase();
  else {
    const m = slug.match(/-([a-z0-9]{1,6})$/i);
    if (m) ticker = m[1].toUpperCase();
  }
  const profile = row.profile_json || null;
  const fromProfile = profile?.stock?.ticker;
  if (fromProfile) ticker = normalizeTicker(fromProfile);

  return {
    id: slug,
    slug,
    kind: "company",
    name: row.name,
    legalName: row.legal_name,
    meta: row.meta,
    initials: row.initials,
    url: `/company/${slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    ticker,
    profile_json: profile,
  };
}

async function listCompaniesSupabase(limit) {
  const params = {
    select: SEARCH_SELECT,
    order: "name.asc",
  };
  if (limit) params.limit = String(limit);
  const data = await restGet("companies", params);
  return (data || []).map(rowToIndex);
}

/** PostgREST ilike pattern (% = SQL wildcard; also supported as * in some versions). */
function ilikePattern(term) {
  const t = String(term || "")
    .trim()
    .replace(/[%_\\]/g, "")
    .slice(0, 48);
  if (!t) return null;
  return `%${t}%`;
}

async function searchCompaniesSupabase(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCompaniesSupabase(limit);

  const seen = new Set();
  const merged = [];

  const addRows = (rows) => {
    for (const row of rows || []) {
      if (!row?.slug || seen.has(row.slug)) continue;
      seen.add(row.slug);
      merged.push(rowToIndex(row));
    }
  };

  const pattern = ilikePattern(q);
  if (pattern) {
    try {
      const data = await restGet("companies", {
        select: SEARCH_SELECT,
        or: `(name.ilike.${pattern},legal_name.ilike.${pattern},slug.ilike.${pattern},meta.ilike.${pattern})`,
        order: "name.asc",
        limit: String(limit * 2),
      });
      addRows(data);
    } catch (err) {
      console.warn("[search] ilike:", err.message);
    }
  }

  const termSafe = q.replace(/[^\w\s-]/g, "").trim();
  if (termSafe && merged.length < limit) {
    try {
      const termRows = await restGet("companies", {
        select: SEARCH_SELECT,
        search_terms: `cs.${JSON.stringify([termSafe])}`,
        order: "name.asc",
        limit: String(limit * 2),
      });
      addRows(termRows);
    } catch (err) {
      console.warn("[search] search_terms:", err.message);
    }
  }

  const qTicker = queryLooksLikeTicker(q) ? normalizeTicker(q) : "";
  if (qTicker) {
    const preferred = PREFERRED_SLUG_BY_TICKER[qTicker];
    for (const slug of [preferred, `us-${qTicker.toLowerCase()}`].filter(Boolean)) {
      if (!slug || seen.has(slug)) continue;
      try {
        const rows = await restGet("companies", {
          select: SEARCH_SELECT,
          slug: `eq.${slug}`,
          limit: "1",
        });
        if (rows?.[0]) {
          seen.add(slug);
          merged.unshift(rowToIndex(rows[0]));
        }
      } catch {
        /* optional */
      }
    }
  }

  const SEARCH_ALIASES = {
    statoil: "equinor",
    "statoil asa": "equinor",
    "berkshire hathaway": "berkshire",
  };
  const alias = SEARCH_ALIASES[q] || SEARCH_ALIASES[termSafe];
  if (alias && !seen.has(alias) && merged.length < limit) {
    try {
      const rows = await restGet("companies", {
        select: SEARCH_SELECT,
        slug: `eq.${alias}`,
        limit: "1",
      });
      if (rows?.[0]) addRows(rows);
    } catch {
      /* optional */
    }
  }

  return merged.slice(0, limit);
}

async function getCompanySupabase(slug) {
  const rows = await restGet("companies", {
    select: "profile_json,map_geojson",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const data = rows?.[0];
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
