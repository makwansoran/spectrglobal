require("../../scripts/load-env").loadEnv();
const { listCompanies, storageMode } = require("../../server/store");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.status(200).json(await listCompanies());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load companies" });
  }
};
