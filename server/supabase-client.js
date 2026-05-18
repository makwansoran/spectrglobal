/**
 * Shared Supabase admin client for all Spectr tables.
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;

function getSupabaseUrl() {
  const url = String(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  )
    .trim()
    .replace(/\/$/, "");

  if (!url) return "";

  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error("SUPABASE_URL is not a valid URL");
  }

  if (!host.endsWith(".supabase.co")) {
    throw new Error(
      `SUPABASE_URL must be https://YOUR_PROJECT.supabase.co (got host "${host}"). Update Vercel env vars.`
    );
  }

  return url;
}

function getSupabaseKey() {
  return String(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
  ).trim();
}

function isSupabaseEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

function hasSupabaseWrites() {
  return Boolean(getSupabaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function requireSupabase() {
  if (!isSupabaseEnabled()) {
    throw new Error(
      "Supabase is required. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in Vercel."
    );
  }
}

function getAdminClient() {
  requireSupabase();
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

module.exports = {
  getAdminClient,
  getSupabaseUrl,
  getSupabaseKey,
  isSupabaseEnabled,
  hasSupabaseWrites,
  requireSupabase,
};
