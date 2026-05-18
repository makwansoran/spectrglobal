/**
 * GET /api/people — search index for people (from company_people).
 */
require("../../scripts/load-env").loadEnv();
const { listPeople, storageMode } = require("../../server/store");
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
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
        storage: storageMode(),
      });
      return;
    }

    const rows = await listPeople();
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.setHeader("X-Spectr-Source", "supabase:company_people");
    res.status(200).json(rows);
  } catch (err) {
    console.error("api/people", err);
    const message = err?.message || "Failed to load people";
    const missing = /company_people|does not exist/i.test(message);
    res.status(missing ? 503 : 500).json({
      error: "Failed to load people",
      detail: message.slice(0, 200),
      hint: missing ? "Run the company_people block in supabase/schema.sql, then insert people rows." : undefined,
    });
  }
};
