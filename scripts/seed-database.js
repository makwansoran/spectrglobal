/**
 * Seed companies into Supabase (if configured) + local SQLite/JSON.
 * Run: npm run db:seed
 */
const { loadEnv } = require("./load-env");
loadEnv();

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const store = require("../server/store");
const supabase = require("../server/supabase-store");
const {
  upsertCompany,
  syncAfterSeed,
  storageMode,
  DB_PATH,
  EXPORT_DIR,
  isSupabaseEnabled,
} = store;

const ROOT = path.resolve(__dirname, "..");
const profileDir = path.join(ROOT, "profile");
const JSON_SEED_DIR = path.join(ROOT, "data", "seed");

function resolveTsx() {
  const candidates = [
    path.join(profileDir, "node_modules", ".bin", "tsx"),
    path.join(profileDir, "node_modules", ".bin", "tsx.cmd"),
    path.join(ROOT, "node_modules", ".bin", "tsx"),
    path.join(ROOT, "node_modules", ".bin", "tsx.cmd"),
  ];
  for (const bin of candidates) {
    if (fs.existsSync(bin)) return bin;
  }
  return null;
}

function loadJsonSeedsFromDir() {
  if (!fs.existsSync(JSON_SEED_DIR)) return [];
  return fs
    .readdirSync(JSON_SEED_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(JSON_SEED_DIR, f), "utf8"));
      const slug = raw.slug || f.replace(/\.json$/, "");
      return {
        slug,
        profile: raw.profile,
        mapGeojson: raw.mapGeojson ?? null,
        searchTerms: raw.searchTerms || [],
      };
    });
}

function exportSeedsFromProfile() {
  const tsx = resolveTsx();
  if (!tsx) return null;

  const result = spawnSync(tsx, ["scripts/export-seed.mjs"], {
    cwd: profileDir,
    encoding: "utf8",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    throw new Error("Could not export seeds from profile/src/data/registry.ts");
  }

  return JSON.parse(result.stdout.trim());
}

function loadCompanyJsonDir() {
  const dir = path.join(ROOT, "data", "seed", "companies");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")));
}

function loadOsloListedJson() {
  const file = path.join(ROOT, "data", "seed", "oslo-listed.json");
  if (!fs.existsSync(file)) return [];
  const seeds = JSON.parse(fs.readFileSync(file, "utf8"));
  return Array.isArray(seeds) ? seeds : [];
}

function collectSeeds() {
  const bySlug = new Map();

  const fromProfile = exportSeedsFromProfile();
  if (fromProfile && fromProfile.length) {
    for (const seed of fromProfile) bySlug.set(seed.slug, seed);
  }

  for (const seed of loadJsonSeedsFromDir()) {
    bySlug.set(seed.slug, seed);
  }

  for (const seed of loadOsloListedJson()) {
    if (!seed?.profile) continue;
    if (bySlug.has("equinor") && /^equinor/i.test(seed.profile.name || "")) continue;
    bySlug.set(seed.slug, seed);
  }

  for (const seed of loadCompanyJsonDir()) {
    if (seed?.profile && seed?.slug) bySlug.set(seed.slug, seed);
  }

  const all = [...bySlug.values()];
  if (!all.length) {
    throw new Error(
      "No company seeds found. Run: node scripts/build-oslo-listed.js && npm run db:seed"
    );
  }
  return all;
}

async function main() {
  const seeds = collectSeeds();
  const slugs = [];

  const mode = storageMode();
  console.log(`Storage: ${mode}${isSupabaseEnabled() ? " (Supabase + local backup)" : ""}`);
  if (process.env.SUPABASE_URL && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("\n  .env has SUPABASE_URL but SUPABASE_SERVICE_ROLE_KEY is empty.");
    console.warn("  Save your service_role key, then run db:seed again.\n");
  }
  console.log(`Seeding ${seeds.length} companies...\n`);

  const valid = seeds.filter((s) => s?.profile && s?.slug);
  const priority = valid.filter((s) => s.slug === "equinor");
  const bulk = valid.filter((s) => s.slug !== "equinor");

  for (const seed of priority) {
    const where = await upsertCompany(seed);
    slugs.push(seed.slug);
    console.log(`  + ${seed.slug} → ${seed.profile.name} (${where})`);
  }

  if (isSupabaseEnabled() && bulk.length) {
    console.log(`  Uploading ${bulk.length} companies to Supabase...`);
    await supabase.upsertCompaniesBatchSupabase(bulk);
    const local = require("../server/local-store");
    for (const seed of bulk) {
      local.upsertCompanyLocal(seed);
      slugs.push(seed.slug);
    }
    console.log(`  + ${bulk.length} placeholder profiles (local JSON + Supabase)`);
  } else {
    let n = 0;
    for (const seed of bulk) {
      try {
        const where = await upsertCompany(seed);
        slugs.push(seed.slug);
        n++;
        if (n <= 3 || n % 50 === 0 || n === bulk.length) {
          console.log(`  + [${n}/${bulk.length}] ${seed.slug} → ${seed.profile.name} (${where})`);
        }
      } catch (err) {
        console.warn(`  ! ${seed.slug}: ${err.message}`);
      }
    }
  }

  await syncAfterSeed(slugs);

  console.log("\nDone.");
  if (!isSupabaseEnabled()) {
    console.log(`Local DB:  ${DB_PATH}`);
    console.log(`JSON:      ${EXPORT_DIR}`);
    console.log("\nTip: add SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to .env for cloud SQL.");
  }
  console.log("\nURLs:");
  for (const slug of slugs) {
    console.log(`  http://127.0.0.1:3000/company/${slug}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
