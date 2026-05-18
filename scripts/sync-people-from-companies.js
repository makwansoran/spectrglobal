/**
 * Extract embedded company.people into the people table + company_people links.
 * Run after applying supabase/schema.sql (people + company_people tables).
 *
 *   node scripts/sync-people-from-companies.js
 */
require("./load-env").loadEnv();

const { listCompanies, getCompanyRaw, saveCompanySeed } = require("../server/store");
const { syncPeopleFromCompany, clearBatchCache } = require("../server/people-sync");
const { isEmbeddedPerson } = require("../server/person-utils");

async function main() {
  const index = await listCompanies();
  console.log(`Scanning ${index.length} companies for people…\n`);

  let companiesUpdated = 0;
  let peopleLinked = 0;

  clearBatchCache();

  for (const row of index) {
    const slug = row.id;
    const data = await getCompanyRaw(slug);
    if (!data?.profile) continue;

    const embedded = (data.profile.people || []).filter((p) => isEmbeddedPerson(p));
    if (!embedded.length) continue;

    const profileWithRefs = await syncPeopleFromCompany({ slug, profile: data.profile });
    await saveCompanySeed({
      slug,
      profile: profileWithRefs,
      mapGeojson: data.mapGeojson ?? null,
      searchTerms: row.terms || [],
    });

    companiesUpdated++;
    peopleLinked += embedded.length;
    console.log(`  ${slug}: ${embedded.length} people → people table`);
  }

  console.log(`\nDone. ${peopleLinked} people linked across ${companiesUpdated} companies.`);
  console.log("API: GET /api/people  ·  GET /api/people/:slug");
  console.log("\nIf Supabase people tables are missing, run the SQL in supabase/schema.sql (people + company_people), then re-run this script.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
