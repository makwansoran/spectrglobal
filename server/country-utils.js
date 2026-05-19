/**
 * Country profile helpers (search meta, initials).
 */
const { countrySlug } = require("./country-codes");
const { personInitials } = require("./person-utils");

function countryInitials(name) {
  const parts = String(name || "?")
    .replace(/[^a-zA-ZæøåÆØÅ\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0] || "C").slice(0, 2).toUpperCase();
}

function buildCountryMeta(profile) {
  const iso = profile.isoCode || "";
  const capital = profile.capital;
  if (capital && iso) return `${capital} · ${iso}`;
  if (iso) return iso;
  return profile.region || "Country";
}

function buildCountrySearchTerms(profile) {
  const terms = new Set();
  const add = (t) => {
    if (t) terms.add(String(t).toLowerCase().trim());
  };
  add(profile.slug);
  add(profile.id);
  add(profile.name);
  add(profile.isoCode);
  add(profile.capital);
  add(profile.region);
  for (const t of profile.searchTerms || []) add(t);
  return [...terms].filter(Boolean);
}

function buildPoliticianMeta(profile) {
  const office = profile.office || profile.currentOffice;
  const country = profile.countryName;
  if (office && country) return `${office} · ${country}`;
  if (office) return office;
  if (country) return country;
  return "Politician";
}

function buildPoliticianSearchTerms(profile) {
  const terms = new Set();
  const add = (t) => {
    if (t) terms.add(String(t).toLowerCase().trim());
  };
  add(profile.slug);
  add(profile.id);
  add(profile.name);
  add(profile.office);
  add(profile.party);
  add(profile.countrySlug);
  add(profile.countryName);
  for (const t of profile.searchTerms || []) add(t);
  return [...terms].filter(Boolean);
}

function seedToCountryProfile(seed) {
  const p = seed.profile || seed;
  const isoCode = String(p.isoCode || seed.isoCode || "").toUpperCase();
  const name = p.name || seed.name;
  const slug = seed.slug || p.id || countrySlug(name, isoCode);
  const now = p.lastUpdated || new Date().toISOString();
  return {
    id: slug,
    slug,
    name,
    isoCode,
    region: p.region || "",
    capital: p.capital || "",
    population: p.population ?? null,
    governmentType: p.governmentType || "",
    about: p.about || "",
    flagEmoji: p.flagEmoji || "",
    logoInitials: p.logoInitials || countryInitials(name),
    searchTerms: p.searchTerms || seed.searchTerms || [],
    dataSources: p.dataSources || [],
    lastUpdated: now,
  };
}

function politicianInitials(name) {
  return personInitials(name);
}

module.exports = {
  countryInitials,
  buildCountryMeta,
  buildCountrySearchTerms,
  buildPoliticianMeta,
  buildPoliticianSearchTerms,
  seedToCountryProfile,
  politicianInitials,
};
