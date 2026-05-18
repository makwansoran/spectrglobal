/**
 * Backfill profile_json.logoUrl for all companies in Supabase.
 *
 *   node scripts/backfill-company-logos.js              # fast: Finnhub CDN + Clearbit guess (no API)
 *   node scripts/backfill-company-logos.js --smart      # + Finnhub name search (slow, rate-limited)
 *   node scripts/backfill-company-logos.js --verify     # HEAD-check all candidates
 *   node scripts/backfill-company-logos.js --prefix nb- # only NBIM holdings
 *   node scripts/backfill-company-logos.js --refresh    # overwrite existing logoUrl
 */
require("./load-env").loadEnv();

const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const {
  defaultLogoUrl,
  resolveCompanyLogoUrl,
  resolveLogoViaNameSearch,
  applyLogoToProfile,
} = require("../server/company-logo");
const { buildMeta } = require("../server/local-store");

const PAGE = 150;
const FINNHUB_DELAY_MS = 350;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    limit: 0,
    slug: "",
    prefix: "",
    verify: false,
    smart: false,
    refresh: false,
    dryRun: false,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--verify") opts.verify = true;
    else if (a === "--smart") opts.smart = true;
    else if (a === "--refresh") opts.refresh = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (a === "--prefix" && args[i + 1]) opts.prefix = args[++i];
    else if (a.startsWith("--limit")) {
      const n = a.includes("=") ? a.split("=")[1] : args[++i];
      opts.limit = parseInt(n, 10) || 0;
    }
  }
  return opts;
}

function rowPatch(slug, profile, searchTerms) {
  const meta = buildMeta(profile);
  return {
    slug,
    name: profile.name,
    legal_name: profile.legalName,
    meta,
    initials: profile.logoInitials,
    search_terms: searchTerms || profile.searchTerms || [],
    profile_json: profile,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

async function resolveLogo(profile, opts) {
  if (opts.verify) return resolveCompanyLogoUrl(profile);
  if (opts.smart) {
    const fast = defaultLogoUrl(profile);
    if (fast) return fast;
    return resolveLogoViaNameSearch(profile);
  }
  return defaultLogoUrl(profile);
}

async function fetchPage(from, to, prefix) {
  let query = getAdminClient().from("companies").select("slug, profile_json, search_terms").order("slug");
  if (prefix) query = query.like("slug", `${prefix}%`);
  const { data, error } = await query.range(from, to);
  if (error) throw error;
  return data || [];
}

async function main() {
  if (!isSupabaseEnabled() || !hasSupabaseWrites()) {
    console.error("Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const opts = parseArgs();
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let from = 0;

  const mode = opts.verify ? "verify" : opts.smart ? "smart (Finnhub search)" : "fast (CDN + Clearbit guess)";
  console.log(`Backfilling logos [${mode}]${opts.prefix ? ` prefix=${opts.prefix}` : ""}…`);

  if (opts.slug) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json, search_terms")
      .eq("slug", opts.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Company not found:", opts.slug);
      process.exit(1);
    }
    const profile = data.profile_json || {};
    const logoUrl = await resolveLogo(profile, opts);
    if (logoUrl && (opts.refresh || logoUrl !== profile.logoUrl)) {
      const next = applyLogoToProfile(profile, logoUrl);
      if (!opts.dryRun) {
        await getAdminClient().from("companies").upsert(rowPatch(data.slug, next, data.search_terms), {
          onConflict: "slug",
        });
      }
      console.log(`${data.slug} → ${logoUrl}`);
    } else {
      console.log(`${data.slug}: no logo found`);
    }
    return;
  }

  while (true) {
    const rows = await fetchPage(from, from + PAGE - 1, opts.prefix);
    if (!rows.length) break;

    const batch = [];
    for (const row of rows) {
      if (opts.limit && processed >= opts.limit) break;
      processed++;

      const profile = row.profile_json || {};
      if (profile.logoUrl && !opts.refresh) {
        skipped++;
        continue;
      }

      if (opts.smart) await sleep(FINNHUB_DELAY_MS);
      const logoUrl = await resolveLogo(profile, opts);
      if (!logoUrl || (!opts.refresh && logoUrl === profile.logoUrl)) continue;

      batch.push(rowPatch(row.slug, applyLogoToProfile(profile, logoUrl), row.search_terms));
      updated++;
    }

    if (batch.length && !opts.dryRun) {
      const { error } = await getAdminClient().from("companies").upsert(batch, { onConflict: "slug" });
      if (error) throw error;
    }

    console.log(`  … ${processed} scanned, ${updated} logos set, ${skipped} already had logo`);
    if (opts.limit && processed >= opts.limit) break;
    if (rows.length < PAGE) break;
    from += PAGE;
  }

  console.log(`\nDone. ${updated} updated, ${skipped} skipped, ${processed} scanned.`);
  if (opts.dryRun) console.log("(dry run — no writes)");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
