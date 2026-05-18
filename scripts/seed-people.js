/**
 * Upload people + company_people links from data/people and data/company-people to Supabase.
 * Requires people + company_people tables (supabase/schema.sql).
 *
 *   node scripts/seed-people.js
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const supabasePeople = require("../server/supabase-people-store");

const ROOT = path.resolve(__dirname, "..");
const PEOPLE_DIR = path.join(ROOT, "data", "people");
const LINKS_DIR = path.join(ROOT, "data", "company-people");

async function main() {
  if (!supabasePeople.isSupabaseEnabled()) {
    console.error("Supabase is not configured (.env SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).");
    process.exit(1);
  }

  if (!fs.existsSync(PEOPLE_DIR)) {
    console.error(`No ${PEOPLE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(PEOPLE_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Upserting ${files.length} people…`);

  let peopleOk = 0;
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(PEOPLE_DIR, file), "utf8"));
    const profile = data.profile;
    if (!profile?.slug) continue;
    await supabasePeople.upsertPersonSupabase(profile);
    peopleOk++;
    if (peopleOk % 25 === 0) console.log(`  ${peopleOk}/${files.length} people…`);
  }
  console.log(`People: ${peopleOk} upserted.`);

  if (!fs.existsSync(LINKS_DIR)) {
    console.log("No company_people directory — skipped links.");
    return;
  }

  const linkFiles = fs.readdirSync(LINKS_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Upserting ${linkFiles.length} company_people link files…`);

  let linksOk = 0;
  for (const file of linkFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(LINKS_DIR, file), "utf8"));
    const companySlug = data.companySlug;
    const links = data.links || [];
    if (!companySlug) continue;
    await supabasePeople.upsertCompanyPeopleLinksSupabase(companySlug, links);
    linksOk++;
  }
  console.log(`Company links: ${linksOk} companies updated.`);
  console.log("\nDone. View tables in Supabase → Table Editor → people / company_people");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
