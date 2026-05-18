/**
 * Seed commodities into Supabase + build local search index.
 * Run: node scripts/build-commodities-seed.js && node scripts/seed-commodities.js
 */
require("./load-env").loadEnv();

const { spawnSync } = require("child_process");
const path = require("path");
const commoditiesStore = require("../server/commodities-store");
const { isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");

const ROOT = path.resolve(__dirname, "..");

function ensureSeedFile() {
  const seeds = commoditiesStore.loadSeedFile();
  if (seeds.length) return seeds;
  console.log("Building commodities seed…");
  spawnSync(process.execPath, [path.join(__dirname, "build-commodities-seed.js")], {
    stdio: "inherit",
    cwd: ROOT,
  });
  return commoditiesStore.loadSeedFile();
}

async function main() {
  const seeds = ensureSeedFile();
  if (!seeds.length) {
    console.error("No commodities in data/seed/commodities.json");
    process.exit(1);
  }

  const count = commoditiesStore.buildSearchIndexFile();
  console.log(`Local search index: ${count} commodities`);

  if (hasSupabaseWrites()) {
    console.log(`Uploading ${seeds.length} commodities to Supabase…`);
    await commoditiesStore.upsertCommoditiesBatch(seeds);
    console.log("Done (Supabase).");
  } else if (isSupabaseEnabled()) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY missing — commodities index built locally only.");
    console.warn("Run SQL from supabase/schema.sql (commodities table), then seed again.");
  } else {
    console.log("Supabase not configured — commodities available via local index only.");
  }

  console.log("\nExamples:");
  console.log("  http://127.0.0.1:3000/commodity/gold");
  console.log("  http://127.0.0.1:3000/commodity/wti-crude-oil");
  console.log('  Search: "gc", "wti", "coffee"');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
