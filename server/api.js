/**
 * Minimal API router for Spectr.
 */
const { handleAuthApi } = require("./auth-api");
const {
  getAdminClient,
  getAuthClient,
  getReadClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");

const STRIPE_API_VERSION = "2026-04-22.dahlia";
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY || "";

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  if (req.body != null && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }
  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (chunk) => {
      buf += chunk;
    });
    req.on("end", () => {
      try {
        resolve(buf ? JSON.parse(buf) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function requireAdmin(req, res) {
  if (!hasSupabaseWrites()) {
    sendJson(res, 503, { error: "Admin access requires Supabase service role configuration." });
    return null;
  }

  const token = bearerToken(req);
  if (!token) {
    sendJson(res, 401, { error: "Sign in as an admin to continue." });
    return null;
  }

  const { data, error } = await getAuthClient().auth.getUser(token);
  const user = data && data.user;
  if (error || !user) {
    sendJson(res, 401, { error: "Your admin session is invalid or expired." });
    return null;
  }

  if (!user.app_metadata || user.app_metadata.role !== "admin") {
    sendJson(res, 403, { error: "Admin access required." });
    return null;
  }

  return user;
}

async function handleMakes(req, res) {
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, {
      error: "Car makes database is not configured.",
    });
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const activeOnly = url.searchParams.get("active") !== "0";
  const withModels = url.searchParams.get("with_models") === "1";
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 1), 300);

  let query = getReadClient()
    .from("makes")
    .select("id, slug, name, country, region, active, logo_text, logo_url, popularity_rank")
    .order("popularity_rank", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true })
    .limit(limit);

  if (activeOnly) query = query.eq("active", true);

  let { data, error } = await query;
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load car makes." });
    return true;
  }

  if (withModels) {
    const makeIds = (data || []).map((make) => make.id);
    if (makeIds.length) {
      const { data: modelRows, error: modelError } = await getReadClient()
        .from("models")
        .select("make_id")
        .in("make_id", makeIds);

      if (modelError) {
        sendJson(res, 500, { error: modelError.message || "Could not load supported makes." });
        return true;
      }

      const supportedMakeIds = new Set((modelRows || []).map((row) => row.make_id));
      data = (data || []).filter((make) => supportedMakeIds.has(make.id));
    }
  }

  sendJson(res, 200, { makes: data || [] });
  return true;
}

function modelFromRow(row) {
  return {
    id: row.id,
    make_id: row.make_id,
    name: row.name,
    body_type: row.body_type || "",
    year_from: row.year_from == null ? null : Number(row.year_from),
    year_to: row.year_to == null ? null : Number(row.year_to),
  };
}

async function handleModels(req, res) {
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, { error: "Car models database is not configured." });
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const makeId = String(url.searchParams.get("make_id") || "").trim();
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "400", 10) || 400, 1), 500);

  if (!makeId) {
    sendJson(res, 400, { error: "make_id is required." });
    return true;
  }

  const { data, error } = await getReadClient()
    .from("models")
    .select("id, make_id, name, body_type, year_from, year_to")
    .eq("make_id", makeId)
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load car models." });
    return true;
  }

  sendJson(res, 200, { models: (data || []).map(modelFromRow) });
  return true;
}

function partFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category || "Other",
    sku: row.sku || "",
    article_number: row.article_number || row.sku || "",
    ean_code: row.ean_code || "",
    price: Number(row.price) || 0,
    stock: Number(row.stock) || 0,
    delivery_time: row.delivery_time || "2-5 days",
    description: row.description || "",
    image_url: row.image_url || "",
    features: Array.isArray(row.features) ? row.features : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    vehicles: Array.isArray(row.vehicles) ? row.vehicles : [],
  };
}

function normalizeCatalogKey(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function partDedupeKey(part) {
  return [
    normalizeCatalogKey(part.category),
    normalizeCatalogKey(part.name),
    normalizeCatalogKey(part.sku),
  ].join("|");
}

function dedupeCatalogParts(parts) {
  const seenIds = new Set();
  const seenKeys = new Set();
  const unique = [];

  for (const part of parts) {
    const id = String(part.id || "");
    const key = partDedupeKey(part);
    if ((id && seenIds.has(id)) || (key && seenKeys.has(key))) continue;
    if (id) seenIds.add(id);
    if (key) seenKeys.add(key);
    unique.push(part);
  }

  return unique;
}

function oilBrandName(row) {
  const brand = row && row.oil_brands;
  if (Array.isArray(brand)) return (brand[0] && brand[0].name) || "";
  return (brand && brand.name) || "";
}

function oilProductFromRow(row, fitments) {
  const brandName = oilBrandName(row);
  const volume = row.volume_liters == null ? "" : `${Number(row.volume_liters)}L`;
  const approvals = Array.isArray(row.approvals) ? row.approvals.filter(Boolean) : [];
  const descriptionParts = [
    row.base_type,
    row.viscosity,
    volume,
    approvals.length ? `Approvals: ${approvals.join(", ")}` : "",
  ].filter(Boolean);

  return {
    id: `oil-product-${row.id}`,
    name: [brandName, row.name, volume].filter(Boolean).join(" "),
    category: "Oils",
    sku: `OIL-${String(row.id || "").slice(0, 8).toUpperCase()}`,
    article_number: row.article_number || "",
    ean_code: row.ean_code || "",
    price: Number(row.price_eur) || 0,
    stock: Number(row.stock) || 0,
    delivery_time: row.delivery_time || "2-5 days",
    description: row.marketing_description || descriptionParts.join(" · "),
    image_url: row.image_url || "",
    features: Array.isArray(row.features) ? row.features : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    vehicles: fitments,
  };
}

function brakeBrandName(row) {
  const brand = row && row.brake_brands;
  if (Array.isArray(brand)) return (brand[0] && brand[0].name) || "";
  return (brand && brand.name) || "";
}

function brakeFitmentVehicle(row) {
  const modelValue = row && row.models;
  const model = Array.isArray(modelValue) ? modelValue[0] : modelValue;
  const makeValue = model && model.makes;
  const make = Array.isArray(makeValue) ? makeValue[0] : makeValue;
  return {
    brand: (make && make.name) || "",
    model: (model && model.name) || "",
    engine: [row.position, row.notes].filter(Boolean).join(" · "),
  };
}

function brakeProductMatchesFitment(product, fitment) {
  if (!product || !fitment) return false;
  if (product.position && fitment.position && product.position !== fitment.position) return false;

  if (product.type === "disc") {
    return fitment.brake_type === "disc" &&
      Number(product.disc_diameter_mm) === Number(fitment.disc_diameter_mm) &&
      Number(product.disc_thickness_mm) === Number(fitment.disc_thickness_mm);
  }

  if (product.type === "pad") {
    return Number(product.pad_height_mm) === Number(fitment.pad_height_mm) &&
      Number(product.pad_width_mm) === Number(fitment.pad_width_mm);
  }

  return false;
}

function brakeProductFromRow(row, fitments) {
  const brandName = brakeBrandName(row);
  const typeLabel = row.type === "disc" ? "Brake disc" : row.type === "pad" ? "Brake pad" : "Brake part";
  const position = row.position ? `${row.position} axle` : "";
  const discSpecs = row.type === "disc"
    ? [
        row.disc_diameter_mm ? `${row.disc_diameter_mm}mm` : "",
        row.disc_thickness_mm ? `${Number(row.disc_thickness_mm).toFixed(1)}mm thick` : "",
        row.disc_ventilated ? "ventilated" : "",
        row.disc_drilled ? "drilled" : "",
        row.disc_slotted ? "slotted" : "",
        row.disc_coated ? "coated" : "",
      ]
    : [];
  const padSpecs = row.type === "pad"
    ? [
        row.pad_material || "",
        row.pad_height_mm && row.pad_width_mm ? `${Number(row.pad_height_mm).toFixed(1)}x${Number(row.pad_width_mm).toFixed(1)}mm` : "",
        row.pad_with_sensor ? "with sensor" : "",
      ]
    : [];

  return {
    id: `brake-product-${row.id}`,
    name: [brandName, row.name].filter(Boolean).join(" "),
    category: "Brakes",
    sku: `BRAKE-${String(row.id || "").slice(0, 8).toUpperCase()}`,
    article_number: row.article_number || "",
    ean_code: row.ean_code || row.ean || "",
    price: Number(row.price_eur) || 0,
    stock: Number(row.stock) || 0,
    delivery_time: row.delivery_time || "2-5 days",
    description: row.marketing_description || [typeLabel, position, ...discSpecs, ...padSpecs].filter(Boolean).join(" · "),
    image_url: row.image_url || "",
    features: Array.isArray(row.features) ? row.features : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
    vehicles: fitments,
  };
}

function tyreFitmentVehicle(row) {
  const modelValue = row && row.models;
  const model = Array.isArray(modelValue) ? modelValue[0] : modelValue;
  const makeValue = model && model.makes;
  const make = Array.isArray(makeValue) ? makeValue[0] : makeValue;
  return {
    brand: (make && make.name) || "",
    model: (model && model.name) || "",
    engine: "",
  };
}

function tyreSizeKey(row) {
  return [
    row.width,
    row.aspect_ratio,
    row.rim_diameter,
  ].join("-");
}

function tyreSizeLabel(row) {
  return `${row.width}/${row.aspect_ratio} R${row.rim_diameter}`;
}

function tyreBrandForKey(key) {
  const brands = ["Michelin", "Continental", "Pirelli", "Goodyear", "Bridgestone", "Nokian", "Hankook", "Yokohama"];
  const hash = String(key || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return brands[hash % brands.length];
}

function tyrePartFromGroup(key, rows) {
  const first = rows[0] || {};
  const label = tyreSizeLabel(first);
  const brand = tyreBrandForKey(key);
  const loadSpeed = Array.from(new Set(rows.map((row) => {
    return [row.load_index, row.speed_rating].filter(Boolean).join("");
  }).filter(Boolean))).sort();
  const notes = Array.from(new Set(rows.map((row) => row.notes).filter(Boolean))).slice(0, 4);
  const descriptionParts = [
    "Tyre size matched from OEM fitment data",
    loadSpeed.length ? `Load/speed: ${loadSpeed.join(", ")}` : "",
    notes.length ? `Examples: ${notes.join(", ")}` : "",
  ].filter(Boolean);

  return {
    id: `tyre-size-${key}`,
    name: `${brand} ${label}`,
    category: "Tires",
    sku: `TYRE-${first.width}-${first.aspect_ratio}-R${first.rim_diameter}`,
    article_number: `TYRE-${key}`,
    ean_code: "",
    price: 0,
    stock: 999,
    delivery_time: "2-5 days",
    description: descriptionParts.join(" · "),
    specifications: [
      { label: "Tyre size", value: label },
      { label: "Load/speed", value: loadSpeed.join(", ") },
    ].filter((spec) => spec.value),
    vehicles: dedupeVehicleFits(rows.map(tyreFitmentVehicle).filter((vehicle) => vehicle.brand && vehicle.model)),
  };
}

async function fetchTyreSizeParts() {
  const { data, error } = await getReadClient()
    .from("car_tyre_fitment")
    .select("width, aspect_ratio, rim_diameter, load_index, speed_rating, axle, notes, models(name, makes(name))")
    .order("width", { ascending: true })
    .order("aspect_ratio", { ascending: true })
    .order("rim_diameter", { ascending: true });

  if (error) {
    if (error.code === "42P01") return [];
    throw error;
  }

  const groups = new Map();
  for (const row of data || []) {
    const key = tyreSizeKey(row);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  return Array.from(groups.entries()).map(([key, rows]) => tyrePartFromGroup(key, rows));
}

function oilFitmentVehicle(row) {
  const modelValue = row && row.models;
  const model = Array.isArray(modelValue) ? modelValue[0] : modelValue;
  const makeValue = model && model.makes;
  const make = Array.isArray(makeValue) ? makeValue[0] : makeValue;
  return {
    brand: (make && make.name) || "",
    model: (model && model.name) || "",
    engine: row.engine_type || "",
  };
}

function oilProductMatchesFitment(product, fitment) {
  if (!product || !fitment) return false;
  const viscosity = product.viscosity || "";
  const matchesViscosity = viscosity === fitment.viscosity || viscosity === fitment.viscosity_alt;
  if (!matchesViscosity) return false;

  const approvals = Array.isArray(product.approvals) ? product.approvals : [];
  const requiredSpecs = Array.isArray(fitment.required_specs) ? fitment.required_specs : [];
  if (!requiredSpecs.length) return true;
  return approvals.some((approval) => requiredSpecs.includes(approval));
}

async function fetchOilProductParts(activeOnly) {
  let oilProductsQuery = getReadClient()
    .from("oil_products")
      .select("id, name, viscosity, base_type, approvals, volume_liters, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, oil_brands(name)")
    .order("name", { ascending: true });

  if (activeOnly) oilProductsQuery = oilProductsQuery.eq("active", true);

  const [productsResult, fitmentsResult] = await Promise.all([
    oilProductsQuery,
    getReadClient()
      .from("car_oil_fitment")
      .select("engine_type, viscosity, viscosity_alt, required_specs, models(name, makes(name))"),
  ]);

  if (productsResult.error) {
    if (productsResult.error.code === "42P01") return [];
    throw productsResult.error;
  }

  if (fitmentsResult.error) {
    if (fitmentsResult.error.code === "42P01") return (productsResult.data || []).map((row) => oilProductFromRow(row, []));
    throw fitmentsResult.error;
  }

  const fitments = fitmentsResult.data || [];
  return (productsResult.data || []).map((product) => {
    const vehicles = fitments
      .filter((fitment) => oilProductMatchesFitment(product, fitment))
      .map(oilFitmentVehicle)
      .filter((vehicle) => vehicle.brand && vehicle.model);
    return oilProductFromRow(product, dedupeVehicleFits(vehicles));
  });
}

async function fetchBrakeProductParts(activeOnly) {
  let brakeProductsQuery = getReadClient()
    .from("brake_products")
      .select("id, name, type, position, disc_diameter_mm, disc_thickness_mm, disc_ventilated, disc_drilled, disc_slotted, disc_coated, pad_height_mm, pad_width_mm, pad_thickness_mm, pad_material, pad_with_sensor, ean, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, brake_brands(name)")
    .order("name", { ascending: true });

  if (activeOnly) brakeProductsQuery = brakeProductsQuery.eq("active", true);

  const [productsResult, fitmentsResult] = await Promise.all([
    brakeProductsQuery,
    getReadClient()
      .from("car_brake_fitment")
      .select("position, brake_type, disc_diameter_mm, disc_thickness_mm, pad_height_mm, pad_width_mm, pad_thickness_mm, notes, models(name, makes(name))"),
  ]);

  if (productsResult.error) {
    if (productsResult.error.code === "42P01") return [];
    throw productsResult.error;
  }

  if (fitmentsResult.error) {
    if (fitmentsResult.error.code === "42P01") return (productsResult.data || []).map((row) => brakeProductFromRow(row, []));
    throw fitmentsResult.error;
  }

  const fitments = fitmentsResult.data || [];
  return (productsResult.data || []).map((product) => {
    const vehicles = fitments
      .filter((fitment) => brakeProductMatchesFitment(product, fitment))
      .map(brakeFitmentVehicle)
      .filter((vehicle) => vehicle.brand && vehicle.model);
    return brakeProductFromRow(product, dedupeVehicleFits(vehicles));
  });
}

async function loadCatalogParts(activeOnly, limit) {
  let query = getReadClient()
    .from("parts")
    .select("id, name, category, sku, price, stock, description, image_url, features, reviews, article_number, ean_code, delivery_time, specifications, vehicles, active")
    .order("name", { ascending: true })
    .limit(limit);

  if (activeOnly) query = query.eq("active", true);

  const { data, error } = await query;

  if (error) throw error;

  const [oilParts, tyreParts, brakeParts] = await Promise.all([
    fetchOilProductParts(activeOnly),
    fetchTyreSizeParts(),
    fetchBrakeProductParts(activeOnly),
  ]);

  return dedupeCatalogParts([
    ...(data || []).map(partFromRow),
    ...oilParts,
    ...tyreParts,
    ...brakeParts,
  ]).slice(0, limit);
}

function dedupeVehicleFits(vehicles) {
  const seen = new Set();
  return vehicles.filter((vehicle) => {
    const key = [
      normalizeCatalogKey(vehicle.brand),
      normalizeCatalogKey(vehicle.model),
      normalizeCatalogKey(vehicle.engine),
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizePartBody(body, fallbackId) {
  const id = String((body && body.id) || fallbackId || "").trim();
  const name = String((body && body.name) || "").trim();
  if (!id) return { error: "Part id is required." };
  if (!name) return { error: "Part name is required." };

  const vehicles = Array.isArray(body && body.vehicles) ? body.vehicles : [];
  return {
    record: {
      id,
      name,
      category: String((body && body.category) || "Other").trim() || "Other",
      sku: String((body && body.sku) || "").trim() || null,
      price: Math.max(0, Number(body && body.price) || 0),
      stock: Math.max(0, parseInt(body && body.stock, 10) || 0),
      description: String((body && body.description) || "").trim() || null,
      article_number: String((body && body.article_number) || "").trim() || null,
      ean_code: String((body && body.ean_code) || "").trim() || null,
      delivery_time: String((body && body.delivery_time) || "2-5 days").trim() || "2-5 days",
      specifications: Array.isArray(body && body.specifications) ? body.specifications : [],
      vehicles: vehicles.map((fit) => ({
        brand: String((fit && fit.brand) || "").trim(),
        model: String((fit && fit.model) || "").trim(),
        engine: String((fit && fit.engine) || "").trim(),
      })),
      active: body && body.active === false ? false : true,
      updated_at: new Date().toISOString(),
    },
  };
}

function productId(value) {
  return String(value || "").replace(/^(oil-product-|brake-product-)/, "").trim();
}

function supplySku(kind, row) {
  if (kind === "parts") return row.sku || "";
  if (kind === "oil") return `OIL-${String(row.id || "").slice(0, 8).toUpperCase()}`;
  return row.ean || `BRAKE-${String(row.id || "").slice(0, 8).toUpperCase()}`;
}

function generatedProductDescription(kind, row) {
  if (kind === "oil") {
    const volume = row.volume_liters == null ? "" : `${Number(row.volume_liters)}L`;
    const approvals = Array.isArray(row.approvals) ? row.approvals.filter(Boolean) : [];
    return [
      row.base_type,
      row.viscosity,
      volume,
      approvals.length ? `Approvals: ${approvals.join(", ")}` : "",
    ].filter(Boolean).join(" · ");
  }

  if (kind === "brake") {
    const typeLabel = row.type === "disc" ? "Brake disc" : row.type === "pad" ? "Brake pad" : "Brake part";
    const position = row.position ? `${row.position} axle` : "";
    const discSpecs = row.type === "disc"
      ? [
          row.disc_diameter_mm ? `${row.disc_diameter_mm}mm` : "",
          row.disc_thickness_mm ? `${Number(row.disc_thickness_mm).toFixed(1)}mm thick` : "",
          row.disc_ventilated ? "ventilated" : "",
          row.disc_drilled ? "drilled" : "",
          row.disc_slotted ? "slotted" : "",
          row.disc_coated ? "coated" : "",
        ]
      : [];
    const padSpecs = row.type === "pad"
      ? [
          row.pad_material || "",
          row.pad_height_mm && row.pad_width_mm ? `${Number(row.pad_height_mm).toFixed(1)}x${Number(row.pad_width_mm).toFixed(1)}mm` : "",
          row.pad_with_sensor ? "with sensor" : "",
        ]
      : [];
    return [typeLabel, position, ...discSpecs, ...padSpecs].filter(Boolean).join(" · ");
  }

  return row.description || "";
}

function productTable(kind) {
  return kind === "parts" ? "parts" : kind === "oil" ? "oil_products" : kind === "brake" ? "brake_products" : "";
}

function productSelect(kind) {
  if (kind === "parts") return "id, name, category, sku, price, stock, description, image_url, features, reviews, article_number, ean_code, delivery_time, specifications, vehicles, active, created_at, updated_at";
  if (kind === "oil") {
    return "id, brand_id, name, viscosity, base_type, approvals, volume_liters, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, created_at, updated_at, oil_brands(name)";
  }
  if (kind === "brake") {
    return "id, brand_id, name, type, position, disc_diameter_mm, disc_thickness_mm, disc_min_thickness_mm, disc_ventilated, disc_drilled, disc_slotted, disc_coated, pad_height_mm, pad_width_mm, pad_thickness_mm, pad_material, pad_with_sensor, ean, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, created_at, updated_at, brake_brands(name)";
  }
  return "";
}

function supplyItem(kind, row) {
  const brandValue = kind === "oil" ? row.oil_brands : row.brake_brands;
  const brand = Array.isArray(brandValue) ? brandValue[0] : brandValue;
  const price = kind === "parts" ? row.price : row.price_eur;
  return {
    kind,
    id: row.id,
    name: row.name || "",
    brand: (brand && brand.name) || "",
    category: kind === "oil" ? "Oils" : kind === "brake" ? "Brakes" : row.category || "Other",
    sku: supplySku(kind, row),
    article_number: row.article_number || "",
    ean_code: row.ean_code || row.ean || "",
    price: Number(price) || 0,
    stock: Number(row.stock) || 0,
    delivery_time: row.delivery_time || "2-5 days",
    active: row.active !== false,
    details: {
      type: row.type || "",
      viscosity: row.viscosity || "",
      volume_liters: row.volume_liters == null ? null : Number(row.volume_liters),
      base_type: row.base_type || "",
      approvals: Array.isArray(row.approvals) ? row.approvals : [],
      description: row.description || row.marketing_description || generatedProductDescription(kind, row),
    },
    image_url: row.image_url || "",
    features: Array.isArray(row.features) ? row.features : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    specifications: Array.isArray(row.specifications) ? row.specifications : [],
  };
}

function editableProduct(kind, row) {
  const item = supplyItem(kind, row);
  const base = {
    ...item,
    brand_id: row.brand_id || null,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };

  if (kind === "parts") {
    return {
      ...base,
      editable: {
        name: row.name || "",
        category: row.category || "Other",
        sku: row.sku || "",
        price: Number(row.price) || 0,
        stock: Number(row.stock) || 0,
        description: row.description || "",
        image_url: row.image_url || "",
        features: Array.isArray(row.features) ? row.features : [],
        reviews: Array.isArray(row.reviews) ? row.reviews : [],
        article_number: row.article_number || "",
        ean_code: row.ean_code || "",
        delivery_time: row.delivery_time || "2-5 days",
        specifications: Array.isArray(row.specifications) ? row.specifications : [],
        vehicles: Array.isArray(row.vehicles) ? row.vehicles : [],
        active: row.active !== false,
      },
    };
  }

  if (kind === "oil") {
    return {
      ...base,
      editable: {
        name: row.name || "",
        viscosity: row.viscosity || "",
        base_type: row.base_type || "",
        approvals: Array.isArray(row.approvals) ? row.approvals : [],
        volume_liters: row.volume_liters == null ? null : Number(row.volume_liters),
        price_eur: Number(row.price_eur) || 0,
        stock: Number(row.stock) || 0,
        image_url: row.image_url || "",
        description: row.marketing_description || generatedProductDescription(kind, row),
        features: Array.isArray(row.features) ? row.features : [],
        reviews: Array.isArray(row.reviews) ? row.reviews : [],
        article_number: row.article_number || "",
        ean_code: row.ean_code || "",
        delivery_time: row.delivery_time || "2-5 days",
        specifications: Array.isArray(row.specifications) ? row.specifications : [],
        active: row.active !== false,
      },
    };
  }

  return {
    ...base,
    editable: {
      name: row.name || "",
      type: row.type || "",
      position: row.position || "",
      disc_diameter_mm: row.disc_diameter_mm == null ? null : Number(row.disc_diameter_mm),
      disc_thickness_mm: row.disc_thickness_mm == null ? null : Number(row.disc_thickness_mm),
      disc_min_thickness_mm: row.disc_min_thickness_mm == null ? null : Number(row.disc_min_thickness_mm),
      disc_ventilated: row.disc_ventilated === true,
      disc_drilled: row.disc_drilled === true,
      disc_slotted: row.disc_slotted === true,
      disc_coated: row.disc_coated === true,
      pad_height_mm: row.pad_height_mm == null ? null : Number(row.pad_height_mm),
      pad_width_mm: row.pad_width_mm == null ? null : Number(row.pad_width_mm),
      pad_thickness_mm: row.pad_thickness_mm == null ? null : Number(row.pad_thickness_mm),
      pad_material: row.pad_material || "",
      pad_with_sensor: row.pad_with_sensor === true,
      ean: row.ean || "",
      price_eur: Number(row.price_eur) || 0,
      stock: Number(row.stock) || 0,
      image_url: row.image_url || "",
      description: row.marketing_description || generatedProductDescription(kind, row),
      features: Array.isArray(row.features) ? row.features : [],
      reviews: Array.isArray(row.reviews) ? row.reviews : [],
      article_number: row.article_number || "",
      ean_code: row.ean_code || row.ean || "",
      delivery_time: row.delivery_time || "2-5 days",
      specifications: Array.isArray(row.specifications) ? row.specifications : [],
      active: row.active !== false,
    },
  };
}

function supplySummary(items) {
  const totalStock = items.reduce((sum, item) => sum + item.stock, 0);
  const lowStock = items.filter((item) => item.stock > 0 && item.stock <= 5).length;
  const outOfStock = items.filter((item) => item.stock <= 0).length;
  const value = items.reduce((sum, item) => sum + item.stock * item.price, 0);
  return {
    products: items.length,
    totalStock,
    lowStock,
    outOfStock,
    inventoryValue: Number(value.toFixed(2)),
  };
}

async function handleAdminMe(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return true;
  sendJson(res, 200, {
    admin: {
      id: user.id,
      email: user.email,
      name: (user.user_metadata && user.user_metadata.name) || user.email,
      role: user.app_metadata.role,
    },
  });
  return true;
}

async function handleAdminSupply(req, res) {
  const [partsResult, oilsResult, brakesResult] = await Promise.all([
    getAdminClient()
      .from("parts")
      .select("id, name, category, sku, price, stock, description, image_url, features, reviews, article_number, ean_code, delivery_time, specifications, vehicles, active")
      .order("name", { ascending: true }),
    getAdminClient()
      .from("oil_products")
      .select("id, name, viscosity, base_type, approvals, volume_liters, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, oil_brands(name)")
      .order("name", { ascending: true }),
    getAdminClient()
      .from("brake_products")
      .select("id, name, type, position, ean, price_eur, stock, active, image_url, marketing_description, features, reviews, article_number, ean_code, delivery_time, specifications, brake_brands(name)")
      .order("name", { ascending: true }),
  ]);

  const firstError = partsResult.error || oilsResult.error || brakesResult.error;
  if (firstError) {
    sendJson(res, 500, { error: firstError.message || "Could not load supply inventory." });
    return true;
  }

  const items = [
    ...(partsResult.data || []).map((row) => supplyItem("parts", row)),
    ...(oilsResult.data || []).map((row) => supplyItem("oil", row)),
    ...(brakesResult.data || []).map((row) => supplyItem("brake", row)),
  ];

  sendJson(res, 200, { items, summary: supplySummary(items) });
  return true;
}

function cleanProductUpdates(kind, body) {
  const updates = {};
  if (body.name != null) updates.name = String(body.name || "").trim();
  if (kind === "parts" && body.category != null) updates.category = String(body.category || "Other").trim() || "Other";
  if (kind === "parts" && body.sku != null) updates.sku = String(body.sku || "").trim() || null;
  if (body.price != null) updates[kind === "parts" ? "price" : "price_eur"] = Math.max(0, Number(body.price) || 0);
  if (body.price_eur != null && kind !== "parts") updates.price_eur = Math.max(0, Number(body.price_eur) || 0);
  if (body.stock != null) updates.stock = Math.max(0, parseInt(body.stock, 10) || 0);
  if (body.active != null) updates.active = body.active === true;
  if (kind === "parts" && body.description != null) updates.description = String(body.description || "").trim() || null;
  if (body.image_url != null) updates.image_url = String(body.image_url || "").trim() || null;
  if (body.article_number != null) updates.article_number = String(body.article_number || "").trim() || null;
  if (body.ean_code != null) updates.ean_code = String(body.ean_code || "").trim() || null;
  if (body.delivery_time != null) updates.delivery_time = String(body.delivery_time || "2-5 days").trim() || "2-5 days";
  if (body.features != null) {
    updates.features = Array.isArray(body.features)
      ? body.features.map((item) => String(item || "").trim()).filter(Boolean)
      : String(body.features || "").split("\n").map((item) => item.trim()).filter(Boolean);
  }
  if (body.reviews != null) {
    updates.reviews = Array.isArray(body.reviews) ? body.reviews : [];
  }
  if (body.specifications != null) {
    updates.specifications = Array.isArray(body.specifications) ? body.specifications : [];
  }
  if (kind === "parts" && body.vehicles != null) updates.vehicles = Array.isArray(body.vehicles) ? body.vehicles : [];

  if (kind === "oil") {
    if (body.description != null) updates.marketing_description = String(body.description || "").trim() || null;
    if (body.viscosity != null) updates.viscosity = String(body.viscosity || "").trim() || null;
    if (body.base_type != null) updates.base_type = String(body.base_type || "").trim() || null;
    if (body.approvals != null) {
      updates.approvals = Array.isArray(body.approvals)
        ? body.approvals.map((item) => String(item || "").trim()).filter(Boolean)
        : String(body.approvals || "").split(",").map((item) => item.trim()).filter(Boolean);
    }
    if (body.volume_liters != null) updates.volume_liters = Math.max(0, Number(body.volume_liters) || 0);
  }

  if (kind === "brake") {
    if (body.description != null) updates.marketing_description = String(body.description || "").trim() || null;
    if (body.type != null) updates.type = String(body.type || "").trim() || null;
    if (body.position != null) updates.position = String(body.position || "").trim() || null;
    if (body.disc_diameter_mm != null) updates.disc_diameter_mm = body.disc_diameter_mm === "" ? null : Math.max(0, parseInt(body.disc_diameter_mm, 10) || 0);
    if (body.disc_thickness_mm != null) updates.disc_thickness_mm = body.disc_thickness_mm === "" ? null : Math.max(0, Number(body.disc_thickness_mm) || 0);
    if (body.disc_min_thickness_mm != null) updates.disc_min_thickness_mm = body.disc_min_thickness_mm === "" ? null : Math.max(0, Number(body.disc_min_thickness_mm) || 0);
    if (body.disc_ventilated != null) updates.disc_ventilated = body.disc_ventilated === true;
    if (body.disc_drilled != null) updates.disc_drilled = body.disc_drilled === true;
    if (body.disc_slotted != null) updates.disc_slotted = body.disc_slotted === true;
    if (body.disc_coated != null) updates.disc_coated = body.disc_coated === true;
    if (body.pad_height_mm != null) updates.pad_height_mm = body.pad_height_mm === "" ? null : Math.max(0, Number(body.pad_height_mm) || 0);
    if (body.pad_width_mm != null) updates.pad_width_mm = body.pad_width_mm === "" ? null : Math.max(0, Number(body.pad_width_mm) || 0);
    if (body.pad_thickness_mm != null) updates.pad_thickness_mm = body.pad_thickness_mm === "" ? null : Math.max(0, Number(body.pad_thickness_mm) || 0);
    if (body.pad_material != null) updates.pad_material = String(body.pad_material || "").trim() || null;
    if (body.pad_with_sensor != null) updates.pad_with_sensor = body.pad_with_sensor === true;
    if (body.ean != null) updates.ean = String(body.ean || "").trim() || null;
  }
  updates.updated_at = new Date().toISOString();
  return updates;
}

async function handleAdminProductGet(req, res, kind, id) {
  const table = productTable(kind);
  const select = productSelect(kind);
  if (!table || !select) {
    sendJson(res, 404, { error: "Unknown product type." });
    return true;
  }

  const { data, error } = await getAdminClient()
    .from(table)
    .select(select)
    .eq("id", productId(id))
    .maybeSingle();

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load product." });
    return true;
  }
  if (!data) {
    sendJson(res, 404, { error: "Product not found." });
    return true;
  }

  sendJson(res, 200, { product: editableProduct(kind, data) });
  return true;
}

async function handleAdminProductUpdate(req, res, kind, id, body) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const table = productTable(kind);
  const select = productSelect(kind);
  if (!table || !select) {
    sendJson(res, 404, { error: "Unknown product type." });
    return true;
  }

  const updates = cleanProductUpdates(kind, body || {});
  if (!updates.name) delete updates.name;

  const { data, error } = await getAdminClient()
    .from(table)
    .update(updates)
    .eq("id", productId(id))
    .select(select)
    .single();

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not update product." });
    return true;
  }

  sendJson(res, 200, { item: supplyItem(kind, data), product: editableProduct(kind, data) });
  return true;
}

function orderRow(row) {
  return {
    id: row.id,
    number: row.number || "",
    customer_email: row.customer_email || "",
    customer_name: row.customer_name || "",
    customer_id: row.customer_id || null,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    total: Number(row.total) || 0,
    status: row.status || "pending",
    notes: row.notes || "",
    created_at: row.created_at || null,
    updated_at: row.updated_at || null,
  };
}

function ordersSummary(orders) {
  const counts = { pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 };
  let total = 0;
  for (const order of orders) {
    if (counts[order.status] != null) counts[order.status] += 1;
    if (order.status !== "cancelled") total += Number(order.total) || 0;
  }
  return {
    orders: orders.length,
    pending: counts.pending,
    confirmed: counts.confirmed,
    shipped: counts.shipped,
    delivered: counts.delivered,
    cancelled: counts.cancelled,
    revenue: Number(total.toFixed(2)),
  };
}

async function handleAdminOrders(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const { data, error } = await getAdminClient()
    .from("orders")
    .select("id, number, customer_email, customer_name, customer_id, items, subtotal, total, status, notes, created_at, updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load orders." });
    return true;
  }

  const orders = (data || []).map(orderRow);
  sendJson(res, 200, { orders, summary: ordersSummary(orders) });
  return true;
}

const ORDER_STATUSES = new Set(["pending", "confirmed", "shipped", "delivered", "cancelled"]);

async function handleAdminOrderUpdate(req, res, id, body) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const updates = {};
  if (body.status != null) {
    const status = String(body.status || "").trim().toLowerCase();
    if (!ORDER_STATUSES.has(status)) {
      sendJson(res, 400, { error: "Unknown order status." });
      return true;
    }
    updates.status = status;
  }
  if (body.notes != null) updates.notes = String(body.notes || "").trim() || null;
  if (body.customer_name != null) updates.customer_name = String(body.customer_name || "").trim() || null;
  updates.updated_at = new Date().toISOString();

  const { data, error } = await getAdminClient()
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select("id, number, customer_email, customer_name, customer_id, items, subtotal, total, status, notes, created_at, updated_at")
    .single();

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not update order." });
    return true;
  }
  if (!data) {
    sendJson(res, 404, { error: "Order not found." });
    return true;
  }

  sendJson(res, 200, { order: orderRow(data) });
  return true;
}

async function handleAdminOrderDelete(req, res, id) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const { error } = await getAdminClient().from("orders").delete().eq("id", id);
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not delete order." });
    return true;
  }
  sendJson(res, 200, { ok: true });
  return true;
}

function userRow(authUser, profileByAuthId) {
  const profile = profileByAuthId.get(authUser.id) || {};
  const meta = authUser.app_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email || "",
    name: profile.display_name || (authUser.user_metadata && authUser.user_metadata.name) || "",
    role: meta.role || "customer",
    created_at: authUser.created_at || null,
    last_sign_in_at: authUser.last_sign_in_at || profile.last_sign_in_at || null,
    confirmed: Boolean(authUser.email_confirmed_at || authUser.confirmed_at),
  };
}

async function handleAdminUsers(req, res) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const [{ data: authData, error: authError }, profileResult] = await Promise.all([
    getAdminClient().auth.admin.listUsers({ page: 1, perPage: 1000 }),
    getAdminClient()
      .from("customer_profiles")
      .select("auth_user_id, display_name, last_sign_in_at"),
  ]);

  if (authError) {
    sendJson(res, 500, { error: authError.message || "Could not list users." });
    return true;
  }

  const profileByAuthId = new Map();
  for (const row of profileResult.data || []) {
    profileByAuthId.set(row.auth_user_id, row);
  }

  const users = ((authData && authData.users) || []).map((u) => userRow(u, profileByAuthId));
  users.sort((a, b) => (a.email || "").localeCompare(b.email || ""));

  const summary = {
    users: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    customers: users.filter((u) => u.role !== "admin").length,
  };

  sendJson(res, 200, { users, summary });
  return true;
}

const USER_ROLES = new Set(["customer", "editor", "admin"]);

async function handleAdminUserUpdate(req, res, id, body) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  const updates = {};
  if (body.role != null) {
    const role = String(body.role || "").trim().toLowerCase();
    if (!USER_ROLES.has(role)) {
      sendJson(res, 400, { error: "Unknown user role." });
      return true;
    }
    updates.app_metadata = { role };
  }
  if (body.name != null) {
    updates.user_metadata = { name: String(body.name || "").trim() };
  }

  if (!Object.keys(updates).length) {
    sendJson(res, 400, { error: "Nothing to update." });
    return true;
  }

  const { data, error } = await getAdminClient().auth.admin.updateUserById(id, updates);
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not update user." });
    return true;
  }

  if (body.name != null) {
    await getAdminClient()
      .from("customer_profiles")
      .update({ display_name: String(body.name || "").trim() || null, updated_at: new Date().toISOString() })
      .eq("auth_user_id", id);
  }

  const profileResult = await getAdminClient()
    .from("customer_profiles")
    .select("auth_user_id, display_name, last_sign_in_at")
    .eq("auth_user_id", id)
    .maybeSingle();

  const profileByAuthId = new Map();
  if (profileResult.data) profileByAuthId.set(id, profileResult.data);

  sendJson(res, 200, { user: userRow(data.user, profileByAuthId) });
  return true;
}

async function handleAdminUserDelete(req, res, id) {
  const adminUser = await requireAdmin(req, res);
  if (!adminUser) return true;
  if (adminUser.id === id) {
    sendJson(res, 400, { error: "You cannot delete your own admin account." });
    return true;
  }

  const adminClient = getAdminClient();
  const { data: targetData, error: getUserError } = await adminClient.auth.admin.getUserById(id);
  if (getUserError || !targetData || !targetData.user) {
    sendJson(res, 404, { error: "User not found." });
    return true;
  }

  const signinsDelete = await adminClient.from("customer_signins").delete().eq("auth_user_id", id);
  if (signinsDelete.error) {
    sendJson(res, 500, { error: signinsDelete.error.message || "Could not delete user sign-in records." });
    return true;
  }

  const profileDelete = await adminClient.from("customer_profiles").delete().eq("auth_user_id", id);
  if (profileDelete.error) {
    sendJson(res, 500, { error: profileDelete.error.message || "Could not delete customer profile." });
    return true;
  }

  const { error } = await adminClient.auth.admin.deleteUser(id, false);
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not delete user." });
    return true;
  }

  const verifyDelete = await adminClient.auth.admin.getUserById(id);
  if (!verifyDelete.error && verifyDelete.data && verifyDelete.data.user) {
    sendJson(res, 500, { error: "User deletion could not be verified." });
    return true;
  }

  sendJson(res, 200, { ok: true, deleted: true, id });
  return true;
}

async function handleAdminApi(req, res, pathname) {
  if (pathname === "/api/admin/me" && req.method === "GET") return handleAdminMe(req, res);
  if (pathname === "/api/admin/supply" && req.method === "GET") return handleAdminSupply(req, res);
  if (pathname === "/api/admin/orders" && req.method === "GET") return handleAdminOrders(req, res);
  if (pathname === "/api/admin/users" && req.method === "GET") return handleAdminUsers(req, res);

  const productMatch = pathname.match(/^\/api\/admin\/products\/([^/]+)\/([^/]+)$/);
  if (productMatch && req.method === "GET") {
    return handleAdminProductGet(req, res, productMatch[1], decodeURIComponent(productMatch[2]));
  }
  if (productMatch && req.method === "PUT") {
    const body = await readJsonBody(req);
    return handleAdminProductUpdate(req, res, productMatch[1], decodeURIComponent(productMatch[2]), body);
  }

  const orderMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
  if (orderMatch && req.method === "PATCH") {
    const body = await readJsonBody(req);
    return handleAdminOrderUpdate(req, res, decodeURIComponent(orderMatch[1]), body);
  }
  if (orderMatch && req.method === "DELETE") {
    return handleAdminOrderDelete(req, res, decodeURIComponent(orderMatch[1]));
  }

  const userMatch = pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userMatch && req.method === "PATCH") {
    const body = await readJsonBody(req);
    return handleAdminUserUpdate(req, res, decodeURIComponent(userMatch[1]), body);
  }
  if (userMatch && req.method === "DELETE") {
    return handleAdminUserDelete(req, res, decodeURIComponent(userMatch[1]));
  }

  return false;
}

async function handlePartsList(req, res) {
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, { error: "Parts database is not configured." });
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const activeOnly = url.searchParams.get("active") !== "0";
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "500", 10) || 500, 1), 500);

  try {
    const parts = await loadCatalogParts(activeOnly, limit);
    sendJson(res, 200, { parts });
  } catch (catalogError) {
    sendJson(res, 500, { error: catalogError.message || "Could not load derived catalog products." });
  }
  return true;
}

async function handlePartsCreate(req, res, body) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  if (!hasSupabaseWrites()) {
    sendJson(res, 503, { error: "Parts database writes are not configured." });
    return true;
  }

  const normalized = normalizePartBody(body);
  if (normalized.error) {
    sendJson(res, 400, { error: normalized.error });
    return true;
  }

  const { record } = normalized;
  const { data, error } = await getAdminClient()
    .from("parts")
    .insert({ ...record, created_at: new Date().toISOString() })
    .select("id, name, category, sku, price, stock, description, image_url, features, reviews, article_number, ean_code, delivery_time, specifications, vehicles, active")
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    sendJson(res, status, { error: error.message || "Could not save part." });
    return true;
  }

  sendJson(res, 201, { part: partFromRow(data) });
  return true;
}

async function handlePartsUpdate(req, res, partId, body) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  if (!hasSupabaseWrites()) {
    sendJson(res, 503, { error: "Parts database writes are not configured." });
    return true;
  }

  const normalized = normalizePartBody(body, partId);
  if (normalized.error) {
    sendJson(res, 400, { error: normalized.error });
    return true;
  }

  const { id, ...updates } = normalized.record;
  if (id !== partId) {
    sendJson(res, 400, { error: "Part id in body must match the URL." });
    return true;
  }

  const { data, error } = await getAdminClient()
    .from("parts")
    .update(updates)
    .eq("id", partId)
    .select("id, name, category, sku, price, stock, description, image_url, features, reviews, article_number, ean_code, delivery_time, specifications, vehicles, active")
    .single();

  if (error) {
    sendJson(res, 500, { error: error.message || "Could not update part." });
    return true;
  }

  if (!data) {
    sendJson(res, 404, { error: "Part not found." });
    return true;
  }

  sendJson(res, 200, { part: partFromRow(data) });
  return true;
}

async function handlePartsDelete(req, res, partId) {
  const user = await requireAdmin(req, res);
  if (!user) return true;

  if (!hasSupabaseWrites()) {
    sendJson(res, 503, { error: "Parts database writes are not configured." });
    return true;
  }

  const { error } = await getAdminClient().from("parts").delete().eq("id", partId);
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not delete part." });
    return true;
  }

  sendJson(res, 200, { ok: true });
  return true;
}

async function handleParts(req, res, pathname) {
  const partMatch = pathname.match(/^\/api\/parts\/([^/]+)$/);
  const partId = partMatch ? decodeURIComponent(partMatch[1]) : "";

  if (pathname === "/api/parts" && req.method === "GET") {
    return handlePartsList(req, res);
  }

  if (pathname === "/api/parts" && req.method === "POST") {
    const body = await readJsonBody(req);
    return handlePartsCreate(req, res, body);
  }

  if (partId && req.method === "PUT") {
    const body = await readJsonBody(req);
    return handlePartsUpdate(req, res, partId, body);
  }

  if (partId && req.method === "DELETE") {
    return handlePartsDelete(req, res, partId);
  }

  return false;
}

function requestOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  return `${String(proto).split(",")[0]}://${String(host).split(",")[0]}`;
}

function normalizeCheckoutLines(body) {
  const rawLines = Array.isArray(body && body.lines) ? body.lines : [];
  return rawLines
    .map((line) => ({
      partId: String((line && line.partId) || "").trim(),
      qty: Math.min(Math.max(parseInt(line && line.qty, 10) || 0, 0), 99),
    }))
    .filter((line) => line.partId && line.qty > 0);
}

function normalizeCheckoutEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeCheckoutText(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

async function userFromCheckoutRequest(req, body) {
  const token = bearerToken(req) || String((body && body.accessToken) || "").trim();
  if (!token || !isSupabaseEnabled()) return null;
  const { data, error } = await getAuthClient().auth.getUser(token);
  if (error || !data || !data.user) return null;
  return data.user;
}

async function handleCheckoutSession(req, res) {
  if (req.method !== "POST") return false;
  if (!STRIPE_KEY) {
    sendJson(res, 503, { error: "Stripe is not configured. Set STRIPE_SECRET_KEY on the server." });
    return true;
  }
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, { error: "Checkout requires the product database to be configured." });
    return true;
  }

  const body = await readJsonBody(req);
  const lines = normalizeCheckoutLines(body);
  if (!lines.length) {
    sendJson(res, 400, { error: "Your cart is empty." });
    return true;
  }

  const catalog = await loadCatalogParts(true, 500);
  const byId = new Map(catalog.map((part) => [String(part.id), part]));
  const lineItems = [];

  for (const line of lines) {
    const part = byId.get(line.partId);
    if (!part) {
      sendJson(res, 400, { error: "One of the products in your cart is no longer available." });
      return true;
    }
    const price = Number(part.price) || 0;
    const stock = Number(part.stock) || 0;
    if (price <= 0) {
      sendJson(res, 400, { error: `${part.name} cannot be checked out because it has no price.` });
      return true;
    }
    if (stock < line.qty) {
      sendJson(res, 400, { error: `${part.name} only has ${stock} in stock.` });
      return true;
    }

    lineItems.push({
      quantity: line.qty,
      price_data: {
        currency: "nok",
        unit_amount: Math.round(price * 100),
        product_data: {
          name: part.name,
          description: [part.sku, part.category].filter(Boolean).join(" · ").slice(0, 500),
          metadata: {
            part_id: String(part.id),
            sku: String(part.sku || ""),
          },
        },
      },
    });
  }

  const authUser = await userFromCheckoutRequest(req, body);
  const customerEmail = normalizeCheckoutEmail(
    (authUser && authUser.email) || (body.customer && body.customer.email)
  );
  if (!customerEmail) {
    sendJson(res, 400, { error: "Enter an email address to continue as guest, or sign in for rewards." });
    return true;
  }

  const guestDetails = {
    name: normalizeCheckoutText(body.customer && body.customer.name, 120),
    phone: normalizeCheckoutText(body.customer && body.customer.phone, 80),
    address: normalizeCheckoutText(body.customer && body.customer.address, 240),
    country: normalizeCheckoutText(body.customer && body.customer.country, 80),
  };
  if (!authUser && (!guestDetails.name || !guestDetails.phone || !guestDetails.address || !guestDetails.country)) {
    sendJson(res, 400, { error: "Guest checkout requires name, email, address, country, and phone number." });
    return true;
  }

  const Stripe = require("stripe");
  const stripe = new Stripe(STRIPE_KEY, { apiVersion: STRIPE_API_VERSION });
  const origin = requestOrigin(req);
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail,
    success_url: `${origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout.html?checkout=cancelled`,
    metadata: {
      checkout_mode: authUser ? "customer" : "guest",
      customer_id: authUser ? authUser.id : "",
      cart_items: String(lineItems.length),
      customer_name: guestDetails.name,
      customer_phone: guestDetails.phone,
      customer_address: guestDetails.address,
      customer_country: guestDetails.country,
    },
  });

  sendJson(res, 200, { url: session.url, id: session.id });
  return true;
}

async function handleApi(req, res, pathname) {
  try {
    if (pathname.startsWith("/api/auth")) {
      const handled = await handleAuthApi(req, res, pathname, { sendJson, readJsonBody });
      if (handled) return true;
    }

    if (pathname.startsWith("/api/admin")) {
      const handled = await handleAdminApi(req, res, pathname);
      if (handled) return true;
    }

    if (pathname === "/api/makes" && req.method === "GET") {
      return await handleMakes(req, res);
    }

    if (pathname === "/api/models" && req.method === "GET") {
      return await handleModels(req, res);
    }

    if (pathname === "/api/checkout/session") {
      return await handleCheckoutSession(req, res);
    }

    if (pathname === "/api/parts" || pathname.startsWith("/api/parts/")) {
      const handled = await handleParts(req, res, pathname);
      if (handled) return true;
    }

    if (pathname === "/api/health" && req.method === "GET") {
      sendJson(res, 200, {
        ok: true,
        supabase: isSupabaseEnabled(),
        supabaseWrites: hasSupabaseWrites(),
      });
      return true;
    }
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "Internal server error" });
    return true;
  }

  return false;
}

module.exports = { handleApi };
