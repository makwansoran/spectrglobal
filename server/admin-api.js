/**
 * Admin API — editor-only company profile create/update (Supabase via service role).
 */
const { getAnonAuthClient, getAdminClient, hasSupabaseWrites, isSupabaseEnabled } = require("./supabase-client");
const { upsertCompany } = require("./store");
const { errorText } = require("./error-text");

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const INDUSTRIES = new Set([
  "shipping",
  "oil_gas",
  "aviation",
  "real_estate",
  "energy",
  "technology",
  "finance",
  "construction",
  "cleantech",
  "biotech",
  "mining",
  "aquaculture",
]);

function bearerToken(req) {
  const raw = req.headers.authorization || req.headers.Authorization || "";
  const match = String(raw).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function parseTags(value) {
  if (Array.isArray(value)) {
    return value.map((t) => String(t).trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/[,;|]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseSearchTerms(body, profile) {
  const fromField = parseTags(body.searchTerms);
  if (fromField.length) return fromField;
  const terms = new Set();
  if (profile.name) terms.add(profile.name.toLowerCase());
  if (profile.legalName) terms.add(profile.legalName.toLowerCase());
  for (const tag of profile.industryTags || []) terms.add(tag.toLowerCase());
  if (profile.stock?.ticker) terms.add(profile.stock.ticker.toLowerCase());
  terms.add(profile.id);
  return [...terms];
}

async function getProfileForUser(userId) {
  const { data, error } = await getAdminClient()
    .from("profiles")
    .select("id, username, email, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function resolveEditor(req) {
  const token = bearerToken(req);
  if (!token) return { status: 401, error: "Sign in required." };

  const { data, error } = await getAnonAuthClient().auth.getUser(token);
  if (error || !data.user) {
    return { status: 401, error: "Session expired. Sign in again." };
  }

  const profile = await getProfileForUser(data.user.id);
  const appRole = data.user.app_metadata?.role;
  const isEditor = profile?.role === "editor" || appRole === "editor";
  if (!isEditor) {
    return { status: 403, error: "Editor access required." };
  }

  return { status: 200, user: data.user, profile };
}

function buildProfileFromBody(body, slug) {
  const name = String(body.name || "").trim();
  const legalName = String(body.legalName || body.legal_name || name).trim();
  const countryCode = String(body.countryCode || body.country_code || "NO")
    .trim()
    .toUpperCase()
    .slice(0, 2);
  const countryName = String(body.countryName || body.country_name || "Norway").trim();
  const industry = INDUSTRIES.has(body.industry) ? body.industry : "energy";
  const founded = Math.min(
    new Date().getFullYear(),
    Math.max(1000, parseInt(String(body.founded || "2000"), 10) || 2000)
  );
  const isPublic = body.isPublic === true || body.isPublic === "true" || body.is_public === true;

  const profile = {
    id: slug,
    name,
    legalName,
    logoInitials: String(body.logoInitials || body.logo_initials || "").trim() || initialsFromName(name),
    countryCode,
    countryName,
    founded,
    headquarters: String(body.headquarters || "").trim() || `${countryName}`,
    industryTags: parseTags(body.industryTags || body.industry_tags),
    isPublic,
    industry,
    industryTabLabel: String(body.industryTabLabel || body.industry_tab_label || "Overview").trim() || "Overview",
    about: String(body.about || "").trim() || `${name} company profile.`,
    quickStats: Array.isArray(body.quickStats) ? body.quickStats : [],
    people: [],
    financials: { years: [], metrics: [] },
    news: [],
    filings: [],
    keyFacts: Array.isArray(body.keyFacts)
      ? body.keyFacts
      : [{ label: "Legal form", value: legalName.includes(" AS") ? "AS" : "—" }],
    competitors: [],
    funding: [],
    esg: {
      overall: 0,
      environmental: 0,
      social: 0,
      governance: 0,
      trend: "stable",
    },
    dataSources: [{ name: "Spectr editorial" }],
    lastUpdated: new Date().toISOString(),
    mapConfig: { center: [10, 62], zoom: 5 },
  };

  const website = String(body.website || "").trim();
  if (website) profile.website = website;

  const logoUrl = String(body.logoUrl || body.logo_url || "").trim();
  if (logoUrl) profile.logoUrl = logoUrl;

  const ticker = String(body.ticker || body.stockTicker || "").trim().toUpperCase();
  const exchange = String(body.exchange || "OSL").trim().toUpperCase();
  if (isPublic && ticker) {
    profile.stock = {
      ticker,
      exchange,
      currency: String(body.currency || "NOK").trim().toUpperCase(),
    };
  }

  return profile;
}

function validateCompanyBody(body, { slugOverride } = {}) {
  const slug = normalizeSlug(slugOverride || body.slug);
  if (!slug || !SLUG_RE.test(slug)) {
    return { error: "Slug must be 2–64 lowercase letters, numbers, and hyphens." };
  }

  const name = String(body.name || "").trim();
  if (!name) return { error: "Company name is required." };

  const profile = buildProfileFromBody(body, slug);
  const searchTerms = parseSearchTerms(body, profile);

  return {
    slug,
    profile,
    mapGeojson: body.mapGeojson ?? null,
    searchTerms,
  };
}

function catalogItem(row, kind, urlFallback) {
  const slug = row.id || row.slug || "";
  return {
    slug,
    name: row.name || slug,
    meta: row.meta || row.subtitle || "",
    url: row.url || (slug && urlFallback ? `${urlFallback}${slug}` : ""),
    kind: kind || row.kind || "",
  };
}

async function buildAdminCatalog() {
  const { listCompanies } = require("./store");
  const countriesStore = require("./supabase-countries-store");
  const politiciansStore = require("./supabase-politicians-store");
  const fleetStore = require("./supabase-fleet-store");
  const waterwaysStore = require("./waterways-store");
  const { listPeople } = require("./people-store");
  const { commodities, banks, investmentBanks, ventureCapital } = require("./catalog-stores");

  const [
    companies,
    countries,
    politicians,
    vessels,
    people,
    commodityRows,
    waterwayRows,
    bankRows,
    ibRows,
    vcRows,
  ] = await Promise.all([
    listCompanies({ limit: 2000 }),
    countriesStore.listCountries(500),
    politiciansStore.listPoliticians(),
    fleetStore.listVessels(1000),
    listPeople(),
    commodities.list(500),
    waterwaysStore.listWaterways(500),
    banks.list(500),
    investmentBanks.list(500),
    ventureCapital.list(500),
  ]);

  const sections = [
    { id: "companies", label: "Companies", editable: true, items: companies.map((r) => catalogItem(r, "company", "/company/")) },
    { id: "countries", label: "Countries", items: countries.map((r) => catalogItem(r, "country", "/country/")) },
    { id: "politicians", label: "Politicians", items: politicians.map((r) => catalogItem(r, "politician", "/politician/")) },
    { id: "vessels", label: "Vessels", items: vessels.map((r) => catalogItem(r, "vessel", "/vessel/")) },
    { id: "people", label: "People", items: people.map((r) => catalogItem(r, "person", "/person/")) },
    { id: "commodities", label: "Commodities", items: commodityRows.map((r) => catalogItem(r, "commodity", "/commodity/")) },
    { id: "waterways", label: "Waterways", items: waterwayRows.map((r) => catalogItem(r, "waterway", "/waterway/")) },
    { id: "banks", label: "Banks", items: bankRows.map((r) => catalogItem(r, "bank", "/bank/")) },
    {
      id: "investment_banks",
      label: "Investment banks",
      items: ibRows.map((r) => catalogItem(r, "investment_bank", "/investment-bank/")),
    },
    {
      id: "venture_capital",
      label: "Venture capital",
      items: vcRows.map((r) => catalogItem(r, "venture_capital", "/venture-capital/")),
    },
  ];

  const counts = {};
  for (const s of sections) counts[s.id] = s.items.length;

  return { generatedAt: new Date().toISOString(), counts, sections };
}

async function handleAdminApi(req, res, pathname, { sendJson, readJsonBody }) {
  if (!pathname.startsWith("/api/admin")) return false;

  if (!isSupabaseEnabled()) {
    sendJson(res, 503, { error: "Supabase is not configured." });
    return true;
  }

  if (!hasSupabaseWrites()) {
    sendJson(res, 503, { error: "Company writes require SUPABASE_SERVICE_ROLE_KEY on the server." });
    return true;
  }

  try {
    if (pathname === "/api/admin/me" && req.method === "GET") {
      const auth = await resolveEditor(req);
      if (auth.status !== 200) {
        sendJson(res, auth.status, { error: auth.error });
        return true;
      }
      sendJson(res, 200, {
        ok: true,
        editor: true,
        user: {
          id: auth.user.id,
          email: auth.user.email,
          username: auth.profile?.username || null,
          role: auth.profile?.role || "editor",
        },
      });
      return true;
    }

    if (pathname === "/api/admin/catalog" && req.method === "GET") {
      const auth = await resolveEditor(req);
      if (auth.status !== 200) {
        sendJson(res, auth.status, { error: auth.error });
        return true;
      }
      const catalog = await buildAdminCatalog();
      sendJson(res, 200, catalog);
      return true;
    }

    const companyMatch = pathname.match(/^\/api\/admin\/companies(?:\/([a-z0-9-]+))?$/);
    if (companyMatch && (req.method === "POST" || req.method === "PUT")) {
      const auth = await resolveEditor(req);
      if (auth.status !== 200) {
        sendJson(res, auth.status, { error: auth.error });
        return true;
      }

      const body = await readJsonBody(req);
      const slugFromPath = companyMatch[1] || null;
      if (req.method === "PUT" && slugFromPath) {
        body.slug = slugFromPath;
      }

      const parsed = validateCompanyBody(body, { slugOverride: slugFromPath });
      if (parsed.error) {
        sendJson(res, 400, { error: parsed.error });
        return true;
      }

      const { data: existing } = await getAdminClient()
        .from("companies")
        .select("slug")
        .eq("slug", parsed.slug)
        .maybeSingle();

      if (req.method === "POST" && existing) {
        sendJson(res, 409, { error: `Company slug "${parsed.slug}" already exists. Use update or pick another slug.` });
        return true;
      }

      const seed = {
        slug: parsed.slug,
        profile: parsed.profile,
        mapGeojson: parsed.mapGeojson,
        searchTerms: parsed.searchTerms,
      };

      await upsertCompany(seed);

      sendJson(res, req.method === "POST" ? 201 : 200, {
        ok: true,
        slug: parsed.slug,
        url: `/company/${parsed.slug}`,
        message: existing ? "Company profile updated." : "Company profile created.",
      });
      return true;
    }

    sendJson(res, 404, { error: "Not found" });
    return true;
  } catch (err) {
    console.error("Admin API error:", err);
    sendJson(res, 500, { error: errorText(err, "Admin error") });
    return true;
  }
}

module.exports = { handleAdminApi, normalizeSlug, validateCompanyBody };
