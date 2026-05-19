/**
 * Known Norwegian shelf field polygons (approximate licence areas for map display).
 * Matched by field name when enriching oil & gas operators.
 */

const FIELDS = [
  {
    name: "Troll",
    license: "PL085",
    status: "Producing",
    coordinates: [
      [
        [3.45, 60.58],
        [3.95, 60.58],
        [3.95, 60.92],
        [3.45, 60.92],
        [3.45, 60.58],
      ],
    ],
  },
  {
    name: "Johan Sverdrup",
    license: "PL265",
    status: "Producing",
    coordinates: [
      [
        [2.55, 58.95],
        [3.15, 58.95],
        [3.15, 59.35],
        [2.55, 59.35],
        [2.55, 58.95],
      ],
    ],
  },
  {
    name: "Snorre",
    license: "PL057",
    status: "Producing",
    coordinates: [
      [
        [2.05, 61.38],
        [2.55, 61.38],
        [2.55, 61.72],
        [2.05, 61.72],
        [2.05, 61.38],
      ],
    ],
  },
  {
    name: "Oseberg",
    license: "PL163",
    status: "Producing",
    coordinates: [
      [
        [2.45, 60.48],
        [2.95, 60.48],
        [2.95, 60.82],
        [2.45, 60.82],
        [2.45, 60.48],
      ],
    ],
  },
  {
    name: "Gullfaks",
    license: "PL050",
    status: "Producing",
    coordinates: [
      [
        [2.15, 61.18],
        [2.65, 61.18],
        [2.65, 61.52],
        [2.15, 61.52],
        [2.15, 61.18],
      ],
    ],
  },
  {
    name: "Statfjord",
    license: "PL037",
    status: "Producing",
    coordinates: [
      [
        [1.85, 61.22],
        [2.35, 61.22],
        [2.35, 61.58],
        [1.85, 61.58],
        [1.85, 61.22],
      ],
    ],
  },
  {
    name: "Ekofisk",
    license: "PL018",
    status: "Producing",
    coordinates: [
      [
        [3.15, 56.48],
        [3.65, 56.48],
        [3.65, 56.82],
        [3.15, 56.82],
        [3.15, 56.48],
      ],
    ],
  },
  {
    name: "Valhall",
    license: "PL032",
    status: "Producing",
    coordinates: [
      [
        [3.35, 56.28],
        [3.75, 56.28],
        [3.75, 56.58],
        [3.35, 56.58],
        [3.35, 56.28],
      ],
    ],
  },
];

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ");
}

function fieldToFeature(field, operator) {
  return {
    type: "Feature",
    properties: {
      name: field.name,
      license: field.license,
      operator: operator || "",
      partners: "",
      status: field.status,
    },
    geometry: { type: "Polygon", coordinates: field.coordinates },
  };
}

function blocksForOperator(companyName, limit = 24) {
  const n = norm(companyName);
  if (/equinor|statoil/.test(n)) {
    return FIELDS.slice(0, limit).map((f) => fieldToFeature(f, companyName));
  }
  if (/aker bp|akerbp/.test(n)) {
    return FIELDS.filter((f) => /gullfaks|statfjord|valhall|oseberg/i.test(f.name))
      .slice(0, limit)
      .map((f) => fieldToFeature(f, companyName));
  }

  const tokens = n.split(/\s+/).filter((t) => t.length > 2);
  const features = [];

  for (const field of FIELDS) {
    const fn = norm(field.name);
    const match = tokens.some((t) => fn.includes(t) || t.length > 4 && fn.includes(t.slice(0, 5)));
    if (!match) continue;
    features.push(fieldToFeature(field, companyName));
    if (features.length >= limit) break;
  }

  if (!features.length && /oil|gas|petroleum|energy/i.test(companyName) && n.includes("nor")) {
    return FIELDS.slice(0, Math.min(6, limit)).map((f) => fieldToFeature(f, companyName));
  }

  return features;
}

function geojsonForOperator(companyName) {
  const features = blocksForOperator(companyName);
  if (!features.length) return null;
  return { type: "FeatureCollection", features };
}

function extractFieldNamesFromText(html) {
  const names = new Set();
  for (const field of FIELDS) {
    if (html.includes(field.name)) names.add(field.name);
  }
  const re = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:field|licen[cs]e|block|discovery)\b/g;
  let m;
  while ((m = re.exec(html)) && names.size < 40) {
    names.add(m[1].trim());
  }
  return [...names];
}

module.exports = { blocksForOperator, geojsonForOperator, extractFieldNamesFromText, FIELDS };
