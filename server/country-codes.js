/** English country name → ISO 3166-1 alpha-2 (NBIM holdings report). */
const COUNTRY_TO_ISO = {
  Australia: "AU",
  Austria: "AT",
  Bangladesh: "BD",
  Belgium: "BE",
  Brazil: "BR",
  Canada: "CA",
  Chile: "CL",
  China: "CN",
  Colombia: "CO",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Egypt: "EG",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Greece: "GR",
  "Hong Kong": "HK",
  Hungary: "HU",
  India: "IN",
  Indonesia: "ID",
  Ireland: "IE",
  Israel: "IL",
  Italy: "IT",
  Japan: "JP",
  Jordan: "JO",
  Kenya: "KE",
  Kuwait: "KW",
  Kyrgyzstan: "KG",
  Latvia: "LV",
  Liechtenstein: "LI",
  Lithuania: "LT",
  Malaysia: "MY",
  Mexico: "MX",
  Morocco: "MA",
  Norway: "NO",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Panama: "PA",
  Peru: "PE",
  Philippines: "PH",
  Poland: "PL",
  Portugal: "PT",
  Qatar: "QA",
  Romania: "RO",
  Russia: "RU",
  Singapore: "SG",
  Slovenia: "SI",
  "South Africa": "ZA",
  "South Korea": "KR",
  Spain: "ES",
  "Sri Lanka": "LK",
  Sweden: "SE",
  Switzerland: "CH",
  Taiwan: "TW",
  Thailand: "TH",
  Türkiye: "TR",
  Turkey: "TR",
  Ukraine: "UA",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  Vietnam: "VN",
};

function countryNameToCode(countryName) {
  const name = String(countryName || "").trim();
  return COUNTRY_TO_ISO[name] || "XX";
}

function countryCodeToName(code) {
  const cc = String(code || "").toUpperCase();
  for (const [name, iso] of Object.entries(COUNTRY_TO_ISO)) {
    if (iso === cc) return name;
  }
  return cc === "XX" ? "Unknown" : cc;
}

function slugifyCountryName(name) {
  return String(name || "country")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/** URL slug: norway-no */
function countrySlug(name, isoCode) {
  const iso = String(isoCode || "").toLowerCase();
  const base = slugifyCountryName(name);
  if (!iso || iso === "xx") return base;
  if (base.endsWith(`-${iso}`)) return base;
  return `${base}-${iso}`;
}

module.exports = {
  COUNTRY_TO_ISO,
  countryNameToCode,
  countryCodeToName,
  slugifyCountryName,
  countrySlug,
};
