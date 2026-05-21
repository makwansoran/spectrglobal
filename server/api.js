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
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 1), 300);

  let query = getReadClient()
    .from("makes")
    .select("slug, name, country, region, active, logo_text, popularity_rank")
    .order("popularity_rank", { ascending: true, nullsFirst: false })
    .order("name", { ascending: true })
    .limit(limit);

  if (activeOnly) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) {
    sendJson(res, 500, { error: error.message || "Could not load car makes." });
    return true;
  }

  sendJson(res, 200, { makes: data || [] });
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

  sendJson(res, 200, { parts: (data || []).map(partFromRow) });
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
