require("../scripts/load-env").loadEnv();
const { getCompanyNews } = require("../server/company-news");
const { isSupabaseEnabled } = require("../server/supabase-client");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (!isSupabaseEnabled()) {
      res.status(503).json({
        error: "Supabase is not configured",
        hint: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
      });
      return;
    }

    const slug = String(req.query?.slug || "").trim();
    if (!slug) {
      res.status(400).json({ error: "Missing slug" });
      return;
    }

    const data = await getCompanyNews(slug);
    if (!data) {
      res.status(404).json({ error: "Company not found" });
      return;
    }

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(data);
  } catch (err) {
    console.error("get-company-news", err);
    res.status(500).json({ error: "Failed to load company news" });
  }
};
