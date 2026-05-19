/**
 * Build data/bank-registry.json from curated Oslo bank domains + institutions.json.
 * Run: node scripts/build-bank-registry.js
 */
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../data/bank-registry.json");
const INSTITUTIONS = path.join(__dirname, "../data/institutions.json");

/** slug → { website, logoDomain, about?, headquarters?, founded? } */
const OSLO_BANKS = {
  "aasen-sparebank-aasb": { logoDomain: "aasensparebank.no", about: "Regional sparebank serving Aasen and surrounding areas in Innlandet." },
  "aurskog-sparebank-aurg": { logoDomain: "aurskog-sparebank.no", about: "Local sparebank in Aurskog-Høland, Viken." },
  "bien-sparebank-asa-bien": { logoDomain: "biensparebank.no", about: "Norwegian sparebank (Bien Sparebank ASA), Oslo Børs listed." },
  "dnb-bank-asa-dnb": {
    logoDomain: "dnb.no",
    about: "DNB is Norway's largest financial services group — banking, financing, pensions, and asset management.",
    headquarters: "Oslo, Norway",
    founded: 1822,
  },
  "flekkefjord-sparebank-ffsb": { logoDomain: "sparebank1.no", about: "Sparebank 1 Flekkefjord — regional bank in Agder." },
  "grong-sparebank-grong": { logoDomain: "grong-sparebank.no", about: "Regional sparebank in Grong, Trøndelag." },
  "h-land-og-setskog-sparebank-hspg": { logoDomain: "hssb.no", about: "Sparebank for Høland og Setskog (Akershus)." },
  "haugesund-sparebank-hgsb": { logoDomain: "haugesund-sparebank.no", about: "Regional sparebank in Haugesund, Rogaland." },
  "instabank-asa-insta": {
    logoDomain: "instabank.no",
    about: "Digital consumer bank offering deposits and loans in the Nordics.",
    headquarters: "Oslo, Norway",
  },
  "j-ren-sparebank-jaren": { logoDomain: "jaren-sparebank.no", about: "Local sparebank in Jæren, Rogaland." },
  "kraft-bank-asa-krab": {
    logoDomain: "kraftbank.no",
    about: "Norwegian business bank focused on growth companies and entrepreneurs.",
    headquarters: "Kristiansand, Norway",
  },
  "melhus-sparebank-melg": { logoDomain: "melhusbanken.no", about: "Regional sparebank in Melhus, Trøndelag." },
  "nidaros-sparebank-nisb": { logoDomain: "nidaros-sparebank.no", about: "Sparebank in Trondheim / Trøndelag." },
  "pareto-bank-asa-parb": {
    logoDomain: "paretobank.no",
    about: "Norwegian niche bank — deposits, lending, and investment services.",
    headquarters: "Oslo, Norway",
  },
  "rogaland-sparebank-rogs": { logoDomain: "rogaland-sparebank.no", about: "Regional sparebank in Rogaland." },
  "romerike-sparebank-romer": { logoDomain: "romerike-sparebank.no", about: "Sparebank serving Romerike, Viken." },
  "skue-sparebank-skue": { logoDomain: "skuesparebank.no", about: "Local sparebank in Skue, Vestfold og Telemark." },
  "sogn-sparebank-sogn": { logoDomain: "sognbanken.no", about: "Regional sparebank in Sogn og Fjordane / Vestland." },
  "sparebank-1-helgeland-helg": { logoDomain: "sparebank1.no", about: "SpareBank 1 Helgeland — Nordland region." },
  "sparebank-1-nord-norge-nong": { logoDomain: "sparebank1.no", about: "SpareBank 1 Nord-Norge — banking across Northern Norway." },
  "sparebank-1-nordm-re-snor": { logoDomain: "sparebank1.no", about: "SpareBank 1 Nordmøre — Møre og Romsdal." },
  "sparebank-1-ringerike-hadeland-ring": { logoDomain: "sparebank1.no", about: "SpareBank 1 Ringerike Hadeland." },
  "sparebank-1-s-r-norge-asa-sb1no": {
    logoDomain: "sparebank1.no",
    about: "SpareBank 1 SR-Bank — Norway's largest sparebank alliance member, Rogaland focus.",
    headquarters: "Stavanger, Norway",
  },
  "sparebank-1-smn-ming": { logoDomain: "sparebank1.no", about: "SpareBank 1 SMN — Trøndelag and Møre." },
  "sparebank-1-stfold-akershus-soag": { logoDomain: "sparebank1.no", about: "SpareBank 1 Østfold Akershus." },
  "sparebank-1-stlandet-spol": { logoDomain: "sparebank1.no", about: "SpareBank 1 Sørlandet — Agder." },
  "sparebank-68-nord-sb68": { logoDomain: "sb68.no", about: "Sparebank 68° Nord — Troms og Finnmark." },
  "sparebanken-m-re-morg": { logoDomain: "sparebank1.no", about: "Sparebanken Møre — part of SpareBank 1 alliance." },
  "sparebanken-norge-sbnor": {
    logoDomain: "sparebanken.no",
    about: "Sparebanken Norge — nationwide retail bank from the former Eika alliance.",
    headquarters: "Bergen, Norway",
  },
  "sparebanken-st-spog": { logoDomain: "sparebank1.no", about: "Sparebanken Sør — part of SpareBank 1 (formerly Sparebanken Sør)." },
  "tinde-sparebank-tinde": { logoDomain: "tinde.no", about: "Tinde Sparebank in Vestland." },
  "tr-ndelag-sparebank-trsb": { logoDomain: "trondelag-sparebank.no", about: "Trøndelag Sparebank — regional bank in Trøndelag." },
  "voss-veksel-og-landmandsbank-asa-vvl": {
    logoDomain: "vossabanken.no",
    about: "Voss Veksel- og Landmandsbank — regional bank in Voss, Vestland.",
  },
};

function entryFromDomain(slug, spec) {
  const domain = spec.logoDomain;
  const website = spec.website || `https://www.${domain}`;
  return {
    slug,
    website,
    logoDomain: domain,
    countryCode: "NO",
    countryName: "Norway",
    ...spec,
  };
}

function main() {
  const bySlug = {};

  for (const [slug, spec] of Object.entries(OSLO_BANKS)) {
    bySlug[slug] = entryFromDomain(slug, spec);
  }

  const institutions = JSON.parse(fs.readFileSync(INSTITUTIONS, "utf8"));
  for (const inst of institutions) {
    if (inst.orgType !== "bank") continue;
    const slug = inst.companySlug;
    if (!slug || bySlug[slug]) continue;
    bySlug[slug] = {
      slug,
      website: inst.website,
      logoDomain: inst.logoDomain,
      about: inst.about,
      countryCode: "US",
      countryName: "United States",
      institutionSlug: inst.slug,
    };
  }

  const list = Object.values(bySlug).sort((a, b) => a.slug.localeCompare(b.slug));
  fs.writeFileSync(OUT, JSON.stringify({ version: 1, banks: list }, null, 2));
  console.log(`Wrote ${list.length} banks → ${OUT}`);
}

main();
