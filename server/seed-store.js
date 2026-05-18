/**
 * Load full company profiles from committed seed JSON (Oslo / manual seeds).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DIRS = [
  path.join(ROOT, "data", "seed", "companies"),
  path.join(ROOT, "data", "seed", "companies", "batch"),
];

function readSeed(slug) {
  for (const dir of DIRS) {
    const file = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(file)) continue;
    try {
      const seed = JSON.parse(fs.readFileSync(file, "utf8"));
      const id = seed.slug || seed.profile?.id;
      if (id !== slug) continue;
      return {
        profile: seed.profile,
        mapGeojson: seed.mapGeojson ?? null,
      };
    } catch {
      /* try next */
    }
  }

  for (const dir of DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".json")) continue;
      try {
        const seed = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
        const id = seed.slug || seed.profile?.id;
        if (id === slug) {
          return {
            profile: seed.profile,
            mapGeojson: seed.mapGeojson ?? null,
          };
        }
      } catch {
        /* skip */
      }
    }
  }

  return null;
}

module.exports = { readSeed };
