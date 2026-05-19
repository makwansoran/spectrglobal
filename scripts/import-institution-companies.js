/**
 * Upsert top institutional holders into public.companies.
 *
 * - Listed (BLK, JPM, …): Finnhub profile → full public company seed
 * - Private (Vanguard, Fidelity, …): org profile from data/institutions.json
 *
 * Usage:
 *   node scripts/import-institution-companies.js
 *   node scripts/import-institution-companies.js --dry-run
 *   node scripts/import-institution-companies.js --slug blackrock
 *
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Listed rows also need: FINNHUB_API_KEY
 */
require("./load-env").loadEnv();

const fs = require("fs");
const path = require("path");
const { upsertCompany } = require("../server/store");
const { isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const finnhub = require("../server/finnhub");
const { symbolToSeed } = require("../server/finnhub-import");
const { ORG_TYPE_LABELS } = require("../server/institutions");
const { defaultLogoUrl } = require("../server/company-logo");

const REGISTRY_PATH = path.join(__dirname, "../data/institutions.json");
const RATE_MS = 400;

const ORG_TYPE_TO_INDUSTRY = {
  asset_manager: "finance",
  bank: "finance",
  sovereign_wealth: "finance",
  insurance: "finance",
  hedge_fund: "finance",
  conglomerate: "finance",
  pension: "finance",
  other: "finance",
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** US listed company slug (no dots — use us-brk-b not us-brk.b). */
function listedCompanySlug(ticker) {
  return `us-${String(ticker).toLowerCase().replace(/\./g, "-")}`;
}

function initials(name) {
  const words = String(name || "")
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return String(name || "??").slice(0, 2).toUpperCase();
}

function searchTerms(inst) {
  const terms = new Set([
    inst.slug,
    inst.name,
    ...(inst.aliases || []),
  ]);
  if (inst.listedTicker) {
    terms.add(inst.listedTicker);
    terms.add(inst.listedTicker.toLowerCase());
  }
  if (inst.companySlug) terms.add(inst.companySlug);
  return [...terms].map((t) => String(t).trim()).filter(Boolean);
}

function privateInstitutionSeed(inst) {
  const slug = inst.companySlug || inst.slug;
  const orgLabel = ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other;
  const logoUrl = inst.logoDomain
    ? `https://logo.clearbit.com/${inst.logoDomain}`
    : undefined;

  const profile = {
    id: slug,
    name: inst.name,
    legalName: inst.name,
    logoUrl,
    logoInitials: initials(inst.name),
    countryCode: "US",
    countryName: "United States",
    headquarters: "United States",
    industryTags: [orgLabel, "Institutional investor"],
    isPublic: false,
    industry: ORG_TYPE_TO_INDUSTRY[inst.orgType] || "finance",
    industryTabLabel: "Overview",
    about: inst.about || `${inst.name} is a ${orgLabel.toLowerCase()} (private organization).`,
    quickStats: [
      { label: "Organization type", value: orgLabel, format: "text" },
      { label: "Listing", value: "Private", format: "text" },
    ],
    people: [],
    financials: { years: [], metrics: [] },
    news: [],
    filings: [],
    keyFacts: [
      { label: "Organization type", value: orgLabel },
      { label: "Listing", value: "Private" },
      ...(inst.website ? [{ label: "Website", value: inst.website }] : []),
    ],
    competitors: [],
    funding: [],
    esg: { overall: 0, environmental: 0, social: 0, governance: 0, trend: "stable" },
    quickStats: [],
    dataSources: [
      ...(inst.website ? [{ name: "Company website", url: inst.website }] : []),
      { name: "Spectr institutions registry", url: "https://spectr.no" },
    ],
    lastUpdated: new Date().toISOString(),
    institution: {
      slug: inst.slug,
      orgType: inst.orgType,
      isListed: false,
    },
  };

  if (!profile.logoUrl) {
    const fallback = defaultLogoUrl(profile);
    if (fallback) profile.logoUrl = fallback;
  }

  return {
    slug,
    searchTerms: searchTerms(inst),
    mapGeojson: null,
    profile,
  };
}

async function listedInstitutionSeed(inst) {
  const ticker = String(inst.listedTicker || "").trim().toUpperCase();
  if (!ticker) throw new Error(`Missing listedTicker for ${inst.slug}`);

  const profile2 = await finnhub.fetchStockProfile(ticker);
  const seed = symbolToSeed(
    {
      symbol: ticker,
      description: profile2?.name || inst.name,
      type: "Common Stock",
    },
    profile2
  );
  if (!seed) throw new Error(`Could not build seed for ${ticker}`);

  seed.slug = inst.companySlug || listedCompanySlug(ticker);
  seed.profile.id = seed.slug;
  seed.searchTerms = searchTerms(inst);

  const orgLabel = ORG_TYPE_LABELS[inst.orgType] || ORG_TYPE_LABELS.other;
  seed.profile.about = inst.about || seed.profile.about;
  seed.profile.institution = {
    slug: inst.slug,
    orgType: inst.orgType,
    isListed: true,
    listedTicker: ticker,
    listedExchange: inst.listedExchange,
  };

  const listing = inst.listedExchange
    ? `${inst.listedExchange} · ${ticker}`
    : ticker;
  seed.profile.keyFacts = [
    { label: "Organization type", value: orgLabel },
    { label: "Listing", value: `Listed · ${listing}` },
    ...(seed.profile.keyFacts || []).filter(
      (f) => !/^(Listing|Organization type)$/i.test(f.label)
    ),
  ];

  if (!seed.profile.logoUrl && inst.logoDomain) {
    seed.profile.logoUrl = `https://logo.clearbit.com/${inst.logoDomain}`;
  }

  return seed;
}

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");
  const slugFilter = process.argv.includes("--slug")
    ? process.argv[process.argv.indexOf("--slug") + 1]
    : null;

  let institutions = JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf8"));
  if (slugFilter) {
    institutions = institutions.filter((i) => i.slug === slugFilter);
    if (!institutions.length) {
      console.error("No institution with slug:", slugFilter);
      process.exit(1);
    }
  }

  const needsFinnhub = institutions.some((i) => i.isListed);
  if (needsFinnhub && !finnhub.isEnabled()) {
    console.error("Set FINNHUB_API_KEY for listed institutions (BLK, JPM, …)");
    process.exit(1);
  }

  console.log(
    dryRun ? "Dry run — no writes\n" : `Importing ${institutions.length} institutions into companies…\n`
  );

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < institutions.length; i++) {
    const inst = institutions[i];
    if (i > 0 && inst.isListed) await sleep(RATE_MS);

    try {
      const seed = inst.isListed
        ? await listedInstitutionSeed(inst)
        : privateInstitutionSeed(inst);

      const kind = inst.isListed ? "listed" : "private";
      const line = `  ${seed.slug} ← ${inst.name} (${kind})`;

      if (dryRun) {
        console.log(line);
        ok++;
        continue;
      }

      const where = await upsertCompany(seed);
      console.log(`${line} → ${where}`);
      ok++;
    } catch (err) {
      fail++;
      console.error(`  ✗ ${inst.slug}: ${err.message}`);
    }
  }

  console.log(`\nDone. ${ok} ok, ${fail} failed.`);
  if (!dryRun && ok) {
    console.log("\nProfiles:");
    for (const inst of institutions) {
      const slug = inst.companySlug || (inst.isListed ? `us-${String(inst.listedTicker).toLowerCase()}` : inst.slug);
      console.log(`  https://spectr.no/company/${slug}`);
    }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
