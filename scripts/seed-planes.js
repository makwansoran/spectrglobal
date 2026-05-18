/**
 * Seed planes table from data/seed/planes.json
 * Run: node scripts/seed-planes.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const fleet = require("../server/supabase-fleet-store");

const SEED = path.join(__dirname, "..", "data", "seed", "planes.json");

async function main() {
  if (!fleet.hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/schema.sql first (planes table).");
    process.exit(1);
  }

  const seeds = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const n = await fleet.upsertPlanesBatch(seeds);
  console.log(`Upserted ${n} planes → Supabase Table Editor → planes`);
  console.log("Edit data/seed/planes.json and re-run to add more.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
