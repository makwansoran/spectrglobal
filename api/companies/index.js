require("../../scripts/load-env").loadEnv();
const { listCompanies, searchCompanies, storageMode } = require("../../server/store");
const finnhub = require("../../server/finnhub");
const supabase = require("../../server/supabase-store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const q = String(req.query?.q || "").trim();
    const limit = Math.min(parseInt(req.query?.limit || "25", 10) || 25, 50);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.setHeader("X-Spectr-Supabase", supabase.isSupabaseEnabled() ? "1" : "0");
    res.setHeader("X-Spectr-Finnhub", finnhub.isEnabled() ? "1" : "0");
    const rows = q ? await searchCompanies(q, limit) : await listCompanies({ limit: 500 });
    if (!rows.length && process.env.VERCEL && !supabase.isSupabaseEnabled() && !finnhub.isEnabled()) {
      res.status(503).json({
        error: "Search not configured",
        hint: "Add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (US database) and/or FINNHUB_API_KEY (live US search) in Vercel → Environment Variables, then redeploy.",
        storage: storageMode(),
      });
      return;
    }
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load companies" });
  }
};
