/**
 * Extract embedded company.people into company_people rows.
 * Run after applying supabase/schema.sql (company_people table).
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
    console.log(`  ${slug}: ${embedded.length} people → company_people`);
  }

  console.log(`\nDone. ${peopleLinked} people linked across ${companiesUpdated} companies.`);
  console.log("API: GET /api/people  ·  GET /api/people/:slug");
  console.log("\nIf company_people is missing, run supabase/schema.sql, then: npm run db:seed-people");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
