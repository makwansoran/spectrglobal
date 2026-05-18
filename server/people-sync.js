/**
 * Extract embedded company.people into company_people rows (Supabase + local export).
 */
const {
  allocatePersonSlug,
  personFromCompanyEmbed,
  mergeAffiliation,
  toCompanyPersonRefs,
  isEmbeddedPerson,
} = require("./person-utils");
const localPeople = require("./local-people-store");
const supabasePeople = require("./supabase-people-store");

/** @type {Map<string, object>} slug → profile (in-memory during batch sync) */
const batchProfiles = new Map();

async function getExistingPersonProfile(slug) {
  if (batchProfiles.has(slug)) return batchProfiles.get(slug);
  if (supabasePeople.isSupabaseEnabled()) {
    try {
      const p = await supabasePeople.getPersonSupabase(slug);
      if (p) {
        batchProfiles.set(slug, p);
        return p;
      }
    } catch {
      /* fall through */
    }
  }
  const local = localPeople.getPersonLocal(slug);
  if (local) batchProfiles.set(slug, local);
  return local;
}

let supabasePeopleReady = true;

async function saveCompanyPeople(companySlug, entries) {
  localPeople.upsertCompanyPeopleLocal(companySlug, entries);
  if (supabasePeople.isSupabaseEnabled() && supabasePeopleReady) {
    try {
      await supabasePeople.upsertCompanyPeopleSupabase(companySlug, entries);
    } catch (err) {
      supabasePeopleReady = false;
      console.warn("  Supabase company_people write disabled:", err.message);
    }
  }
}

/**
 * Sync people from one company seed/profile into company_people.
 * Returns updated profile with lightweight refs in profile_json.
 */
async function syncPeopleFromCompany({ slug, profile }) {
  const embedded = (profile.people || []).filter((p) => p?.name && isEmbeddedPerson(p));
  if (!embedded.length) {
    await saveCompanyPeople(slug, []);
    return profile;
  }

  const reserved = new Set(batchProfiles.keys());
  const entries = [];

  for (const person of embedded) {
    let personSlug = person.personSlug;

    if (!personSlug) {
      personSlug = allocatePersonSlug(person.name, person.id, reserved);
    } else {
      reserved.add(personSlug);
    }

    const existing = await getExistingPersonProfile(personSlug);
    let nextProfile;

    if (existing) {
      nextProfile = mergeAffiliation(existing, slug, profile.name, person.title || "");
      if (person.bio && !existing.bio) nextProfile.bio = person.bio;
      if (person.photoUrl && !existing.photoUrl) nextProfile.photoUrl = person.photoUrl;
      if (person.name) nextProfile.name = person.name;
    } else {
      nextProfile = personFromCompanyEmbed(person, slug, profile.name, personSlug).profile;
    }

    batchProfiles.set(personSlug, nextProfile);
    entries.push({
      profile: nextProfile,
      title: person.title || "",
      localId: person.id || null,
    });
  }

  await saveCompanyPeople(slug, entries);

  const refs = toCompanyPersonRefs(
    entries.map((e) => ({
      personSlug: e.profile.slug,
      title: e.title,
      localId: e.localId,
    }))
  );
  return { ...profile, people: refs };
}

function clearBatchCache() {
  batchProfiles.clear();
}

module.exports = {
  syncPeopleFromCompany,
  clearBatchCache,
};
