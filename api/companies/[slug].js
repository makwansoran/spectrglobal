require("../../scripts/load-env").loadEnv();
const { getCompany, storageMode } = require("../../server/store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const slug =
    req.query.slug ||
    (req.url && String(req.url).match(/\/api\/companies\/([^/?]+)/)?.[1]);
  if (!slug) {
    res.status(400).json({ error: "Missing company slug" });
    return;
  }
  try {
    const company = await getCompany(slug);
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.status(200).json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load company" });
  }
};
