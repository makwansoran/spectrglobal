/**
 * People — Supabase company_people table only.
 */
const supabasePeople = require("./supabase-people-store");
const { requireSupabase } = require("./supabase-client");
const { isEmbeddedPerson, refsToDisplayPeople } = require("./person-utils");

function slugToDisplayName(slug) {
  if (!slug) return "Unknown";
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function peopleRefsToDisplay(refs) {
  return (refs || [])
    .map((ref) => ({
      id: ref.id || ref.personSlug,
      personSlug: ref.personSlug,
      name: ref.name || slugToDisplayName(ref.personSlug),
      title: ref.title || "",
      photoUrl: ref.photoUrl,
    }))
    .filter((p) => p.personSlug || p.name);
}

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

  if (!people.length) return profile;

  if (people.every(isEmbeddedPerson)) {
    return profile;
  }

  requireSupabase();
  try {
    const rows = await supabasePeople.getCompanyPeopleForCompanySupabase(slug);
    if (rows.length) {
      return {
        ...profile,
        people: rows.map(supabasePeople.rowToDisplayPerson),
      };
    }
  } catch (err) {
    const missing = /company_people|schema cache|does not exist/i.test(err.message || "");
    if (!missing) throw err;
    console.warn("company_people unavailable, using profile_json people:", slug);
  }

  const fromRefs = refsToDisplayPeople(people, {});
  const display =
    fromRefs.length && fromRefs.every((p) => p?.name)
      ? fromRefs
      : peopleRefsToDisplay(people);

  return { ...profile, people: display };
}

module.exports = {
  listPeople,
  getPerson,
  hydrateCompanyPeople,
};
