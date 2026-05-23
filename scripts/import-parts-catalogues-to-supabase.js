/**
 * Upserts suspension, engine, body and small-parts/cleaning products
 * into public.parts (the generic catalogue table).
 *
 * Run: node scripts/import-parts-catalogues-to-supabase.js
 */
"use strict";

const fs = require("fs");
const { loadEnv } = require("./load-env");

loadEnv();

const { getAdminClient } = require("../server/supabase-client");

const FILES = [
  "data/suspension-parts.json",
  "data/engine-parts.json",
  "data/body-parts.json",
  "data/small-parts-cleaning.json",
];

function asText(v, fallback = "") {
  const s = String(v == null ? "" : v).trim();
  return s || fallback;
}

function asList(v) {
  return Array.isArray(v)
    ? v.map((x) => String(x || "").trim()).filter(Boolean)
    : [];
}

async function main() {
  const rows = FILES.flatMap((f) =>
    JSON.parse(fs.readFileSync(f, "utf8")).map((row) => ({
      id: asText(row.id),
      name: asText(row.name),
      category: asText(row.category, "Other"),
      sku: asText(row.sku) || null,
      price: Math.max(0, Number(row.price) || 0),
      stock: Math.max(0, parseInt(row.stock, 10) || 0),
      description: asText(row.description) || null,
      image_url: asText(row.image_url) || null,
      article_number: asText(row.article_number) || null,
      ean_code: asText(row.ean_code) || null,
      delivery_time: asText(row.delivery_time, "2-5 days"),
      features: asList(row.features),
      reviews: Array.isArray(row.reviews) ? row.reviews : [],
      specifications: Array.isArray(row.specifications) ? row.specifications : [],
      vehicles: Array.isArray(row.vehicles) ? row.vehicles : [],
      active: row.active !== false,
      updated_at: new Date().toISOString(),
    }))
  );

  const { data, error } = await getAdminClient()
    .from("parts")
    .upsert(rows, { onConflict: "id" })
    .select("id");

  if (error) throw error;
  console.log(`Upserted ${(data || []).length} products across 6 categories.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
