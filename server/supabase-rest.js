/**
 * Minimal PostgREST client for Vercel serverless (avoids fragile .or() filter strings).
 */
function getConfig() {
  const baseUrl = String(process.env.SUPABASE_URL || "")
    .trim()
    .replace(/\/$/, "");
  const key = String(
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""
  ).trim();
  if (!baseUrl || !key) {
    throw new Error("Supabase URL and API key are required");
  }
  return { baseUrl, key };
}

function restHeaders(key, extra = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Accept: "application/json",
  ...extra,
  };
}

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!res.ok) {
    const preview = text.trim().slice(0, 160);
    if (preview.startsWith("<!DOCTYPE") || preview.startsWith("<html")) {
      throw new Error(
        "Supabase returned HTML instead of JSON — check SUPABASE_URL and API keys on Vercel"
      );
    }
    throw new Error(preview || `Supabase request failed (${res.status})`);
  }
  if (!text) return [];
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Supabase returned invalid JSON");
  }
}

async function restGet(table, params) {
  const { baseUrl, key } = getConfig();
  const url = new URL(`${baseUrl}/rest/v1/${table}`);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: restHeaders(key),
  });
  return parseJsonResponse(res);
}

module.exports = {
  getConfig,
  restGet,
  parseJsonResponse,
};
