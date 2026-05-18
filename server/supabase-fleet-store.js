/**
 * Supabase vessels + planes tables (fleet / aviation data).
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
  if (!isSupabaseEnabled()) throw new Error("Supabase is not configured");
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function vesselToRow(seed) {
  const p = seed.profile || seed;
  return {
    slug: seed.slug || p.id,
    name: p.name || seed.name,
    company_slug: seed.companySlug || p.companySlug || null,
    vessel_type: p.vesselType || p.type || "vessel",
    meta: seed.meta || p.meta || "",
    initials: seed.initials || p.initials || (p.name || "V").slice(0, 2).toUpperCase(),
    search_terms: seed.searchTerms || p.searchTerms || [],
    profile_json: p,
    updated_at: new Date().toISOString(),
  };
}

function planeToRow(seed) {
  const p = seed.profile || seed;
  return {
    slug: seed.slug || p.id,
    name: p.name || seed.name,
    company_slug: seed.companySlug || p.companySlug || null,
    registration: p.registration || p.tailNumber || null,
    meta: seed.meta || p.meta || "",
    initials: seed.initials || p.initials || (p.name || "P").slice(0, 2).toUpperCase(),
    search_terms: seed.searchTerms || p.searchTerms || [],
    profile_json: p,
    updated_at: new Date().toISOString(),
  };
}

async function upsertVesselsBatch(seeds) {
  const rows = seeds.map(vesselToRow);
  const { error } = await getAdminClient().from("vessels").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return rows.length;
}

async function upsertPlanesBatch(seeds) {
  const rows = seeds.map(planeToRow);
  const { error } = await getAdminClient().from("planes").upsert(rows, { onConflict: "slug" });
  if (error) throw error;
  return rows.length;
}

module.exports = {
  isSupabaseEnabled,
  hasSupabaseWrites,
  upsertVesselsBatch,
  upsertPlanesBatch,
};
