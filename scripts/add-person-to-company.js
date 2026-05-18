/**
 * Add/update a person on a company + company_people + /person/:slug
 *
 * Usage:
 *   node scripts/add-person-to-company.js us-nvda jensen-huang "Jensen Huang" "President & CEO"
 */
require("./load-env").loadEnv();

const { listCompanies, getCompanyRaw, saveCompanySeed } = require("../server/store");
const { syncPeopleFromCompany } = require("../server/people-sync");

const [companySlug, personSlug, name, title, bio = "", photoUrl = ""] = process.argv.slice(2);

if (!companySlug || !personSlug || !name || !title) {
  console.error(
    'Usage: node scripts/add-person-to-company.js <company-slug> <person-slug> "<name>" "<title>" ["bio"] ["photoUrl"]'
  );
  process.exit(1);
}

async function main() {
  const data = await getCompanyRaw(companySlug);
  if (!data?.profile) throw new Error(`Company not found: ${companySlug}`);

  const index = await listCompanies();
  const row = index.find((c) => c.id === companySlug);

  const profile = { ...data.profile };
  const people = [...(profile.people || [])];
  const embed = {
    id: String(people.length + 1),
    personSlug,
    name,
    title,
    bio,
    photoUrl: photoUrl || undefined,
  };

  const i = people.findIndex((p) => p.personSlug === personSlug);
  if (i >= 0) people[i] = { ...people[i], ...embed };
  else people.push(embed);

  profile.people = people;
  profile.name = profile.name || name;

  const profileWithRefs = await syncPeopleFromCompany({ slug: companySlug, profile });

  await saveCompanySeed({
    slug: companySlug,
    profile: profileWithRefs,
    mapGeojson: data.mapGeojson ?? null,
    searchTerms: row?.terms || [],
  });

  console.log(`OK company: /company/${companySlug}`);
  console.log(`OK person:  /person/${personSlug}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
