/**
 * Upload countries from data/countries/*.json to Supabase.
 *
 *   npm run db:build-countries   # optional — regenerate JSON
 *   npm run db:seed-countries
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const countriesStore = require("../server/supabase-countries-store");
const { hasSupabaseWrites } = require("../server/supabase-client");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "countries");

async function main() {
  if (!hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/countries-politicians.sql first.");
    process.exit(1);
  }

  if (!fs.existsSync(DIR)) {
    console.error(`Missing ${DIR} — run: npm run db:build-countries`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")));

  if (!files.length) {
    console.log("No country JSON files found.");
    return;
  }

  console.log(`Upserting ${files.length} countries…`);
  const n = await countriesStore.upsertCountriesBatch(files);
  console.log(`Done. ${n} rows → public.countries`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
