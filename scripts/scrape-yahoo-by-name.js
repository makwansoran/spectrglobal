/**
 * Scrape Yahoo Finance for companies WITHOUT a known ticker.
 * Uses Yahoo's symbol search to resolve "{company name}" → symbol,
 * then runs the same enrichment as scrape-yahoo-companies.
 *
 *   node scripts/scrape-yahoo-by-name.js                  # all enriched_at IS NULL with no ticker
 *   node scripts/scrape-yahoo-by-name.js --prefix nb-     # NBIM portfolio only
 *   node scripts/scrape-yahoo-by-name.js --limit 100      # cap rows
 *   node scripts/scrape-yahoo-by-name.js --concurrency 4
 */
require("./load-env").loadEnv();

const { getAdminClient, hasSupabaseWrites } = require("../server/supabase-client");
const yahoo = require("../server/yahoo-finance");

const PAGE = 200;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { prefix: null, limit: Infinity, concurrency: 3, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (a === "--limit" && args[i + 1]) opts.limit = parseInt(args[++i], 10);
    else if (a === "--concurrency" && args[i + 1]) opts.concurrency = parseInt(args[++i], 10);
    else if (a === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

const SUFFIX_BY_COUNTRY = {
  NO: ".OL", GB: ".L", SE: ".ST", DK: ".CO", FI: ".HE",
  DE: ".DE", FR: ".PA", NL: ".AS", CH: ".SW", IT: ".MI",
  ES: ".MC", BE: ".BR", AT: ".VI", PT: ".LS", IE: ".IR",
  JP: ".T", HK: ".HK", CN: ".SS", TW: ".TW", KR: ".KS",
  CA: ".TO", AU: ".AX", IN: ".NS", BR: ".SA", MX: ".MX",
  ZA: ".JO", IL: ".TA", TH: ".BK", ID: ".JK", PH: ".PS",
  MY: ".KL", SG: ".SI", TR: ".IS", NZ: ".NZ", PL: ".WA",
};

function pickBestQuoteForCountry(quotes, countryCode) {
  if (!quotes?.length) return null;
  const cc = String(countryCode || "").toUpperCase();
  const wantSuffix = SUFFIX_BY_COUNTRY[cc];

  if (wantSuffix) {
    const match = quotes.find((q) => String(q.symbol || "").toUpperCase().endsWith(wantSuffix));
    if (match) return match;
  }
  // Otherwise: prefer EQUITY type, then highest-volume listing
  const eq = quotes.filter((q) => q.quoteType === "EQUITY" || q.typeDisp === "Equity");
  return eq[0] || quotes[0];
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

function mapIndustry(sector) {
  if (!sector) return null;
  return INDUSTRY_MAP[sector] || String(sector).toLowerCase().replace(/[^a-z]+/g, "_");
}

const FX_TO_USD = {
  USD: 1, EUR: 1.08, GBP: 1.27, NOK: 0.092, SEK: 0.095, DKK: 0.145,
  CHF: 1.13, CAD: 0.73, AUD: 0.65, JPY: 0.0067, CNY: 0.14, HKD: 0.128,
  INR: 0.012, BRL: 0.20, KRW: 0.00072, TWD: 0.031, ZAR: 0.054,
  IDR: 0.000063, THB: 0.028, MXN: 0.050, ILS: 0.27, TRY: 0.029,
};
function marketCapInUsd(value, currency) {
  if (!value || !Number.isFinite(value)) return null;
  const fx = FX_TO_USD[String(currency || "").toUpperCase()] || 1;
  return Math.round(value * fx);
}

function logoUrlFor(profile, n) {
  if (n.profile.website) {
    try {
      const host = new URL(n.profile.website.startsWith("http") ? n.profile.website : `https://${n.profile.website}`)
        .hostname.replace(/^www\./, "");
      return `https://logo.clearbit.com/${host}`;
    } catch {
      /* ignore */
    }
  }
  return profile.logoUrl || null;
}

function slugifyName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildProfileEnrichment(profile, n) {
  const next = { ...profile };
  if (n.profile.sector) next.sector = n.profile.sector;
  if (n.profile.industry) next.industry = mapIndustry(n.profile.sector);
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
      id: slugifyName(e.name), personSlug: slugifyName(e.name),
      name: e.name, title: e.title, sortOrder: i,
      totalPay: e.totalPay, yearBorn: e.yearBorn,
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
  if (n.financials.income.annual?.length) {
    next.financials = {
      currency: n.currency, source: "yahoo",
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

  next.stock = next.stock || {};
  if (n.symbol) next.stock.ticker = n.symbol.split(".")[0];
  if (n.exchange) next.stock.exchange = n.exchange;
  if (n.currency) next.stock.currency = n.currency;
  return next;
}

const COUNTRY_NAME_TO_CODE = {
  "United States": "US", Norway: "NO", "United Kingdom": "GB", Sweden: "SE",
  Denmark: "DK", Finland: "FI", Germany: "DE", France: "FR", Netherlands: "NL",
  Switzerland: "CH", Italy: "IT", Spain: "ES", Belgium: "BE", Austria: "AT",
  Japan: "JP", "Hong Kong": "HK", China: "CN", Canada: "CA", Australia: "AU",
  India: "IN", Brazil: "BR", Ireland: "IE", Luxembourg: "LU", "South Korea": "KR",
  Singapore: "SG", "South Africa": "ZA", Israel: "IL", Thailand: "TH",
  Indonesia: "ID", Philippines: "PH", Malaysia: "MY", Turkey: "TR",
  Taiwan: "TW", Mexico: "MX", "New Zealand": "NZ", Poland: "PL",
};
function countryToCode(name) {
  if (!name) return null;
  return COUNTRY_NAME_TO_CODE[name] || null;
}

function structuredPatch(slug, profile, n) {
  const ticker = n.symbol ? n.symbol.split(".")[0] : null;
  return {
    slug,
    industry: mapIndustry(n.profile.sector) || null,
    country_code: countryToCode(n.profile.country) || profile.countryCode || null,
    headquarters: n.profile.address || null,
    employees: n.profile.employees || null,
    ticker,
    exchange: n.exchange || null,
    market_cap_usd: marketCapInUsd(n.keyStats.marketCap, n.currency) || null,
    website: n.profile.website || null,
    logo_url: logoUrlFor(profile, n),
    description: n.profile.summary?.slice(0, 1000) || null,
    enrichment_source: "yahoo-search",
    enriched_at: new Date().toISOString(),
  };
}

async function processRow(row) {
  const profile = row.profile_json || {};
  const name = profile.legalName || profile.name || row.name;
  const cc = profile.countryCode || row.country_code;
  if (!name || name.length < 3) return { slug: row.slug, status: "no-name" };

  let quotes;
  try {
    quotes = await yahoo.searchSymbol(`${name} ${cc || ""}`.trim());
  } catch (e) {
    return { slug: row.slug, status: "search-error", error: e.message };
  }
  const best = pickBestQuoteForCountry(quotes, cc);
  if (!best?.symbol) return { slug: row.slug, status: "no-match" };

  let result;
  try {
    result = await yahoo.fetchFullProfile(best.symbol);
  } catch (e) {
    return { slug: row.slug, status: "fetch-error", error: e.message, symbol: best.symbol };
  }
  if (!result) return { slug: row.slug, status: "not-found", symbol: best.symbol };

  const n = yahoo.normalizeYahoo(result);
  if (!n?.profile?.sector && !n?.profile?.summary) {
    return { slug: row.slug, status: "empty", symbol: best.symbol };
  }

  const enrichedProfile = buildProfileEnrichment(profile, n);
  const patch = structuredPatch(row.slug, profile, n);
  patch.profile_json = enrichedProfile;

  const { error } = await getAdminClient().from("companies").update(patch).eq("slug", row.slug);
  if (error) return { slug: row.slug, status: "db-error", error: error.message };

  return { slug: row.slug, status: "ok", symbol: best.symbol, sector: n.profile.sector, employees: n.profile.employees };
}

function buildQuery(opts, offset) {
  let q = getAdminClient()
    .from("companies")
    .select("slug, name, country_code, profile_json")
    .is("enriched_at", null)
    .is("ticker", null)
    .order("slug")
    .range(offset, offset + PAGE - 1);
  if (opts.prefix) q = q.like("slug", `${opts.prefix}%`);
  return q;
}

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

async function streamPool(gen, concurrency, worker) {
  const iter = gen[Symbol.asyncIterator]();
  let active = 0;
  return new Promise((resolve, reject) => {
    const pump = async () => {
      while (active < concurrency) {
        let next;
        try { next = await iter.next(); } catch (e) { reject(e); return; }
        if (next.done) {
          if (active === 0) resolve();
          return;
        }
        active += 1;
        Promise.resolve(worker(next.value))
          .catch((e) => console.error("worker:", e))
          .finally(() => { active -= 1; pump(); });
      }
    };
    pump();
  });
}

async function main() {
  if (!hasSupabaseWrites()) throw new Error("SUPABASE_SERVICE_ROLE_KEY required");
  const opts = parseArgs();
  console.log("Options:", opts);

  let processed = 0, ok = 0, skip = 0, fail = 0;
  const t0 = Date.now();

  await streamPool(iterateCandidates(opts), opts.concurrency, async (row) => {
    const i = ++processed;
    const r = await processRow(row);
    if (r.status === "ok") {
      ok++;
      if (ok % 10 === 0 || ok < 30) {
        const rate = (processed / ((Date.now() - t0) / 1000)).toFixed(1);
        console.log(`[${i}] OK ${row.slug} -> ${r.symbol} ${r.sector || ""} ${r.employees ? r.employees + " emp" : ""} | rate=${rate}/s`);
      }
    } else if (["no-name", "no-match", "not-found", "empty"].includes(r.status)) {
      skip++;
      if (skip % 200 === 0) console.log(`[${i}] skip=${skip} ok=${ok}`);
    } else {
      fail++;
      console.warn(`[${i}] FAIL ${row.slug}: ${r.status} ${r.error || ""}`);
    }
  });

  console.log(`\nDone. ok=${ok} skip=${skip} fail=${fail} elapsed=${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

main().catch((e) => { console.error("FATAL:", e); process.exit(1); });
