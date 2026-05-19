/**
 * Upload politicians from data/politicians/*.json to Supabase.
 * Requires countries seeded first.
 *
 *   npm run db:seed-politicians
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const politiciansStore = require("../server/supabase-politicians-store");
const { hasSupabaseWrites, isSupabaseEnabled } = require("../server/supabase-client");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "data", "politicians");

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/countries-politicians.sql first.");
    process.exit(1);
  }

  if (!fs.existsSync(DIR)) {
    console.error(`Missing ${DIR} — run: npm run db:build-countries`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json"));
  console.log(`Upserting politicians for ${files.length} countries…`);

  let ok = 0;
  let total = 0;

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"));
    const countrySlug = data.countrySlug;
    const politicians = data.politicians || [];
    if (!countrySlug) continue;

    const entries = politicians
      .filter((row) => row.profile?.slug || row.slug)
      .map((row) => ({
        profile: row.profile || row,
        office: row.office || row.title || "",
      }));

    await politiciansStore.upsertCountryPoliticians(countrySlug, entries);
    total += entries.length;
    ok++;
    if (ok % 25 === 0) console.log(`  ${ok}/${files.length}…`);
  }

  console.log(`\nDone. ${total} politicians across ${ok} countries → public.politicians`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
