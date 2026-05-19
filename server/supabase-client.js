/**
 * Shared Supabase admin client for all Spectr tables.
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;
let anonAuthClient;

function isProjectSupabaseUrl(url) {
  try {
    return new URL(url).hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function getSupabaseUrl() {
  const candidates = [
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.VITE_SUPABASE_URL,
  ]
    .map((value) => String(value || "").trim().replace(/\/$/, ""))
    .filter(Boolean);

  const projectUrl = candidates.find(isProjectSupabaseUrl);
  if (projectUrl) return projectUrl;

  const first = candidates[0];
  if (!first) return "";

  let host = "missing";
  try {
    host = new URL(first).hostname;
  } catch {
    host = "invalid";
  }

  throw new Error(
    `SUPABASE_URL must be https://YOUR_PROJECT.supabase.co (got "${host}"). In Vercel → Settings → Environment Variables, set SUPABASE_URL to your project API URL.`
  );
}

function getSupabaseAnonKey() {
  return String(
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  ).trim();
}

function getSupabaseKey() {
  return String(process.env.SUPABASE_SERVICE_ROLE_KEY || getSupabaseAnonKey() || "").trim();
}

function getSupabaseUrlSafe() {
  try {
    return getSupabaseUrl();
  } catch {
    return "";
  }
}

function isSupabaseEnabled() {
  return Boolean(getSupabaseUrlSafe() && getSupabaseKey());
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

function requireServiceRole() {
  if (!hasSupabaseWrites()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for account registration.");
  }
}

function getAnonAuthClient() {
  const url = getSupabaseUrlSafe();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error("SUPABASE_ANON_KEY is required for sign-in and sessions.");
  }
  if (!anonAuthClient) {
    anonAuthClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anonAuthClient;
}

module.exports = {
  getAdminClient,
  getAnonAuthClient,
  getSupabaseUrl,
  getSupabaseUrlSafe,
  getSupabaseKey,
  getSupabaseAnonKey,
  isSupabaseEnabled,
  hasSupabaseWrites,
  requireSupabase,
  requireServiceRole,
};
