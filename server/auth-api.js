/**
 * Customer sign-in API — saves to public.customer_signins (no Supabase Auth).
 */
const { getAdminClient, isSupabaseEnabled, hasSupabaseWrites } = require("./supabase-client");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeText(value, maxLength) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maxLength);
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function validateCustomerSigninBody(body) {
  const name = normalizeText(body.name, 120);
  const email = normalizeEmail(body.email);
  const phone = normalizeText(body.phone, 40);
  const source = normalizeText(body.source, 60) || "login_page";

  if (!name) return { error: "Name is required." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  return { name, email, phone: phone || null, source };
}

async function handleCustomerSignin(body, req) {
  if (!hasSupabaseWrites()) {
    return {
      status: 503,
      body: {
        error:
          "Saving sign-in details requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.",
      },
    };
  }

  const parsed = validateCustomerSigninBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };

  const metadata = {
    page: normalizeText(body.page || body.path, 200),
    referrer: normalizeText(body.referrer, 500),
    remember: body.remember === true,
  };

  const { data, error } = await getAdminClient()
    .from("customer_signins")
    .insert({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      source: parsed.source,
      user_agent: normalizeText(req.headers["user-agent"], 500) || null,
      metadata,
    })
    .select("id, name, email, created_at")
    .single();

  if (error) {
    return { status: 500, body: { error: error.message || "Could not save sign-in details." } };
  }

  return { status: 201, body: { ok: true, user: data } };
}

async function handleAuthApi(req, res, pathname, { sendJson, readJsonBody }) {
  if (!pathname.startsWith("/api/auth")) return false;

  if (!isSupabaseEnabled()) {
    sendJson(res, 503, {
      error:
        "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/schema.sql.",
    });
    return true;
  }

  try {
    if (pathname === "/api/auth/customer-signin" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleCustomerSignin(body, req);
      sendJson(res, result.status, result.body);
      return true;
    }
  } catch (err) {
    console.error("Auth API error:", err);
    sendJson(res, 500, { error: err.message || "Auth error" });
    return true;
  }

  sendJson(res, 404, { error: "Not found" });
  return true;
}

module.exports = { handleAuthApi };
