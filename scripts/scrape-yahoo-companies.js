/**
 * Scrape Yahoo Finance for company data and update Supabase.
 *
 *   node scripts/scrape-yahoo-companies.js                       # All non-stub companies (priority order)
 *   node scripts/scrape-yahoo-companies.js --slug equinor        # Single company
 *   node scripts/scrape-yahoo-companies.js --prefix nb-          # By slug prefix
 *   node scripts/scrape-yahoo-companies.js --country NO          # By country code
 *   node scripts/scrape-yahoo-companies.js --limit 100           # Cap rows
 *   node scripts/scrape-yahoo-companies.js --refresh             # Re-scrape already-enriched companies
 *   node scripts/scrape-yahoo-companies.js --skip-us-stubs       # Skip us-* with no real ticker
 *   node scripts/scrape-yahoo-companies.js --concurrency 4       # Parallel workers
 *
 * Updates structured columns (industry, country_code, headquarters, founded,
 * employees, ticker, exchange, market_cap_usd, website, logo_url, description)
 * AND enriches profile_json with executives, holders, financials, analyst, ESG.
 */
require("./load-env").loadEnv();

const { getAdminClient, hasSupabaseWrites } = require("../server/supabase-client");
const yahoo = require("../server/yahoo-finance");

const PAGE = 200;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    slug: null,
    prefix: null,
    country: null,
    limit: Infinity,
    refresh: false,
    skipUsStubs: false,
    concurrency: 3,
    dryRun: false,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (a === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (a === "--country" && args[i + 1]) opts.country = String(args[++i]).toUpperCase();
    else if (a === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (a === "--concurrency" && args[i + 1]) opts.concurrency = parseInt(args[++i], 10);
    else if (a === "--refresh") opts.refresh = true;
    else if (a === "--skip-us-stubs") opts.skipUsStubs = true;
    else if (a === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

function buildProfileEnrichment(profile, n) {
  const next = { ...profile };

  if (n.profile.sector) next.sector = n.profile.sector;
  if (n.profile.industry) next.industry = mapIndustry(n.profile.sector, n.profile.industry);
  if (n.profile.industry) next.industryLabel = n.profile.industry;
  if (n.profile.summary) next.about = n.profile.summary;
  if (n.profile.website) next.website = n.profile.website;
  if (n.profile.employees) next.employees = n.profile.employees;
  if (n.profile.address) next.headquarters = n.profile.address;
  if (n.profile.country) next.countryName = n.profile.country;
  if (n.profile.phone) next.phone = n.profile.phone;

  if (n.executives?.length) {
    next.executives = n.executives;
    next.people = n.executives.map((e, i) => ({
      id: slugifyName(e.name),
      personSlug: slugifyName(e.name),
      name: e.name,
      title: e.title,
      sortOrder: i,
      totalPay: e.totalPay,
      yearBorn: e.yearBorn,
    }));
  }

  next.keyStats = n.keyStats;
  next.ownership = {
    asOf: new Date().toISOString().slice(0, 10),
    source: "Yahoo Finance",
    insiderPct: n.ownership.insiderPct,
    institutionPct: n.ownership.institutionPct,
    institutionCount: n.ownership.institutionCount,
    topInstitutions: n.ownership.topInstitutions,
    topFunds: n.ownership.topFunds,
    insiders: n.ownership.insiders,
  };
  if (n.financials.income.annual?.length || n.financials.income.quarterly?.length) {
    next.financials = {
      currency: n.currency,
      source: "yahoo",
      asOf: new Date().toISOString().slice(0, 10),
      totalRevenue: n.financials.totalRevenue,
      revenueGrowth: n.financials.revenueGrowth,
      grossMargins: n.financials.grossMargins,
      operatingMargins: n.financials.operatingMargins,
      ebitda: n.financials.ebitda,
      totalCash: n.financials.totalCash,
      totalDebt: n.financials.totalDebt,
      debtToEquity: n.financials.debtToEquity,
      freeCashflow: n.financials.freeCashflow,
      income: n.financials.income,
      balance: n.financials.balance,
      cashflow: n.financials.cashflow,
      earnings: n.financials.earnings,
    };
  }
  if (n.analyst?.numberOfAnalysts) next.analyst = n.analyst;
  if (n.esg) next.esg = n.esg;

  if (n.exchange && next.stock) next.stock.exchange = n.exchange;
  if (n.currency && next.stock) next.stock.currency = n.currency;
  if (n.symbol && next.stock) next.stock.ticker = n.symbol.split(".")[0];

  return next;
}

const INDUSTRY_MAP = {
  Technology: "technology",
  "Financial Services": "finance",
  Healthcare: "healthcare",
  Energy: "energy",
  "Basic Materials": "mining",
  "Consumer Cyclical": "consumer",
  "Consumer Defensive": "consumer",
  "Communication Services": "telecom",
  Industrials: "industrials",
  "Real Estate": "real_estate",
  Utilities: "utilities",
};

function mapIndustry(sector, industry) {
  if (!sector) return null;
  if (INDUSTRY_MAP[sector]) return INDUSTRY_MAP[sector];
  return String(sector).toLowerCase().replace(/[^a-z]+/g, "_");
}

function slugifyName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function logoUrlFor(profile, n) {
  if (n.profile.website) {
    try {
      const host = new URL(n.profile.website.startsWith("http") ? n.profile.website : `https://${n.profile.website}`).hostname.replace(/^www\./, "");
      return `https://logo.clearbit.com/${host}`;
    } catch {
      /* ignore */
    }
  }
  return profile.logoUrl || null;
}

function structuredPatch(slug, profile, n) {
  const ticker = n.symbol ? n.symbol.split(".")[0] : profile.stock?.ticker || null;
  return {
    slug,
    industry: mapIndustry(n.profile.sector, n.profile.industry) || null,
    country_code: countryToCode(n.profile.country) || profile.countryCode || null,
    headquarters: n.profile.address || null,
    employees: n.profile.employees || null,
    ticker,
    exchange: n.exchange || null,
    market_cap_usd: marketCapInUsd(n.keyStats.marketCap, n.currency) || null,
    website: n.profile.website || null,
    logo_url: logoUrlFor(profile, n),
    description: n.profile.summary?.slice(0, 1000) || null,
    enrichment_source: "yahoo",
    enriched_at: new Date().toISOString(),
  };
}

const FX_TO_USD = {
  USD: 1,
  EUR: 1.08,
  GBP: 1.27,
  NOK: 0.092,
  SEK: 0.095,
  DKK: 0.145,
  CHF: 1.13,
  CAD: 0.73,
  AUD: 0.65,
  JPY: 0.0067,
  CNY: 0.14,
  HKD: 0.128,
  INR: 0.012,
  BRL: 0.20,
};
function marketCapInUsd(value, currency) {
  if (!value || !Number.isFinite(value)) return null;
  const fx = FX_TO_USD[String(currency || "").toUpperCase()] || 1;
  return Math.round(value * fx);
}

const COUNTRY_NAME_TO_CODE = {
  "United States": "US",
  Norway: "NO",
  "United Kingdom": "GB",
  Sweden: "SE",
  Denmark: "DK",
  Finland: "FI",
  Germany: "DE",
  France: "FR",
  Netherlands: "NL",
  Switzerland: "CH",
  Italy: "IT",
  Spain: "ES",
  Belgium: "BE",
  Austria: "AT",
  Japan: "JP",
  "Hong Kong": "HK",
  China: "CN",
  Canada: "CA",
  Australia: "AU",
  India: "IN",
  Brazil: "BR",
  Ireland: "IE",
  Luxembourg: "LU",
  "South Korea": "KR",
  Singapore: "SG",
};
function countryToCode(name) {
  if (!name) return null;
  return COUNTRY_NAME_TO_CODE[name] || null;
}

function buildQuery(opts, offset) {
  let q = getAdminClient()
    .from("companies")
    .select("slug, profile_json, ticker, enriched_at")
    .order("slug")
    .range(offset, offset + PAGE - 1);
  if (opts.slug) q = q.eq("slug", opts.slug);
  if (opts.prefix) q = q.like("slug", `${opts.prefix}%`);
  if (opts.country) q = q.eq("country_code", opts.country);
  if (!opts.refresh) q = q.is("enriched_at", null);
  if (opts.skipUsStubs) q = q.not("slug", "like", "us-%");
  return q;
}

/** Async generator: yields rows in pages, never loads everything in memory. */
async function* iterateCandidates(opts) {
  let offset = 0;
  let yielded = 0;
  for (;;) {
    const { data, error } = await buildQuery(opts, offset);
    if (error) throw error;
    if (!data?.length) return;
    for (const row of data) {
      if (yielded >= opts.limit) return;
      yield row;
      yielded += 1;
    }
    if (data.length < PAGE) return;
    offset += PAGE;
  }
}

async function processOne(row) {
  const profile = row.profile_json || {};
  const sym = yahoo.yahooSymbol({ ...profile, ticker: row.ticker });
  if (!sym) return { slug: row.slug, status: "no-ticker" };

  let result;
  try {
    result = await yahoo.fetchFullProfile(sym);
  } catch (e) {
    return { slug: row.slug, status: "error", error: e.message };
  }
  if (!result) return { slug: row.slug, status: "not-found", symbol: sym };

  const n = yahoo.normalizeYahoo(result);
  if (!n?.profile?.sector && !n?.profile?.industry && !n?.profile?.summary) {
    return { slug: row.slug, status: "empty", symbol: sym };
  }

  const enrichedProfile = buildProfileEnrichment(profile, n);
  const patch = structuredPatch(row.slug, profile, n);
  patch.profile_json = enrichedProfile;

  const { error } = await getAdminClient().from("companies").update(patch).eq("slug", row.slug);
  if (error) return { slug: row.slug, status: "db-error", error: error.message };
  return { slug: row.slug, status: "ok", symbol: sym, sector: n.profile.sector, employees: n.profile.employees };
}

/** Stream rows through a fixed pool of workers; never loads all candidates into memory. */
async function streamPool(generator, concurrency, worker) {
  const iter = generator[Symbol.asyncIterator]();
  let active = 0;
  let done = false;
  const ctx = {};

  return new Promise((resolve, reject) => {
    const pump = async () => {
      if (done) return;
      while (active < concurrency) {
        let next;
        try {
          next = await iter.next();
        } catch (e) {
          done = true;
          reject(e);
          return;
        }
        if (next.done) {
          if (active === 0) {
            done = true;
            resolve();
          }
          return;
        }
        active += 1;
        Promise.resolve(worker(next.value, ctx))
          .catch((e) => console.error("worker error:", e))
          .finally(() => {
            active -= 1;
            pump();
          });
      }
    };
    pump();
  });
}

async function main() {
  if (!hasSupabaseWrites()) throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  const opts = parseArgs();
  console.log("Options:", opts);

  let processed = 0;
  let ok = 0, skip = 0, fail = 0;
  const t0 = Date.now();

  await streamPool(iterateCandidates(opts), opts.concurrency, async (row) => {
    const i = ++processed;
    if (opts.dryRun) {
      const sym = yahoo.yahooSymbol({ ...(row.profile_json || {}), ticker: row.ticker });
      if (i % 100 === 0) console.log(`[${i}] DRY ${row.slug} -> ${sym}`);
      return;
    }
    const r = await processOne(row);
    if (r.status === "ok") {
      ok++;
      if (ok % 10 === 0 || ok < 30) {
        const rate = (processed / ((Date.now() - t0) / 1000)).toFixed(1);
        console.log(`[${i}] OK ${row.slug} (${r.symbol}) ${r.sector || ""} ${r.employees ? r.employees + " emp" : ""} | rate=${rate}/s`);
      }
    } else if (r.status === "no-ticker" || r.status === "not-found" || r.status === "empty") {
      skip++;
      if (skip % 200 === 0) console.log(`[${i}] skip=${skip} ok=${ok}`);
    } else {
      fail++;
      console.warn(`[${i}] FAIL ${row.slug}: ${r.error || r.status}`);
      if (fail > 10 && fail / processed > 0.5) {
        throw new Error("too many failures, aborting");
      }
    }
  });

  console.log(`\nDone. ok=${ok} skip=${skip} fail=${fail} elapsed=${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
