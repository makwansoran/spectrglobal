/**
 * Upload company_people rows from data/company-people/*.json to Supabase.
 * Requires company_people table (supabase/schema.sql).
 *
 *   node scripts/seed-people.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const supabasePeople = require("../server/supabase-people-store");

const ROOT = path.resolve(__dirname, "..");
const EXPORT_DIR = path.join(ROOT, "data", "company-people");

async function main() {
  if (!supabasePeople.isSupabaseEnabled()) {
    console.error("Supabase is not configured (.env SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).");
    process.exit(1);
  }

  if (!fs.existsSync(EXPORT_DIR)) {
    console.error(`No ${EXPORT_DIR} — run: npm run db:sync-people`);
    process.exit(1);
  }

  const files = fs.readdirSync(EXPORT_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Upserting company_people for ${files.length} companies…`);

  let ok = 0;
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, file), "utf8"));
    const companySlug = data.companySlug;
    const people = data.people || [];
    if (!companySlug) continue;

    const entries = people
      .filter((row) => row.profile?.slug || row.slug)
      .map((row) => ({
        profile: row.profile || row,
        title: row.title || "",
        localId: row.localId || null,
      }));

    await supabasePeople.upsertCompanyPeopleSupabase(companySlug, entries);
    ok++;
    if (ok % 25 === 0) console.log(`  ${ok}/${files.length}…`);
  }

  console.log(`\nDone. ${ok} companies → company_people table.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
