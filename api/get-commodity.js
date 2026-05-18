require("../scripts/load-env").loadEnv();
const commoditiesStore = require("../server/commodities-store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    const slug = String(req.query?.slug || "").trim();
    if (!slug) {
      res.status(400).json({ error: "Missing slug" });
      return;
    }
    const data = await commoditiesStore.getCommodity(slug);
    if (!data?.profile) {
      res.status(404).json({ error: "Commodity not found" });
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load commodity" });
  }
};
