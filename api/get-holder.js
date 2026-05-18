/**
 * GET /api/get-holder?slug=vanguard-group
 */
require("../scripts/load-env").loadEnv();
const { getInstitutionBySlug, ORG_TYPE_LABELS } = require("../server/institutions");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = String(req.query.slug || "").trim();
  if (!slug) {
    res.status(400).json({ error: "Missing holder slug" });
    return;
  }

  const inst = getInstitutionBySlug(slug);
  if (!inst) {
    res.status(404).json({ error: "Institution not found", slug });
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json({
    profile: {
      ...inst,
      orgTypeLabel: ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other,
    },
  });
};
