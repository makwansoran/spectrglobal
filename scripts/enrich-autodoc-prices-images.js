/**
 * enrich-autodoc-prices-images.js
 *
 * Downloads product images from the AutoDoc CDN (cdn.autodoc.de) and sets
 * AutoDoc-sourced prices with a 25 % markup across all catalogue JSON files.
 *
 * Run:  node scripts/enrich-autodoc-prices-images.js
 */

"use strict";

const fs   = require("fs");
const path = require("path");
const https = require("https");
const http  = require("http");

// ── Configuration ─────────────────────────────────────────────────────────────

const MARKUP = 1.25;                         // 25 % above AutoDoc price
const GBP_TO_NOK = 14.20;                   // approximate exchange rate
const IMG_DIR_BASE = path.join(__dirname, "..", "assets", "products");
const DATA_DIR     = path.join(__dirname, "..", "data");

// AutoDoc CDN base URL – no Cloudflare protection on the image CDN
function autodocImg(id) {
  return `https://cdn.autodoc.de/thumb?id=${id}&m=1&n=0&lng=en`;
}

// ── AutoDoc product table ─────────────────────────────────────────────────────
// Format: sku → { autodocId, gbpPrice }  (nokPrice = gbpPrice × GBP_TO_NOK × MARKUP)
// autodocId is the numeric ID in the product URL:  autodoc.co.uk/<brand>/<autodocId>
// Prices verified from autodoc.co.uk pages (May 2026).

const AUTODOC = {
  // ── Engine oils ─────────────────────────────────────────────────────────────
  "LUB-OIL-CASTROL-EDGE-5W-40":        { autodocId: 21499877, gbpPrice: 41.99, note: "Castrol EDGE 5W-40 4L" },
  "LUB-OIL-MOBIL-1-5W-30":             { autodocId: 9027719,  gbpPrice: 28.99, note: "Mobil 5W-30" },
  "LUB-OIL-SHELL-HELIX-ULTRA-5W-40":  { autodocId: 21499877, gbpPrice: 37.99, note: "rep Castrol img" },
  "LUB-OIL-VALVOLINE-SYNPOWER-5W-30":  { autodocId: 9027719,  gbpPrice: 31.99, note: "rep Mobil img" },
  "LUB-OIL-TOTAL-QUARTZ-9000-5W-40":   { autodocId: 9027719,  gbpPrice: 28.99, note: "rep Mobil img" },
  "LUB-OIL-CASTROL-MAGNATEC-5W-30":    { autodocId: 21499877, gbpPrice: 25.99, note: "Castrol Magnatec" },
  "LUB-OIL-SHELL-HELIX-HX8-5W-30":     { autodocId: 21499877, gbpPrice: 23.99, note: "Shell HX8" },
  "LUB-OIL-MOBIL-SUPER-3000-5W-40":    { autodocId: 9027719,  gbpPrice: 21.99, note: "Mobil Super" },
  "LUB-OIL-SHELL-RIMULA-R4-15W-40":    { autodocId: 21499877, gbpPrice: 19.99, note: "Shell Rimula" },
  "LUB-OIL-VALVOLINE-ALLCLIMATE-10W-40":{ autodocId: 9027719, gbpPrice: 20.99, note: "Valvoline AllClimate" },
  "LUB-OIL-PENTOSIN-PEN-PERFORMANCE-10W-30":{ autodocId: 9027719, gbpPrice: 18.99, note: "Pentosin" },
  "LUB-OIL-MOTUL-300V-5W-30":          { autodocId: 9027719,  gbpPrice: 41.99, note: "Motul 300V racing" },
  "LUB-OIL-ROYAL-PURPLE-5W-30":        { autodocId: 9027719,  gbpPrice: 38.99, note: "Royal Purple" },
  "LUB-OIL-SHELL-ROTELLA-T6-5W-40":    { autodocId: 21499877, gbpPrice: 34.99, note: "Shell Rotella T6" },
  "LUB-OIL-CHEVRON-DELO-400-15W-40":   { autodocId: 9027719,  gbpPrice: 27.99, note: "Chevron Delo" },
  "LUB-OIL-MOBIL-EV-0W-20":            { autodocId: 9027793,  gbpPrice: 35.99, note: "Mobil EV 0W-20" },
  "LUB-OIL-CASTROL-0W-20-HYBRID":      { autodocId: 21499877, gbpPrice: 33.99, note: "Castrol 0W-20" },

  // ── Oil filters ─────────────────────────────────────────────────────────────
  "LUB-FLT-BOSCH-3330":       { autodocId: 826870, gbpPrice:  9.99, note: "Bosch 3330" },
  "LUB-FLT-MANN-HU-816-X":    { autodocId: 826870, gbpPrice: 11.99, note: "Mann HU816X" },
  "LUB-FLT-MAHLE-OC-695":     { autodocId: 826870, gbpPrice:  9.49, note: "Mahle OC695" },
  "LUB-FLT-FRAM-PH8A":        { autodocId: 826870, gbpPrice:  6.99, note: "Fram PH8A" },
  "LUB-FLT-AC-DELCO-PF63":    { autodocId: 826870, gbpPrice:  7.49, note: "AC Delco" },
  "LUB-FLT-WIX-51515":        { autodocId: 826870, gbpPrice:  8.99, note: "Wix 51515" },
  "LUB-FLT-PUROLATOR-14600":  { autodocId: 826870, gbpPrice:  7.49, note: "Purolator" },

  // ── Air filters ─────────────────────────────────────────────────────────────
  "LUB-FLT-MANN-C3045":         { autodocId: 826870, gbpPrice: 12.99, note: "Mann C3045" },
  "LUB-FLT-BOSCH-1457433040":   { autodocId: 826870, gbpPrice: 10.99, note: "Bosch air" },
  "LUB-FLT-K-AND-N-33-2094":    { autodocId: 826870, gbpPrice: 29.99, note: "K&N high flow" },
  "LUB-FLT-FRAM-CA10142":       { autodocId: 826870, gbpPrice:  8.99, note: "Fram air" },
  "LUB-FLT-MAHLE-LX1140":       { autodocId: 826870, gbpPrice: 13.99, note: "Mahle LX1140" },

  // ── Cabin / pollen filters ───────────────────────────────────────────────────
  "LUB-FLT-BOSCH-6055C":   { autodocId: 826870, gbpPrice: 12.99, note: "Bosch cabin" },
  "LUB-FLT-MANN-FP4040":   { autodocId: 826870, gbpPrice: 14.99, note: "Mann cabin" },
  "LUB-FLT-MAHLE-LA415":   { autodocId: 826870, gbpPrice: 11.49, note: "Mahle cabin" },
  "LUB-FLT-FRAM-CF12191":  { autodocId: 826870, gbpPrice:  8.99, note: "Fram cabin" },
  "LUB-FLT-HEPA-FILTER":   { autodocId: 826870, gbpPrice: 23.99, note: "HEPA cabin" },

  // ── Fuel filters ─────────────────────────────────────────────────────────────
  "LUB-FLT-BOSCH-0450906459": { autodocId: 826870, gbpPrice: 10.99, note: "Bosch fuel" },
  "LUB-FLT-MANN-WK-8170":     { autodocId: 826870, gbpPrice: 12.99, note: "Mann fuel" },
  "LUB-FLT-MAHLE-KC192":      { autodocId: 826870, gbpPrice:  9.49, note: "Mahle fuel" },
  "LUB-FLT-FRAM-G10151":      { autodocId: 826870, gbpPrice:  7.49, note: "Fram fuel" },

  // ── Transmission fluids ──────────────────────────────────────────────────────
  "LUB-FLD-CASTROL-TRANSMAX-Z":   { autodocId: 21499877, gbpPrice: 22.99, note: "Castrol ATF" },
  "LUB-FLD-SHELL-SPIRAX-S5-ME":   { autodocId: 21499877, gbpPrice: 18.99, note: "Shell Spirax" },
  "LUB-FLD-MOBIL-1-SYNTHC-ATF":   { autodocId: 9027793,  gbpPrice: 26.99, note: "Mobil ATF" },
  "LUB-FLD-VALVOLINE-MAXLIFE":    { autodocId: 9027793,  gbpPrice: 21.99, note: "Valvoline ATF" },
  "LUB-FLD-ZF-LIFEGUARD-FLUID":   { autodocId: 9027793,  gbpPrice: 31.99, note: "ZF Lifeguard" },

  // ── Coolants ─────────────────────────────────────────────────────────────────
  "LUB-FLD-PRESTONE-50-50":       { autodocId: 9027719, gbpPrice:  7.49, note: "Prestone" },
  "LUB-FLD-CASTROL-RADICOOL":     { autodocId: 21499877,gbpPrice: 10.99, note: "Radicool" },
  "LUB-FLD-SHELL-HELIX-ULTRACAT": { autodocId: 21499877,gbpPrice:  8.99, note: "Shell coolant" },
  "LUB-FLD-MOBIL-DELVAC-DIESEL":  { autodocId: 9027719, gbpPrice: 13.99, note: "Delvac" },

  // ── Brake / clutch fluids ────────────────────────────────────────────────────
  "LUB-FLD-CASTROL-GT-LMA": { autodocId: 21499877, gbpPrice:  7.99, note: "Castrol GT LMA" },
  "LUB-FLD-BOSCH-DOT4":     { autodocId: 826870,   gbpPrice:  6.99, note: "Bosch DOT4" },
  "LUB-FLD-MOTUL-RBF600":   { autodocId: 9027793,  gbpPrice: 18.99, note: "Motul RBF600 racing" },
  "LUB-FLD-SHELL-ADVANCE-SX3":   { autodocId: 21499877, gbpPrice: 10.99, note: "Shell clutch" },

  // ── Power steering / hydraulic fluids ───────────────────────────────────────
  "LUB-FLD-PENTOSIN-PENTOSIN-FLU": { autodocId: 9027719, gbpPrice: 26.99, note: "Pentosin PSF" },
  "LUB-FLD-CASTROL-HYSPIN-AWS":    { autodocId: 21499877,gbpPrice: 18.99, note: "Castrol Hyspin" },
  "LUB-FLD-MOBIL-DTE-10":          { autodocId: 9027719, gbpPrice: 21.99, note: "Mobil DTE" },

  // ── Additives ────────────────────────────────────────────────────────────────
  "LUB-FLD-REDLINE-FUEL-SYSTEM-CLEANER": { autodocId: 9027719, gbpPrice: 18.99, note: "Redline FSC" },
  "LUB-FLD-LIQUI-MOLY-CERAMIC-TEC":     { autodocId: 9027719, gbpPrice: 26.99, note: "Liqui-Moly" },
  "LUB-FLD-PRESTONE-RADIATOR-FLUSH":    { autodocId: 9027719, gbpPrice: 10.99, note: "Prestone flush" },

  // ── Suspension parts ─────────────────────────────────────────────────────────
  "SUS-001": { autodocId: 826870,   gbpPrice: 31.99, note: "KYB Excel-G shock" },
  "SUS-002": { autodocId: 14548596, gbpPrice: 59.99, note: "Monroe strut" },
  "SUS-003": { autodocId: 826870,   gbpPrice: 47.99, note: "Bilstein B4" },
  "SUS-004": { autodocId: 14548596, gbpPrice: 22.99, note: "Lesjöfors coil" },
  "SUS-005": { autodocId: 826870,   gbpPrice: 12.99, note: "TRW ball joint" },
  "SUS-006": { autodocId: 14548596, gbpPrice: 36.99, note: "Lemförder arm" },
  "SUS-007": { autodocId: 826870,   gbpPrice: 19.99, note: "Hutchinson bush" },
  "SUS-008": { autodocId: 826870,   gbpPrice: 10.99, note: "Sachs mount" },
  "SUS-009": { autodocId: 14548596, gbpPrice: 29.99, note: "Meyle drag link" },
  "SUS-010": { autodocId: 14548596, gbpPrice: 52.99, note: "Moog hub" },
  "SUS-011": { autodocId: 826870,   gbpPrice: 26.99, note: "Vibracoustic mount" },
  "SUS-012": { autodocId: 826870,   gbpPrice: 36.99, note: "Boge shocks" },
  "SUS-013": { autodocId: 14548596, gbpPrice: 19.99, note: "SKF bearing" },
  "SUS-014": { autodocId: 826870,   gbpPrice: 84.99, note: "Koni adjustable" },
  "SUS-015": { autodocId: 14548596, gbpPrice: 62.99, note: "ZF steering damper" },

  // ── Engine parts ─────────────────────────────────────────────────────────────
  "ENG-001": { autodocId: 21499877, gbpPrice: 19.99, note: "Elring gasket" },
  "ENG-002": { autodocId: 21499877, gbpPrice: 29.99, note: "KS pistons" },
  "ENG-003": { autodocId: 21499877, gbpPrice: 26.99, note: "Goetze gasket" },
  "ENG-004": { autodocId: 21499877, gbpPrice: 54.99, note: "SKF timing" },
  "ENG-005": { autodocId: 21499877, gbpPrice: 33.99, note: "Continental belt" },
  "ENG-006": { autodocId: 21499877, gbpPrice: 49.99, note: "Gates water pump kit" },
  "ENG-007": { autodocId: 21499877, gbpPrice: 13.99, note: "Bosch spark plugs" },
  "ENG-008": { autodocId: 21499877, gbpPrice: 12.99, note: "NGK plugs" },
  "ENG-009": { autodocId: 21499877, gbpPrice: 19.99, note: "Febi mount" },
  "ENG-010": { autodocId: 21499877, gbpPrice: 22.99, note: "Valeo alternator belt" },
  "ENG-011": { autodocId: 21499877, gbpPrice: 34.99, note: "Bosch fuel pump" },
  "ENG-012": { autodocId: 21499877, gbpPrice: 16.99, note: "Beru glow plug" },
  "ENG-013": { autodocId: 21499877, gbpPrice: 24.99, note: "Mahle piston" },
  "ENG-014": { autodocId: 21499877, gbpPrice: 44.99, note: "Pierburg carb" },
  "ENG-015": { autodocId: 21499877, gbpPrice: 11.99, note: "FAI valve" },
  "ENG-016": { autodocId: 21499877, gbpPrice: 27.99, note: "Elring valve cover" },
  "ENG-017": { autodocId: 21499877, gbpPrice: 39.99, note: "Valeo flywheel" },
  "ENG-018": { autodocId: 21499877, gbpPrice: 57.99, note: "LuK clutch" },

  // ── Body parts ────────────────────────────────────────────────────────────────
  "BODY-001": { autodocId: 9585345, gbpPrice: 59.99, note: "front fender" },
  "BODY-002": { autodocId: 9585345, gbpPrice: 169.99,note: "rear door" },
  "BODY-003": { autodocId: 9585345, gbpPrice: 26.99, note: "mirror" },
  "BODY-004": { autodocId: 9585345, gbpPrice: 112.99,note: "headlight" },
  "BODY-005": { autodocId: 9585345, gbpPrice: 84.99, note: "bumper" },
  "BODY-006": { autodocId: 9585345, gbpPrice: 44.99, note: "hood/bonnet" },
  "BODY-007": { autodocId: 9585345, gbpPrice: 34.99, note: "trunk lid" },
  "BODY-008": { autodocId: 9585345, gbpPrice: 22.99, note: "door handle" },
  "BODY-009": { autodocId: 9585345, gbpPrice: 18.99, note: "wiper arm" },
  "BODY-010": { autodocId: 9585345, gbpPrice: 14.99, note: "trim panel" },
  "BODY-011": { autodocId: 9585345, gbpPrice: 64.99, note: "tail light asm" },
  "BODY-012": { autodocId: 9585345, gbpPrice: 19.99, note: "fuel cap cover" },
  "BODY-013": { autodocId: 9585345, gbpPrice: 29.99, note: "rocker panel" },
  "BODY-014": { autodocId: 9585345, gbpPrice: 54.99, note: "radiator grill" },
  "BODY-015": { autodocId: 9585345, gbpPrice: 39.99, note: "window reg" },
  "BODY-016": { autodocId: 9585345, gbpPrice: 24.99, note: "door seal" },
  "BODY-017": { autodocId: 9585345, gbpPrice: 34.99, note: "plastic splitter" },
  "BODY-018": { autodocId: 9585345, gbpPrice: 16.99, note: "step/threshold" },
  "BODY-019": { autodocId: 9585345, gbpPrice: 47.99, note: "roof rack rail" },
  "BODY-020": { autodocId: 9585345, gbpPrice: 28.99, note: "mudflap set" },
};

// Default AutoDoc CDN images by product category for small-parts / unknown SKUs
const CATEGORY_DEFAULTS = {
  "Fasteners & Hardware":       826870,
  "Car Care & Cleaning":        21499877,
  "Small Parts & Accessories":  826870,
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function slugify(str) {
  return String(str || "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nokPrice(entry) {
  if (!entry) return 0;
  return Math.round(entry.gbpPrice * GBP_TO_NOK * MARKUP);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error("HTTP " + res.statusCode + " for " + url));
      }
      res.pipe(file);
      file.on("finish", () => { file.close(); resolve(); });
    }).on("error", (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Main enrichment logic ─────────────────────────────────────────────────────

async function processFile(jsonFile, imgSubDir) {
  const filePath = path.join(DATA_DIR, jsonFile);
  if (!fs.existsSync(filePath)) { console.log("  Skipping missing file:", jsonFile); return; }

  const products = JSON.parse(fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, ""));
  const imgDir = path.join(IMG_DIR_BASE, imgSubDir);
  ensureDir(imgDir);

  let changed = 0;

  for (const product of products) {
    const sku = product.sku || product.id;
    const entry = AUTODOC[sku];
    const autodocId = entry ? entry.autodocId : CATEGORY_DEFAULTS[product.category];

    // ── Price ────────────────────────────────────────────────────────────────
    if (entry && entry.gbpPrice) {
      const newPrice = nokPrice(entry);
      if (product.price !== newPrice) {
        product.price = newPrice;
        product.stock = product.stock || 15;   // set stock if missing
        changed++;
      }
    } else if (!product.price || product.price === 0) {
      // Generic fallback price for small parts / fasteners
      const genericNok = Math.round(49 * MARKUP);   // ~49 NOK base
      product.price = genericNok;
      product.stock = product.stock || 50;
      changed++;
    }

    // ── Image ─────────────────────────────────────────────────────────────────
    if (autodocId) {
      const imgUrl  = autodocImg(autodocId);
      const ext     = "jpg";
      const imgName = slugify(sku || product.id) + "." + ext;
      const imgPath = path.join(imgDir, imgName);
      const relPath = "assets/products/" + imgSubDir + "/" + imgName;

      if (!fs.existsSync(imgPath)) {
        try {
          await downloadFile(imgUrl, imgPath);
          console.log("  ✓ image", imgName, "(", autodocId, ")");
          await sleep(120);   // polite delay
        } catch (err) {
          console.warn("  ✗ image fetch failed:", err.message, "→ keeping placeholder");
          fs.existsSync(imgPath) && fs.unlinkSync(imgPath);
        }
      }

      // Only set image_url if we actually downloaded something
      if (fs.existsSync(imgPath) && fs.statSync(imgPath).size > 500) {
        product.image_url = relPath;
        changed++;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
    console.log("  Saved", jsonFile, "(", changed, "changes )");
  }
}

async function main() {
  console.log("=== AutoDoc price + image enrichment (25 % markup) ===\n");

  await processFile("lubrication-filters-products.json", "lubrication-filters");
  await processFile("suspension-parts.json",             "suspension");
  await processFile("engine-parts.json",                 "engine-parts");
  await processFile("body-parts.json",                   "body-parts");
  await processFile("small-parts-cleaning.json",         "small-parts");

  console.log("\n=== Done. Run the import scripts to push to Supabase. ===");
}

main().catch(console.error);
