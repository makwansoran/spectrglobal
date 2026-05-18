/**
 * GET /api/get-company-market?slug=equinor
 * Rewrite: /api/companies/:slug/market
 */
require("../scripts/load-env").loadEnv();
const { getCompanyRaw } = require("../server/store");
const finnhub = require("../server/finnhub");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = String(req.query.slug || "").trim();
  if (!slug) {
    res.status(400).json({ error: "Missing company slug" });
    return;
  }

  if (!finnhub.isEnabled()) {
    res.status(503).json({ error: "Finnhub is not configured (set FINNHUB_API_KEY in .env)" });
    return;
  }

  try {
    const raw = await getCompanyRaw(slug);
    if (!raw?.profile) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    const market = await finnhub.fetchCompanyMarket(raw.profile);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.status(200).json(market);
  } catch (err) {
    console.error("get-company-market", slug, err);
    res.status(500).json({ error: "Failed to load market data" });
  }
};
