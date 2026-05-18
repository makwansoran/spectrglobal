/**
 * Seed maritime straits & canals into Supabase.
 * Run: npm run db:seed-waterways
 * SQL: supabase/maritime-waterways.sql (once)
 */
require("./load-env").loadEnv();

const waterwaysStore = require("../server/waterways-store");
const { isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");

async function main() {
  const seeds = waterwaysStore.loadSeedFile();
  if (!seeds.length) {
    console.error("No waterways in data/seed/maritime-waterways.json");
    process.exit(1);
  }

  console.log(`Loaded ${seeds.length} waterways from seed file.`);

  if (hasSupabaseWrites()) {
    console.log("Uploading to Supabase public.maritime_waterways…");
    await waterwaysStore.upsertWaterwaysBatch(seeds);
    console.log("Done.");
  } else if (isSupabaseEnabled()) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY missing — cannot upload.");
    console.warn("Run supabase/maritime-waterways.sql in the SQL editor, then seed again.");
  } else {
    console.log("Supabase not configured — set SUPABASE_URL and keys in .env");
    process.exit(1);
  }

  console.log("\nExamples:");
  console.log("  http://127.0.0.1:3000/waterway/strait-of-hormuz");
  console.log("  http://127.0.0.1:3000/waterway/suez-canal");
  console.log('  Search: "panama canal", "malacca", "bosporus"');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
