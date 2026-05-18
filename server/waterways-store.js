/**
 * Maritime straits & canals — Supabase public.maritime_waterways
 */
const fs = require("fs");
const path = require("path");
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites, requireSupabase } = require("./supabase-client");
const { simulateVessels } = require("./maritime-vessel-sim");

const SEED_PATH = path.join(__dirname, "..", "data", "seed", "maritime-waterways.json");

function seedToRow(seed) {
  const line = seed.waterwayLine || [];
  const waterwayGeojson = {
    type: "Feature",
    properties: { name: seed.name, type: seed.waterwayType },
    geometry: {
      type: "LineString",
      coordinates: line.map(([lat, lng]) => [lng, lat]),
    },
  };

  return {
    slug: seed.slug,
    name: seed.name,
    waterway_type: seed.waterwayType,
    region_label: seed.regionLabel || "",
    meta: seed.meta || "",
    initials: seed.initials || seed.name.slice(0, 2).toUpperCase(),
    search_terms: seed.searchTerms || [],
    importance: seed.importance || 3,
    bounds: seed.bounds,
    center: seed.center,
    waterway_geojson: waterwayGeojson,
    profile_json: {
      ...seed.profile,
      waterwayLine: line,
      waterwayType: seed.waterwayType,
      regionLabel: seed.regionLabel,
    },
    updated_at: new Date().toISOString(),
  };
}

function rowToIndex(row) {
  const profile = row.profile_json || {};
  const typeLabel = row.waterway_type === "canal" ? "Canal" : "Strait";
  return {
    id: row.slug,
    kind: "waterway",
    name: row.name,
    legalName: row.name,
    meta: row.meta,
    initials: row.initials,
    url: `/waterway/${row.slug}`,
    terms: Array.isArray(row.search_terms) ? row.search_terms : [],
    subtitle: `${typeLabel} · ${row.region_label || profile.regionLabel || "Maritime"}`,
    waterwayType: row.waterway_type,
    regionLabel: row.region_label,
    importance: row.importance,
    profile_json: row.profile_json,
  };
}

function rowToProfile(row) {
  if (!row) return null;
  const profile = row.profile_json || {};
  return {
    id: row.slug,
    name: row.name,
    waterwayType: row.waterway_type,
    regionLabel: row.region_label,
    meta: row.meta,
    importance: row.importance,
    bounds: row.bounds,
    center: row.center,
    waterwayGeojson: row.waterway_geojson,
    waterwayLine: profile.waterwayLine || [],
    ...profile,
  };
}

function loadSeedFile() {
  if (!fs.existsSync(SEED_PATH)) return [];
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
}

async function listWaterways(limit = 500) {
  requireSupabase();
  let query = getAdminClient()
    .from("maritime_waterways")
    .select(
      "slug, name, waterway_type, region_label, meta, initials, search_terms, importance, bounds, center, waterway_geojson, profile_json"
    )
    .order("name");
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(rowToIndex);
}

async function searchWaterways(query, limit = 25) {
  requireSupabase();
  const q = String(query || "").trim().toLowerCase();
  if (!q) return listWaterways(limit);

  const safe = q.replace(/[%_,.()]/g, "");
  if (!safe) return [];

  const pattern = `%${safe}%`;
  const select =
    "slug, name, waterway_type, region_label, meta, initials, search_terms, importance, bounds, center, waterway_geojson, profile_json";

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
    .from("maritime_waterways")
    .select(select)
    .or(`name.ilike.${pattern},meta.ilike.${pattern},region_label.ilike.${pattern},slug.ilike.${pattern}`)
    .order("name")
    .limit(limit);
  if (byText.error) throw byText.error;
  addRows(byText.data);

  if (merged.length < limit) {
    const byTerms = await client
      .from("maritime_waterways")
      .select(select)
      .contains("search_terms", [safe])
      .order("name")
      .limit(limit);
    if (!byTerms.error) addRows(byTerms.data);
  }

  return merged.slice(0, limit).map(rowToIndex);
}

async function getWaterwayRaw(slug) {
  requireSupabase();
  const { data, error } = await getAdminClient()
    .from("maritime_waterways")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function getWaterway(slug) {
  const row = await getWaterwayRaw(slug);
  if (!row) return null;
  return { profile: rowToProfile(row) };
}

async function getWaterwayVessels(slug, timeMs) {
  const row = await getWaterwayRaw(slug);
  if (!row) return null;
  const profile = rowToProfile(row);
  const vessels = simulateVessels(
    {
      slug: row.slug,
      importance: row.importance,
      waterwayLine: profile.waterwayLine,
    },
    timeMs
  );
  return { vessels, generatedAt: new Date(timeMs || Date.now()).toISOString() };
}

async function upsertWaterwaysBatch(seeds, chunkSize = 50) {
  requireSupabase();
  if (!hasSupabaseWrites()) {
    throw new Error("Writes require SUPABASE_SERVICE_ROLE_KEY");
  }
  const rows = seeds.map(seedToRow);
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const { error } = await getAdminClient().from("maritime_waterways").upsert(chunk, { onConflict: "slug" });
    if (error) throw error;
    console.log(`  maritime_waterways batch ${Math.min(i + chunkSize, rows.length)}/${rows.length}`);
  }
  return rows.length;
}

module.exports = {
  loadSeedFile,
  seedToRow,
  rowToIndex,
  listWaterways,
  searchWaterways,
  getWaterway,
  getWaterwayVessels,
  upsertWaterwaysBatch,
  isSupabaseEnabled,
  hasSupabaseWrites,
};
