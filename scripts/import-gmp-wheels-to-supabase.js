const fs = require("fs");
const { loadEnv } = require("./load-env");

loadEnv();

const { getAdminClient } = require("../server/supabase-client");

async function main() {
  const rows = JSON.parse(fs.readFileSync("data/gmp-italia-wheels.json", "utf8"));
  const payload = rows.map((row) => ({
    id: row.id,
    name: row.name,
    model: row.model,
    sku: row.sku,
    price: row.price,
    stock: row.stock,
    description: row.description,
    image_url: row.image_url,
    source_image_url: row.source_image_url,
    product_page_url: row.product_page_url,
    article_number: row.article_number,
    ean_code: row.ean_code,
    delivery_time: row.delivery_time,
    features: row.features,
    reviews: row.reviews,
    specifications: row.specifications,
    vehicles: row.vehicles,
    active: row.active !== false,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await getAdminClient()
    .from("gmp_italia_wheels")
    .upsert(payload, { onConflict: "id" })
    .select("id");

  if (error) throw error;
  console.log(`Upserted ${(data || []).length} GMP Italia wheels.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
