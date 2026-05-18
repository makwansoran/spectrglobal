require("../scripts/load-env").loadEnv();
const { getCompanyQuote } = require("../server/company-quote");
const { isSupabaseEnabled } = require("../server/supabase-client");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    if (!isSupabaseEnabled()) {
      res.status(503).json({ error: "Supabase is not configured" });
      return;
    }

    const slug = String(req.query?.slug || "").trim();
    if (!slug) {
      res.status(400).json({ error: "Missing slug" });
      return;
    }

    const data = await getCompanyQuote(slug);
    if (!data?.stock) {
      res.status(404).json({ error: "No quote available" });
      return;
    }

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    res.status(200).json(data);
  } catch (err) {
    console.error("get-company-quote", err);
    res.status(500).json({ error: "Failed to load quote" });
  }
};
