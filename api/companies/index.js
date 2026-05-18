require("../../scripts/load-env").loadEnv();
const { listCompanies, searchUnified, storageMode } = require("../../server/store");
const supabase = require("../../server/supabase-client");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    if (!supabase.isSupabaseEnabled()) {
      res.status(503).json({
        error: "Supabase is not configured",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel → Environment Variables, run supabase/schema.sql, then npm run db:seed-all.",
        storage: storageMode(),
      });
      return;
    }
    const q = String(req.query?.q || "").trim();
    const limit = Math.min(parseInt(req.query?.limit || "25", 10) || 25, 50);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Storage", storageMode());
    const rows = q ? await searchUnified(q, limit) : await listCompanies({ limit });
    res.setHeader("X-Spectr-Source", q ? "supabase:unified" : "supabase:companies");
    res.status(200).json(rows);
  } catch (err) {
    console.error("api/companies", err);
    const message = err?.message || "Failed to load companies";
    res.status(500).json({
      error: "Failed to load companies",
      detail: message.slice(0, 200),
    });
  }
};
