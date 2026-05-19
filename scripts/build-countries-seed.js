/**
 * Generate data/countries/*.json and empty data/politicians/{country}.json stubs.
 *
 *   node scripts/build-countries-seed.js
 */
const fs = require("fs");
const path = require("path");
const { COUNTRY_TO_ISO, countrySlug } = require("../server/country-codes");
const { seedToCountryProfile } = require("../server/country-utils");

const ROOT = path.resolve(__dirname, "..");
const COUNTRIES_DIR = path.join(ROOT, "data", "countries");
const POLITICIANS_DIR = path.join(ROOT, "data", "politicians");

const CAPITALS = {
  Australia: "Canberra",
  Austria: "Vienna",
  Bangladesh: "Dhaka",
  Belgium: "Brussels",
  Brazil: "Brasília",
  Canada: "Ottawa",
  Chile: "Santiago",
  China: "Beijing",
  Colombia: "Bogotá",
  "Czech Republic": "Prague",
  Denmark: "Copenhagen",
  Egypt: "Cairo",
  Finland: "Helsinki",
  France: "Paris",
  Germany: "Berlin",
  Greece: "Athens",
  "Hong Kong": "Hong Kong",
  Hungary: "Budapest",
  India: "New Delhi",
  Indonesia: "Jakarta",
  Ireland: "Dublin",
  Israel: "Jerusalem",
  Italy: "Rome",
  Japan: "Tokyo",
  Jordan: "Amman",
  Kenya: "Nairobi",
  Kuwait: "Kuwait City",
  Kyrgyzstan: "Bishkek",
  Latvia: "Riga",
  Liechtenstein: "Vaduz",
  Lithuania: "Vilnius",
  Malaysia: "Kuala Lumpur",
  Mexico: "Mexico City",
  Morocco: "Rabat",
  Netherlands: "Amsterdam",
  "New Zealand": "Wellington",
  Panama: "Panama City",
  Peru: "Lima",
  Philippines: "Manila",
  Poland: "Warsaw",
  Portugal: "Lisbon",
  Qatar: "Doha",
  Romania: "Bucharest",
  Russia: "Moscow",
  Singapore: "Singapore",
  Slovenia: "Ljubljana",
  "South Africa": "Pretoria",
  "South Korea": "Seoul",
  Spain: "Madrid",
  "Sri Lanka": "Sri Jayawardenepura Kotte",
  Sweden: "Stockholm",
  Switzerland: "Bern",
  Taiwan: "Taipei",
  Thailand: "Bangkok",
  Türkiye: "Ankara",
  Turkey: "Ankara",
  Ukraine: "Kyiv",
  "United Arab Emirates": "Abu Dhabi",
  "United Kingdom": "London",
  "United States": "Washington, D.C.",
  Vietnam: "Hanoi",
  Norway: "Oslo",
};

function main() {
  fs.mkdirSync(COUNTRIES_DIR, { recursive: true });
  fs.mkdirSync(POLITICIANS_DIR, { recursive: true });

  const seen = new Set();
  let n = 0;

  for (const [name, iso] of Object.entries(COUNTRY_TO_ISO)) {
    if (iso === "TR" && name === "Turkey") continue;
    const slug = countrySlug(name, iso);
    if (seen.has(slug)) continue;
    seen.add(slug);

    const profile = seedToCountryProfile({
      slug,
      name,
      isoCode: iso,
      profile: {
        capital: CAPITALS[name] || "",
        about: "",
        searchTerms: [name.toLowerCase(), iso.toLowerCase(), slug],
      },
    });

    const countryFile = path.join(COUNTRIES_DIR, `${slug}.json`);
    fs.writeFileSync(
      countryFile,
      `${JSON.stringify({ slug, profile, mapGeojson: null }, null, 2)}\n`
    );

    const polFile = path.join(POLITICIANS_DIR, `${slug}.json`);
    if (!fs.existsSync(polFile)) {
      fs.writeFileSync(
        polFile,
        `${JSON.stringify({ countrySlug: slug, politicians: [] }, null, 2)}\n`
      );
    }

    n++;
  }

  console.log(`Wrote ${n} countries → ${COUNTRIES_DIR}`);
  console.log(`Politician stubs → ${POLITICIANS_DIR}`);
}

main();
