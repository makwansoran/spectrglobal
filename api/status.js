/**
 * GET /api/status — which data sources are configured (for debugging deploys).
 */
require("../scripts/load-env").loadEnv();
const { isSupabaseEnabled, getSupabaseUrl } = require("../server/supabase-client");
const { storageMode } = require("../server/store");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  let supabaseHost = null;
  try {
    const url = getSupabaseUrl();
    supabaseHost = url ? new URL(url).hostname : null;
  } catch (err) {
    supabaseHost = err.message;
  }

  res.status(200).json({
    storage: storageMode(),
    supabase: isSupabaseEnabled(),
    supabaseHost,
    vercel: Boolean(process.env.VERCEL),
    hint: "Company search reads public.companies via Supabase REST. SUPABASE_URL must end with .supabase.co.",
  });
};
