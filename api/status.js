/**
 * GET /api/status — which data sources are configured (for debugging deploys).
 */
require("../scripts/load-env").loadEnv();
const supabase = require("../server/supabase-store");
const finnhub = require("../server/finnhub");
const { storageMode } = require("../server/store");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    storage: storageMode(),
    supabase: supabase.isSupabaseEnabled(),
    finnhub: finnhub.isEnabled(),
    vercel: Boolean(process.env.VERCEL),
    hint:
      "US companies: import lives in Supabase (npm run db:import-us). Live search fallback uses FINNHUB_API_KEY. Add both to Vercel env vars.",
  });
};
