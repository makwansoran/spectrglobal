/**
 * Seed all Supabase catalog tables from data/seed/*.json
 * Run after applying supabase/schema.sql
 */
require("./load-env").loadEnv();

const { spawnSync } = require("child_process");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const node = process.execPath;

function run(scriptArgs, label) {
  console.log(`\n── ${label} ──`);
  const parts = Array.isArray(scriptArgs) ? scriptArgs : [scriptArgs];
  const args = parts.map((a) => (a.includes("/") || a.includes("\\") ? a : path.join(__dirname, a)));
  const r = spawnSync(node, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) {
    process.exit(r.status || 1);
  }
}

async function main() {
  run("seed-commodities.js", "Commodities");
  run("seed-people.js", "Company people");
  run("seed-vessels.js", "Vessels");
  run("seed-planes.js", "Planes");
  run(["seed-catalog.js", "banks"], "Banks");
  run(["seed-catalog.js", "investment_banks"], "Investment banks");
  run(["seed-catalog.js", "venture_capital"], "Venture capital");
  run("seed-countries.js", "Countries");
  run("seed-politicians.js", "Politicians");
  console.log("\nDone. Check: npm run db:status");
}

main();
