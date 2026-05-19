/**
 * Seed vessels table from data/seed/vessels.json
 * Run: node scripts/seed-vessels.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const fleet = require("../server/supabase-fleet-store");

const SEED = path.join(__dirname, "..", "data", "seed", "vessels.json");
const FLEETS_DIR = path.join(__dirname, "..", "data", "seed", "fleets");

function loadFleetSeeds() {
  const seeds = [];
  if (fs.existsSync(SEED)) {
    seeds.push(...JSON.parse(fs.readFileSync(SEED, "utf8")));
  }
  if (fs.existsSync(FLEETS_DIR)) {
    for (const name of fs.readdirSync(FLEETS_DIR)) {
      if (!name.endsWith(".json")) continue;
      seeds.push(...JSON.parse(fs.readFileSync(path.join(FLEETS_DIR, name), "utf8")));
    }
  }
  return seeds;
}

async function main() {
  if (!fleet.hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/schema.sql first (vessels table).");
    process.exit(1);
  }

  const seeds = loadFleetSeeds();
  const n = await fleet.upsertVesselsBatch(seeds);
  console.log(`Upserted ${n} vessels → Supabase Table Editor → vessels`);
  console.log("Edit data/seed/vessels.json or data/seed/fleets/*.json and re-run to add more.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
