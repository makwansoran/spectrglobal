const fs = require("fs");
const { loadEnv } = require("./load-env");

loadEnv();

const { getAdminClient } = require("../server/supabase-client");

function asText(value, fallback = "") {
  const text = String(value == null ? "" : value).trim();
  return text || fallback;
}

function asList(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

async function main() {
  const rows = JSON.parse(fs.readFileSync("data/lubrication-filters-products.json", "utf8"));
  const payload = rows.map((row) => ({
    id: asText(row.id),
    name: asText(row.name),
    category: asText(row.category, "Lubrication & Filters"),
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
  }));

  const { data, error } = await getAdminClient()
    .from("parts")
    .upsert(payload, { onConflict: "id" })
    .select("id");

  if (error) throw error;
  console.log(`Upserted ${(data || []).length} lubrication and filter products.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
