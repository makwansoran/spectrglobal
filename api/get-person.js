/**
 * GET /api/get-person?slug=jensen-huang
 * Rewrite: /api/people/:slug → /api/get-person?slug=:slug
 */
require("../scripts/load-env").loadEnv();
const { getPerson, storageMode } = require("../server/store");
const supabase = require("../server/supabase-client");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = String(req.query.slug || "").trim();
  if (!slug) {
    res.status(400).json({ error: "Missing person slug" });
    return;
  }

  try {
    if (!supabase.isSupabaseEnabled()) {
      res.status(503).json({
        error: "Supabase is not configured",
        storage: storageMode(),
      });
      return;
    }

    const profile = await getPerson(slug);
    if (!profile) {
      res.status(404).json({ error: "Person not found", slug, storage: storageMode() });
      return;
    }

    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("X-Spectr-Storage", storageMode());
    res.setHeader("X-Spectr-Source", "supabase:company_people");
    res.status(200).json({ profile });
  } catch (err) {
    console.error("get-person", slug, err);
    const message = String(err.message || err);
    const missing = /company_people|does not exist/i.test(message);
    res.status(missing ? 503 : 500).json({
      error: "Failed to load person",
      detail: message.slice(0, 200),
      hint: missing ? "Create public.company_people (supabase/schema.sql) and add a row for this slug." : undefined,
    });
  }
};
