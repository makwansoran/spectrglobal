/**
 * Local JSON exports for people (fallback when Supabase unavailable).
 */
const fs = require("fs");
const path = require("path");
const {
  personInitials,
  buildPersonMeta,
  buildPersonSearchTerms,
} = require("./person-utils");

const ROOT = path.resolve(__dirname, "..");
const EXPORT_DIR = path.join(ROOT, "data", "people");
const LINKS_DIR = path.join(ROOT, "data", "company-people");

function ensureDirs() {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(LINKS_DIR, { recursive: true });
}

function exportPersonJson(profile) {
  ensureDirs();
  fs.writeFileSync(path.join(EXPORT_DIR, `${profile.slug}.json`), JSON.stringify({ profile }, null, 2));
}

function exportCompanyLinks(companySlug, links) {
  ensureDirs();
  fs.writeFileSync(
    path.join(LINKS_DIR, `${companySlug}.json`),
    JSON.stringify({ companySlug, links }, null, 2)
  );
}

function upsertPersonLocal(profile) {
  exportPersonJson(profile);
}

function upsertCompanyPeopleLinksLocal(companySlug, links) {
  exportCompanyLinks(companySlug, links);
}

function listPeopleLocal() {
  if (!fs.existsSync(EXPORT_DIR)) return [];
  return fs
    .readdirSync(EXPORT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const slug = f.replace(/\.json$/, "");
      const data = JSON.parse(fs.readFileSync(path.join(EXPORT_DIR, f), "utf8"));
      const p = data.profile;
      if (!p) return null;
      return {
        id: slug,
        name: p.name,
        meta: buildPersonMeta(p),
        initials: personInitials(p.name),
        url: `/person/${slug}`,
        terms: buildPersonSearchTerms(p),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getPersonLocal(slug) {
  const filePath = path.join(EXPORT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return data.profile ?? null;
}

function getPeopleBySlugsLocal(slugs) {
  const map = {};
  for (const slug of slugs) {
    const p = getPersonLocal(slug);
    if (p) map[slug] = p;
  }
  return map;
}

function getCompanyPeopleRefsLocal(companySlug) {
  const filePath = path.join(LINKS_DIR, `${companySlug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return (data.links || []).map((l, i) => ({
    personSlug: l.personSlug,
    title: l.title,
    id: l.localId || l.personSlug,
    sortOrder: i,
  }));
}

module.exports = {
  EXPORT_DIR,
  LINKS_DIR,
  upsertPersonLocal,
  upsertCompanyPeopleLinksLocal,
  listPeopleLocal,
  getPersonLocal,
  getPeopleBySlugsLocal,
  getCompanyPeopleRefsLocal,
};
