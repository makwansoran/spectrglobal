const localPeople = require("./local-people-store");
const supabasePeople = require("./supabase-people-store");
const { refsToDisplayPeople, isEmbeddedPerson } = require("./person-utils");

async function listPeople() {
  if (supabasePeople.isSupabaseEnabled()) {
    try {
      const rows = await supabasePeople.listPeopleSupabase();
      if (rows.length) return rows;
    } catch (err) {
      console.warn("Supabase people list failed:", err.message);
    }
  }
  return localPeople.listPeopleLocal();
}

async function getPerson(slug) {
  if (supabasePeople.isSupabaseEnabled()) {
    try {
      const p = await supabasePeople.getPersonSupabase(slug);
      if (p) return p;
    } catch (err) {
      console.warn(`Supabase get person(${slug}) failed:`, err.message);
    }
  }
  return localPeople.getPersonLocal(slug);
}

async function getPeopleBySlugs(slugs) {
  if (!slugs.length) return {};
  if (supabasePeople.isSupabaseEnabled()) {
    try {
      const map = await supabasePeople.getPeopleBySlugsSupabase(slugs);
      if (Object.keys(map).length) return map;
    } catch (err) {
      console.warn("Supabase getPeopleBySlugs failed:", err.message);
    }
  }
  return localPeople.getPeopleBySlugsLocal(slugs);
}

async function getCompanyPeopleRefs(companySlug) {
  if (supabasePeople.isSupabaseEnabled()) {
    try {
      const refs = await supabasePeople.getCompanyPeopleRefsSupabase(companySlug);
      if (refs?.length) return refs;
    } catch (err) {
      console.warn(`Supabase company_people(${companySlug}) failed:`, err.message);
    }
  }
  return localPeople.getCompanyPeopleRefsLocal(companySlug);
}

/**
 * Resolve company.profile.people for API responses.
 */
async function hydrateCompanyPeople(profile, companySlug) {
  const people = profile.people || [];
  if (!people.length) return profile;

  const slug = companySlug || profile.id;

  if (people.every(isEmbeddedPerson)) {
    const fromLinks = await getCompanyPeopleRefs(slug);
    if (!fromLinks?.length) return profile;
  }

  let refs = people.filter((p) => p.personSlug);
  if (!refs.length) {
    const fromLinks = await getCompanyPeopleRefs(slug);
    if (fromLinks?.length) refs = fromLinks;
  }
  if (!refs.length) return profile;

  const slugs = refs.map((r) => r.personSlug);
  const profilesBySlug = await getPeopleBySlugs(slugs);
  const display = refsToDisplayPeople(refs, profilesBySlug);

  return { ...profile, people: display.length ? display : people };
}

module.exports = {
  listPeople,
  getPerson,
  getPeopleBySlugs,
  hydrateCompanyPeople,
};
