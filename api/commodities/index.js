require("../../scripts/load-env").loadEnv();
const commoditiesStore = require("../../server/commodities-store");
const supabaseCommodities = require("../../server/supabase-commodities-store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const q = String(req.query?.q || "").trim();
    const limit = Math.min(parseInt(req.query?.limit || "25", 10) || 25, 50);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Supabase", supabaseCommodities.isSupabaseEnabled() ? "1" : "0");

    const rows = q
      ? await commoditiesStore.searchCommodities(q, limit)
      : commoditiesStore.loadLocalIndex().slice(0, limit);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load commodities" });
  }
};
