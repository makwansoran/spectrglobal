/**
 * Local SQLite + JSON exports (offline / fallback when Supabase is not configured).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DB_PATH = path.join(ROOT, "data", "spectr.db");
const EXPORT_DIR = path.join(ROOT, "data", "companies");

let db;

function openDatabase() {
  const Database = require("better-sqlite3");
  return new Database(DB_PATH);
}

function ensureDb() {
  if (db) return db;
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  db = openDatabase();
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      slug TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      legal_name TEXT NOT NULL,
      meta TEXT NOT NULL,
      initials TEXT NOT NULL,
      search_terms TEXT NOT NULL,
      profile_json TEXT NOT NULL,
      map_geojson TEXT,
      updated_at TEXT NOT NULL
    );
  `);
  return db;
}

function buildMeta(profile) {
  if (!profile) return "Norway";
  const tags = profile.industryTags || [];
  return `${tags.slice(0, 2).join(" · ") || profile.industry || "Listed"} · ${profile.countryName || "Norway"}`;
}

function exportCompanyJson(slug) {
  try {
    const row = ensureDb()
      .prepare("SELECT profile_json, map_geojson FROM companies WHERE slug = ?")
      .get(slug);
    if (!row) return;
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    const payload = {
      profile: JSON.parse(row.profile_json),
      mapGeojson: row.map_geojson ? JSON.parse(row.map_geojson) : null,
    };
    fs.writeFileSync(path.join(EXPORT_DIR, `${slug}.json`), JSON.stringify(payload, null, 2));
  } catch {
    /* sqlite unavailable */
  }
}

function upsertCompanyLocal({ slug, profile, mapGeojson, searchTerms }) {
  if (!profile || !slug) {
    console.warn(`  Skip invalid seed (missing profile): ${slug || "?"}`);
    return;
  }
  const meta = buildMeta(profile);
  const row = {
    slug,
    name: profile.name,
    legal_name: profile.legalName,
    meta,
    initials: profile.logoInitials,
    search_terms: JSON.stringify(searchTerms),
    profile_json: JSON.stringify(profile),
    map_geojson: mapGeojson ? JSON.stringify(mapGeojson) : null,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };

  try {
    const conn = ensureDb();
    conn
      .prepare(
        `
      INSERT INTO companies (slug, name, legal_name, meta, initials, search_terms, profile_json, map_geojson, updated_at)
      VALUES (@slug, @name, @legal_name, @meta, @initials, @search_terms, @profile_json, @map_geojson, @updated_at)
      ON CONFLICT(slug) DO UPDATE SET
        name = excluded.name,
        legal_name = excluded.legal_name,
        meta = excluded.meta,
        initials = excluded.initials,
        search_terms = excluded.search_terms,
        profile_json = excluded.profile_json,
        map_geojson = excluded.map_geojson,
        updated_at = excluded.updated_at
    `
      )
      .run(row);
    exportCompanyJson(slug);
  } catch (err) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(EXPORT_DIR, `${slug}.json`),
      JSON.stringify({ profile, mapGeojson: mapGeojson ?? null }, null, 2)
    );
    console.warn(`  (SQLite skipped: ${err.message})`);
  }
}

function rowToIndex(row) {
  return {
    id: row.slug,
    name: row.name,
    legalName: row.legal_name,
    meta: row.meta,
    initials: row.initials,
    url: `/company/${row.slug}`,
    terms: typeof row.search_terms === "string" ? JSON.parse(row.search_terms) : row.search_terms,
  };
}

function listCompaniesLocal(limit) {
  if (fs.existsSync(DB_PATH)) {
    try {
      const rows = ensureDb()
        .prepare("SELECT slug, name, legal_name, meta, initials, search_terms FROM companies ORDER BY name")
        .all();
      if (rows.length) {
        const mapped = rows.map(rowToIndex);
        return limit ? mapped.slice(0, limit) : mapped;
      }
    } catch {
      /* fall through */
    }
  }

  if (!fs.existsSync(EXPORT_DIR)) return [];

  return fs
    .readdirSync(EXPORT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const slug = f.replace(/\.json$/, "");
      const data = getCompanyFromJson(slug);
      if (!data?.profile) return null;
      const p = data.profile;
      return {
        id: slug,
        name: p.name,
        legalName: p.legalName,
        meta: buildMeta(p),
        initials: p.logoInitials,
        url: `/company/${slug}`,
        terms: [p.name, p.legalName, p.stock?.ticker].filter(Boolean).map((t) => String(t).toLowerCase()),
      };
    })
    .filter(Boolean)
    .slice(0, limit || undefined);
}

function searchCompaniesLocal(query, limit = 25) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return listCompaniesLocal(limit);

  if (fs.existsSync(DB_PATH)) {
    try {
      const pattern = `%${q}%`;
      const rows = ensureDb()
        .prepare(
          `SELECT slug, name, legal_name, meta, initials, search_terms FROM companies
           WHERE lower(name) LIKE ? OR lower(legal_name) LIKE ? OR lower(slug) LIKE ?
              OR lower(search_terms) LIKE ?
           ORDER BY name LIMIT ?`
        )
        .all(pattern, pattern, pattern, pattern, limit);
      if (rows.length) return rows.map(rowToIndex);
    } catch {
      /* fall through */
    }
  }

  return listCompaniesLocal()
    .filter((row) => {
      if (row.name.toLowerCase().includes(q)) return true;
      if (row.legalName.toLowerCase().includes(q)) return true;
      if (row.id.includes(q)) return true;
      return row.terms.some((t) => t.includes(q) || t.startsWith(q));
    })
    .slice(0, limit);
}

function getCompanyFromJson(slug) {
  const filePath = path.join(EXPORT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getCompanyLocal(slug) {
  if (fs.existsSync(DB_PATH)) {
    try {
      const row = ensureDb()
        .prepare("SELECT profile_json, map_geojson FROM companies WHERE slug = ?")
        .get(slug);
      if (row) {
        return {
          profile: JSON.parse(row.profile_json),
          mapGeojson: row.map_geojson ? JSON.parse(row.map_geojson) : null,
        };
      }
    } catch {
      /* fall through */
    }
  }
  return getCompanyFromJson(slug);
}

function removeStaleExports(activeSlugs) {
  if (!fs.existsSync(EXPORT_DIR)) return;
  for (const file of fs.readdirSync(EXPORT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const slug = file.replace(/\.json$/, "");
    if (!activeSlugs.includes(slug)) {
      fs.unlinkSync(path.join(EXPORT_DIR, file));
      console.log(`  Removed stale export: ${slug}.json`);
    }
  }
}

module.exports = {
  DB_PATH,
  EXPORT_DIR,
  upsertCompanyLocal,
  listCompaniesLocal,
  searchCompaniesLocal,
  getCompanyLocal,
  removeStaleExports,
  buildMeta,
};
