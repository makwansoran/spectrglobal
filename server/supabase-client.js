/**
 * Shared Supabase admin client for all Spectr tables.
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

function requireSupabase() {
  if (!isSupabaseEnabled()) {
    throw new Error(
      "Supabase is required. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) in .env"
    );
  }
}

function getAdminClient() {
  requireSupabase();
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

module.exports = {
  getAdminClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
  requireSupabase,
};
