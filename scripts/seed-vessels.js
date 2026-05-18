/**
 * Seed vessels table from data/seed/vessels.json
 * Run: node scripts/seed-vessels.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const fleet = require("../server/supabase-fleet-store");

const SEED = path.join(__dirname, "..", "data", "seed", "vessels.json");

async function main() {
  if (!fleet.hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/schema.sql first (vessels table).");
    process.exit(1);
  }

  const seeds = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const n = await fleet.upsertVesselsBatch(seeds);
  console.log(`Upserted ${n} vessels → Supabase Table Editor → vessels`);
  console.log("Edit data/seed/vessels.json and re-run to add more.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
