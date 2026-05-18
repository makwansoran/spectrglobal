/**
 * Person slug + profile helpers (shared by local + Supabase stores).
 */

function slugifyName(name) {
  return String(name || "person")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 56);
}

function personInitials(name) {
  const parts = String(name || "?")
    .replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] || "P").slice(0, 2).toUpperCase();
}

function buildPersonMeta(profile) {
  const title = profile.currentTitle || profile.affiliations?.[0]?.title;
  const company = profile.currentCompanyName || profile.affiliations?.[0]?.companyName;
  if (title && company) return `${title} · ${company}`;
  if (title) return title;
  if (company) return company;
  return "Executive";
}

function buildPersonSearchTerms(profile, companySlug) {
  const terms = new Set();
  const add = (t) => {
    if (t) terms.add(String(t).toLowerCase().trim());
  };
  add(profile.slug);
  add(profile.name);
  add(profile.id);
  add(profile.currentTitle);
  add(profile.currentCompanyName);
  add(companySlug);
  for (const a of profile.affiliations || []) {
    add(a.companySlug);
    add(a.companyName);
    add(a.title);
  }
  return [...terms].filter(Boolean);
}

/**
 * @param {string} name
 * @param {string} localId
 * @param {Set<string>} reserved
 */
function allocatePersonSlug(name, localId, reserved) {
  let base = slugifyName(name);
  if (!base) base = slugifyName(localId) || "person";
  let slug = base;
  let n = 2;
  while (reserved.has(slug)) {
    slug = `${base}-${n++}`;
  }
  reserved.add(slug);
  return slug;
}

/**
 * Build a person profile + company link from embedded company.people entry.
 */
function personFromCompanyEmbed(person, companySlug, companyName, personSlug) {
  const title = person.title || "";
  const now = new Date().toISOString();
  return {
    profile: {
      id: person.id || personSlug,
      slug: personSlug,
      name: person.name,
      photoUrl: person.photoUrl,
      bio: person.bio || "",
      currentTitle: title,
      currentCompanySlug: companySlug,
      currentCompanyName: companyName,
      affiliations: [
        {
          companySlug,
          companyName,
          title,
        },
      ],
      dataSources: [],
      lastUpdated: now,
    },
    link: {
      companySlug,
      personSlug,
      title,
      localId: person.id || null,
    },
  };
}

/**
 * Merge a new company affiliation into an existing person profile.
 */
function mergeAffiliation(existingProfile, companySlug, companyName, title) {
  const affiliations = [...(existingProfile.affiliations || [])];
  const idx = affiliations.findIndex((a) => a.companySlug === companySlug);
  if (idx >= 0) {
    affiliations[idx] = { companySlug, companyName, title };
  } else {
    affiliations.push({ companySlug, companyName, title });
  }
  return {
    ...existingProfile,
    affiliations,
    currentTitle: existingProfile.currentTitle || title,
    currentCompanySlug: existingProfile.currentCompanySlug || companySlug,
    currentCompanyName: existingProfile.currentCompanyName || companyName,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Company profile.people → refs for storage on company JSON.
 */
function toCompanyPersonRefs(links) {
  return links.map((l, i) => ({
    id: l.localId || l.personSlug,
    personSlug: l.personSlug,
    title: l.title,
    sortOrder: i,
  }));
}

/**
 * Hydrate refs into display Person objects.
 */
function refsToDisplayPeople(refs, profilesBySlug) {
  return refs
    .map((ref) => {
      const slug = ref.personSlug;
      const p = profilesBySlug[slug];
      if (!p) {
        if (ref.name) return ref;
        return null;
      }
      return {
        id: ref.id || p.id || slug,
        personSlug: slug,
        name: p.name,
        title: ref.title || p.currentTitle || "",
        photoUrl: p.photoUrl,
        bio: p.bio,
      };
    })
    .filter(Boolean);
}

function isEmbeddedPerson(p) {
  return Boolean(p?.name && !p?.personSlug);
}

module.exports = {
  slugifyName,
  personInitials,
  buildPersonMeta,
  buildPersonSearchTerms,
  allocatePersonSlug,
  personFromCompanyEmbed,
  mergeAffiliation,
  toCompanyPersonRefs,
  refsToDisplayPeople,
  isEmbeddedPerson,
};
