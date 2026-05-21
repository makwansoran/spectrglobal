/**
 * Supabase client for Spectr Parts customer sign-ins (service role writes).
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;

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

function isSupabaseEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseKey());
}

function hasSupabaseWrites() {
  return isSupabaseEnabled();
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

module.exports = {
  getAdminClient,
  getSupabaseUrl,
  isSupabaseEnabled,
  hasSupabaseWrites,
};
