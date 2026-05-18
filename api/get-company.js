/**
 * GET /api/get-company?slug=equinor
 * Also reached via rewrite: /api/companies/:slug → /api/get-company?slug=:slug
 */
require("../scripts/load-env").loadEnv();
const { getCompany, storageMode } = require("../server/store");

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

  try {
    const company = await getCompany(slug);
    if (!company?.profile) {
      res.status(404).json({ error: "Company not found", slug, storage: storageMode() });
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.status(200).json(company);
  } catch (err) {
    console.error("get-company", slug, err);
    res.status(500).json({ error: "Failed to load company" });
  }
};
