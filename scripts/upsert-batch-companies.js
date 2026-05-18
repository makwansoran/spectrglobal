/**
 * Upsert multiple company seeds from data/seed/companies/batch/*.json or inline list.
 * Usage: node scripts/upsert-batch-companies.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { upsertCompany } = require("../server/store");

const BATCH_DIR = path.resolve(__dirname, "../data/seed/companies/batch");

async function main() {
  if (!fs.existsSync(BATCH_DIR)) {
    console.error("Missing batch directory:", BATCH_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  if (!files.length) {
    console.error("No JSON files in", BATCH_DIR);
    process.exit(1);
  }

  let ok = 0;
  for (const file of files) {
    const seed = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, file), "utf8"));
    if (!seed.slug || !seed.profile) {
      console.error("Skip invalid:", file);
      continue;
    }
    const where = await upsertCompany(seed);
    console.log(`✓ ${seed.slug} → ${seed.profile.name} (${where})`);
    ok++;
  }
  console.log(`\nUpserted ${ok}/${files.length} companies.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
