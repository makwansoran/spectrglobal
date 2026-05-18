/**
 * GET /api/status — which data sources are configured (for debugging deploys).
 */
require("../scripts/load-env").loadEnv();
const { isSupabaseEnabled } = require("../server/supabase-client");
const { storageMode } = require("../server/store");

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    storage: storageMode(),
    supabase: isSupabaseEnabled(),
    vercel: Boolean(process.env.VERCEL),
    hint: "All runtime data is read from Supabase. Run supabase/schema.sql once, then npm run db:seed-all.",
  });
};
