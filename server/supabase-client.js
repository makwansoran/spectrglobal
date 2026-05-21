/**
 * Supabase client for Spectr Parts customer sign-ins (service role writes).
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;
let readClient;

function getSupabaseUrl() {
  const candidates = [
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.VITE_SUPABASE_URL,
  ]
    .map((value) => String(value || "").trim().replace(/\/$/, ""))
    .filter(Boolean);
  return candidates[0] || "";
}

function getSupabaseKey() {
  return String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
}

function getSupabaseAnonKey() {
  return String(
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  ).trim();
}

function getSupabaseReadKey() {
  return getSupabaseKey() || getSupabaseAnonKey();
}

function isSupabaseReadable() {
  return Boolean(getSupabaseUrl() && getSupabaseReadKey());
}

function hasSupabaseWrites() {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

function isSupabaseEnabled() {
  return isSupabaseReadable();
}

function getAdminClient() {
  if (!hasSupabaseWrites()) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!adminClient) {
    adminClient = createClient(getSupabaseUrl(), getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function getReadClient() {
  if (!isSupabaseReadable()) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  if (!readClient) {
    readClient = createClient(getSupabaseUrl(), getSupabaseReadKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return readClient;
}

module.exports = {
  getAdminClient,
  getReadClient,
  getSupabaseUrl,
  getSupabaseAnonKey,
  isSupabaseEnabled,
  isSupabaseReadable,
  hasSupabaseWrites,
};
