/**
 * People — Supabase company_people table only.
 */
const supabasePeople = require("./supabase-people-store");
const { requireSupabase } = require("./supabase-client");
const { isEmbeddedPerson } = require("./person-utils");

async function listPeople() {
  requireSupabase();
  return supabasePeople.listPeopleSupabase();
}

async function getPerson(slug) {
  requireSupabase();
  return supabasePeople.getPersonSupabase(slug);
}

async function hydrateCompanyPeople(profile, companySlug) {
  const people = profile.people || [];
  const slug = companySlug || profile.id;

  if (people.length && people.every(isEmbeddedPerson)) {
    return profile;
  }

  requireSupabase();
  const rows = await supabasePeople.getCompanyPeopleForCompanySupabase(slug);
  if (!rows.length) return profile;

  return {
    ...profile,
    people: rows.map(supabasePeople.rowToDisplayPerson),
  };
}

module.exports = {
  listPeople,
  getPerson,
  hydrateCompanyPeople,
};
