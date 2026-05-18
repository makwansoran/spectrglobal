/**
 * Upsert one company JSON into Supabase + local export.
 * Usage: node scripts/upsert-company.js data/seed/companies/2020-bulkers.json
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { upsertCompany } = require("../server/store");
const supabase = require("../server/supabase-store");

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node scripts/upsert-company.js <path-to-company.json>");
    process.exit(1);
  }

  const seed = JSON.parse(fs.readFileSync(path.resolve(file), "utf8"));
  if (!seed.slug || !seed.profile) {
    throw new Error("JSON must include slug and profile");
  }

  const where = await upsertCompany(seed);
  console.log(`Upserted ${seed.slug} → ${seed.profile.name} (${where})`);
  console.log(`  http://127.0.0.1:3000/company/${seed.slug}`);

  const removeSlug = process.argv[3];
  if (removeSlug && supabase.isSupabaseEnabled()) {
    await supabase.deleteCompanySupabase(removeSlug);
    console.log(`  Removed old slug: ${removeSlug}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
