/**
 * Minimal API router for Spectr Parts (customer sign-in only).
 */
const { handleAuthApi } = require("./auth-api");
const {
  getAdminClient,
  getReadClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");

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
    price: Number(row.price) || 0,
    stock: Number(row.stock) || 0,
    description: row.description || "",
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
    price: Number(row.price_eur) || 0,
    stock: 999,
    description: descriptionParts.join(" · "),
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

function tyrePartFromGroup(key, rows) {
  const first = rows[0] || {};
  const label = tyreSizeLabel(first);
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
    name: `Tyre ${label}`,
    category: "Tires",
    sku: `TYRE-${first.width}-${first.aspect_ratio}-R${first.rim_diameter}`,
    price: 0,
    stock: 999,
    description: descriptionParts.join(" · "),
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
    .select("id, name, viscosity, base_type, approvals, volume_liters, price_eur, active, oil_brands(name)")
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

async function handlePartsList(req, res) {
  if (!isSupabaseEnabled()) {
    sendJson(res, 503, { error: "Parts database is not configured." });
    return true;
  }

  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const activeOnly = url.searchParams.get("active") !== "0";
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "500", 10) || 500, 1), 500);

  let query = getReadClient()
    .from("parts")
    .select("id, name, category, sku, price, stock, description, vehicles, active")
    .order("name", { ascending: true })
    .limit(limit);

  if (activeOnly) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load parts." });
    return true;
  }

  let oilParts = [];
  let tyreParts = [];
  try {
    [oilParts, tyreParts] = await Promise.all([
      fetchOilProductParts(activeOnly),
      fetchTyreSizeParts(),
    ]);
  } catch (catalogError) {
    sendJson(res, 500, { error: catalogError.message || "Could not load derived catalog products." });
    return true;
  }

  const parts = dedupeCatalogParts([
    ...(data || []).map(partFromRow),
    ...oilParts,
    ...tyreParts,
  ]).slice(0, limit);

  sendJson(res, 200, { parts });
  return true;
}

async function handlePartsCreate(req, res, body) {
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
    .select("id, name, category, sku, price, stock, description, vehicles, active")
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
    .select("id, name, category, sku, price, stock, description, vehicles, active")
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

async function handleApi(req, res, pathname) {
  try {
    if (pathname.startsWith("/api/auth")) {
      const handled = await handleAuthApi(req, res, pathname, { sendJson, readJsonBody });
      if (handled) return true;
    }

    if (pathname === "/api/makes" && req.method === "GET") {
      return await handleMakes(req, res);
    }

    if (pathname === "/api/models" && req.method === "GET") {
      return await handleModels(req, res);
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
