/**
 * Backfill profile_json.logoUrl for all companies in Supabase.
 * Uses Finnhub official logo CDN (and optional profile2 / Clearbit fallbacks).
 *
 *   node scripts/backfill-company-logos.js
 *   node scripts/backfill-company-logos.js --limit 500
 *   node scripts/backfill-company-logos.js --slug equinor
 *   node scripts/backfill-company-logos.js --verify   # HEAD-check URLs (slower)
 */
require("./load-env").loadEnv();

const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("../server/supabase-client");
const {
  defaultLogoUrl,
  resolveCompanyLogoUrl,
  applyLogoToProfile,
} = require("../server/company-logo");
const { buildMeta } = require("../server/local-store");

const PAGE = 200;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { limit: 0, slug: "", verify: false, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--verify") opts.verify = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--slug" && args[i + 1]) opts.slug = args[++i];
    else if (a.startsWith("--limit")) {
      const n = a.includes("=") ? a.split("=")[1] : args[++i];
      opts.limit = parseInt(n, 10) || 0;
    }
  }
  return opts;
}

function rowPatch(slug, profile) {
  const meta = buildMeta(profile);
  return {
    slug,
    name: profile.name,
    legal_name: profile.legalName,
    meta,
    initials: profile.logoInitials,
    search_terms: profile.searchTerms || [],
    profile_json: profile,
    updated_at: profile.lastUpdated || new Date().toISOString(),
  };
}

async function fetchPage(from, to) {
  const { data, error } = await getAdminClient()
    .from("companies")
    .select("slug, profile_json")
    .order("slug")
    .range(from, to);
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

  console.log(
    opts.verify
      ? "Backfilling logos (verify URLs + Finnhub API fallback)…"
      : "Backfilling logos (Finnhub static CDN by ticker)…"
  );

  if (opts.slug) {
    const { data, error } = await getAdminClient()
      .from("companies")
      .select("slug, profile_json")
      .eq("slug", opts.slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      console.error("Company not found:", opts.slug);
      process.exit(1);
    }
    const profile = data.profile_json || {};
    const logoUrl = opts.verify
      ? await resolveCompanyLogoUrl(profile)
      : defaultLogoUrl(profile);
    if (logoUrl && logoUrl !== profile.logoUrl) {
      const next = applyLogoToProfile(profile, logoUrl);
      if (!opts.dryRun) {
        const { error: upErr } = await getAdminClient()
          .from("companies")
          .upsert(rowPatch(data.slug, next), { onConflict: "slug" });
        if (upErr) throw upErr;
      }
      console.log(`${data.slug} → ${logoUrl}`);
      updated++;
    } else {
      console.log(`${data.slug}: already set or no logo found`);
    }
    return;
  }

  while (true) {
    const rows = await fetchPage(from, from + PAGE - 1);
    if (!rows.length) break;

    const batch = [];
    for (const row of rows) {
      if (opts.limit && processed >= opts.limit) break;
      processed++;

      const profile = row.profile_json || {};
      if (profile.logoUrl) {
        skipped++;
        continue;
      }

      const logoUrl = opts.verify
        ? await resolveCompanyLogoUrl(profile)
        : defaultLogoUrl(profile);

      if (!logoUrl || logoUrl === profile.logoUrl) continue;

      batch.push(rowPatch(row.slug, applyLogoToProfile(profile, logoUrl)));
      updated++;
    }

    if (batch.length && !opts.dryRun) {
      const { error } = await getAdminClient().from("companies").upsert(batch, { onConflict: "slug" });
      if (error) throw error;
    }

    console.log(`  … ${processed} scanned, ${updated} with logos, ${skipped} already had logo`);
    if (opts.limit && processed >= opts.limit) break;
    if (rows.length < PAGE) break;
    from += PAGE;
  }

  console.log(`\nDone. ${updated} companies updated, ${skipped} skipped (had logo), ${processed} scanned.`);
  if (opts.dryRun) console.log("(dry run — no writes)");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
