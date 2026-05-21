/**
 * Minimal API router for Spectr Parts (customer sign-in only).
 */
const { handleAuthApi } = require("./auth-api");
const { getAdminClient, isSupabaseEnabled } = require("./supabase-client");

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

  let query = getAdminClient()
    .from("makes")
    .select("slug, name, country, region, active, logo_text")
    .order("active", { ascending: false })
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

async function handleApi(req, res, pathname) {
  try {
    if (pathname.startsWith("/api/auth")) {
      const handled = await handleAuthApi(req, res, pathname, { sendJson, readJsonBody });
      if (handled) return true;
    }

    if (pathname === "/api/makes" && req.method === "GET") {
      return await handleMakes(req, res);
    }

    if (pathname === "/api/health" && req.method === "GET") {
      sendJson(res, 200, {
        ok: true,
        supabase: isSupabaseEnabled(),
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
