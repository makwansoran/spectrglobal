/**
 * Local JSON export for company_people (one file per company).
 */
const fs = require("fs");
const path = require("path");
const {
  personInitials,
  buildPersonMeta,
  buildPersonSearchTerms,
} = require("./person-utils");

const ROOT = path.resolve(__dirname, "..");
const EXPORT_DIR = path.join(ROOT, "data", "company-people");

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
}

function upsertCompanyPeopleLocal(companySlug, entries) {
  ensureDirs();
  const payload = {
    companySlug,
    people: entries.map((e) => ({
      slug: e.profile.slug,
      title: e.title || "",
      localId: e.localId || null,
      profile: e.profile,
    })),
  };
  fs.writeFileSync(path.join(EXPORT_DIR, `${companySlug}.json`), JSON.stringify(payload, null, 2));
}

function listPeopleLocal() {
  if (!fs.existsSync(EXPORT_DIR)) return [];
  const seen = new Set();
  const out = [];
  for (const file of fs.readdirSync(EXPORT_DIR).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, file), "utf8"));
    for (const row of data.people || []) {
      const p = row.profile;
      if (!p?.slug || seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push({
        id: p.slug,
        name: p.name,
        meta: buildPersonMeta(p),
        initials: personInitials(p.name),
        url: `/person/${p.slug}`,
        terms: buildPersonSearchTerms(p, data.companySlug),
      });
    }
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function getPersonLocal(slug) {
  if (!fs.existsSync(EXPORT_DIR)) return null;
  const profiles = [];
  for (const file of fs.readdirSync(EXPORT_DIR).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, file), "utf8"));
    const row = (data.people || []).find((r) => r.slug === slug || r.profile?.slug === slug);
    if (row?.profile) profiles.push(row.profile);
  }
  if (!profiles.length) return null;
  if (profiles.length === 1) return profiles[0];
  const base = { ...profiles[0] };
  const affiliations = [...(base.affiliations || [])];
  for (let i = 1; i < profiles.length; i++) {
    for (const a of profiles[i].affiliations || []) {
      if (!affiliations.some((x) => x.companySlug === a.companySlug)) {
        affiliations.push(a);
      }
    }
  }
  base.affiliations = affiliations;
  return base;
}

function getCompanyPeopleLocal(companySlug) {
  const filePath = path.join(EXPORT_DIR, `${companySlug}.json`);
  if (!fs.existsSync(filePath)) return [];
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.people || [];
}

module.exports = {
  EXPORT_DIR,
  upsertCompanyPeopleLocal,
  listPeopleLocal,
  getPersonLocal,
  getCompanyPeopleLocal,
};
