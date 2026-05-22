const fs = require("fs");
const { loadEnv } = require("./load-env");

loadEnv();

const { getAdminClient } = require("../server/supabase-client");

async function main() {
  const rows = JSON.parse(fs.readFileSync("data/ferodo-products.json", "utf8"));
  const payload = rows.map((row) => ({
    id: row.id,
    name: row.name,
    product_name: row.product_name,
    product_type: row.product_type,
    product_family: row.product_family,
    application: row.application,
    sku: row.sku,
    article_number: row.article_number,
    ean_code: row.ean_code,
    price: row.price,
    stock: row.stock,
    delivery_time: row.delivery_time,
    description: row.description,
    image_url: row.image_url,
    source_image_url: row.source_image_url,
    product_page_url: row.product_page_url,
    features: row.features,
    reviews: row.reviews,
    specifications: row.specifications,
    vehicles: row.vehicles,
    active: row.active !== false,
    updated_at: new Date().toISOString(),
  }));

  const { data, error } = await getAdminClient()
    .from("ferodo_products")
    .upsert(payload, { onConflict: "id" })
    .select("id");

  if (error) throw error;
  console.log(`Upserted ${(data || []).length} Ferodo products.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
