/**
 * Seed any catalog table from data/seed/<name>.json
 * Usage: node scripts/seed-catalog.js commodities
 *        node scripts/seed-catalog.js banks
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { createCatalogStore } = require("../server/supabase-catalog-store");
const { hasSupabaseWrites } = require("../server/supabase-client");
const commoditiesStore = require("../server/commodities-store");

const TABLE_CONFIG = {
  commodities: { store: commoditiesStore, seedFile: "commodities.json", hasCategory: true },
  banks: {
    store: createCatalogStore("banks", { kind: "bank", urlPrefix: "/bank" }),
    seedFile: "banks.json",
  },
  investment_banks: {
    store: createCatalogStore("investment_banks", {
      kind: "investment_bank",
      urlPrefix: "/investment-bank",
    }),
    seedFile: "investment_banks.json",
  },
  venture_capital: {
    store: createCatalogStore("venture_capital", {
      kind: "venture_capital",
      urlPrefix: "/venture-capital",
    }),
    seedFile: "venture_capital.json",
  },
};

async function main() {
  const table = process.argv[2];
  const cfg = TABLE_CONFIG[table];
  if (!cfg) {
    console.error(`Usage: node scripts/seed-catalog.js <${Object.keys(TABLE_CONFIG).join("|")}>`);
    process.exit(1);
  }
  if (!hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Run supabase/schema.sql first.");
    process.exit(1);
  }

  const seedPath = path.join(__dirname, "..", "data", "seed", cfg.seedFile);
  if (!fs.existsSync(seedPath)) {
    fs.writeFileSync(seedPath, "[]\n");
    console.log(`Created empty ${seedPath} — add rows and re-run.`);
    return;
  }

  const seeds = JSON.parse(fs.readFileSync(seedPath, "utf8"));
  if (!seeds.length) {
    console.log(`No rows in ${cfg.seedFile}. Add JSON array entries and re-run.`);
    return;
  }

  const n = await cfg.store.upsertBatch(seeds);
  console.log(`Upserted ${n} rows → public.${table}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
