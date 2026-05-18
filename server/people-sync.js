/**
 * Extract people from company profiles into the people data source.
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

async function savePerson(profile) {
  batchProfiles.set(profile.slug, profile);
  localPeople.upsertPersonLocal(profile);
  if (supabasePeople.isSupabaseEnabled() && supabasePeopleReady) {
    try {
      await supabasePeople.upsertPersonSupabase(profile);
    } catch (err) {
      supabasePeopleReady = false;
      console.warn("  Supabase people write disabled:", err.message);
    }
  }
}

async function saveCompanyLinks(companySlug, links) {
  localPeople.upsertCompanyPeopleLinksLocal(companySlug, links);
  if (supabasePeople.isSupabaseEnabled() && supabasePeopleReady) {
    try {
      await supabasePeople.upsertCompanyPeopleLinksSupabase(companySlug, links);
    } catch (err) {
      supabasePeopleReady = false;
      console.warn("  Supabase company_people write disabled:", err.message);
    }
  }
}

/**
 * Sync people from one company seed/profile.
 * Returns updated profile with people refs (not full embeds).
 */
async function syncPeopleFromCompany({ slug, profile }) {
  const embedded = (profile.people || []).filter((p) => p?.name);
  if (!embedded.length) {
    await saveCompanyLinks(slug, []);
    return profile;
  }

  const reserved = new Set(batchProfiles.keys());
  const links = [];

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

    await savePerson(nextProfile);
    links.push({
      personSlug,
      title: person.title || "",
      localId: person.id || null,
    });
  }

  await saveCompanyLinks(slug, links);

  const refs = toCompanyPersonRefs(links);
  return { ...profile, people: refs };
}

function clearBatchCache() {
  batchProfiles.clear();
}

module.exports = {
  syncPeopleFromCompany,
  clearBatchCache,
};
