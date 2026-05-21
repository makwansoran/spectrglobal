/**
 * Customer auth API — Supabase email/password accounts with server-side profile writes.
 */
const { getAdminClient, getAuthClient, isSupabaseEnabled, hasSupabaseWrites } = require("./supabase-client");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

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

function profileNameFromEmail(email) {
  return String(email || "").split("@")[0] || "Customer";
}

function validateEmailPasswordBody(body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address." };
  if (!password) return { error: "Password is required." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: "Password must be at least 6 characters." };
  }
  return { email, password };
}

function customerFromAuthUser(user, session) {
  const email = normalizeEmail(user && user.email);
  return {
    id: user && user.id,
    email,
    name: profileNameFromEmail(email),
    role: (user && user.app_metadata && user.app_metadata.role) || "customer",
    accessToken: session && session.access_token,
    created_at: user && user.created_at,
  };
}

async function saveCustomerProfile(user, body, req, source) {
  const email = normalizeEmail(user && user.email);
  if (!user || !user.id || !email) return;

  const now = new Date().toISOString();
  const metadata = {
    page: normalizeText(body.page || body.path, 200),
    referrer: normalizeText(body.referrer, 500),
    source,
  };

  const { error: profileError } = await getAdminClient()
    .from("customer_profiles")
    .upsert(
      {
        auth_user_id: user.id,
        email,
        display_name: profileNameFromEmail(email),
        last_sign_in_at: now,
        metadata,
        updated_at: now,
      },
      { onConflict: "auth_user_id" }
    );

  if (profileError) throw profileError;

  await getAdminClient()
    .from("customer_signins")
    .insert({
      auth_user_id: user.id,
      name: profileNameFromEmail(email),
      email,
      source,
      user_agent: normalizeText(req.headers["user-agent"], 500) || null,
      metadata,
    });
}

async function handleCustomerSignIn(body, req) {
  if (!hasSupabaseWrites()) {
    return {
      status: 503,
      body: {
        error:
          "Sign-in requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.",
      },
    };
  }

  const parsed = validateEmailPasswordBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };

  const { data, error } = await getAuthClient().auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });

  if (error || !data || !data.user) {
    return {
      status: 401,
      body: {
        error: "Invalid email or password. If you don't have an account, create one.",
      },
    };
  }

  await saveCustomerProfile(data.user, body, req, "login_page");

  return { status: 200, body: { ok: true, user: customerFromAuthUser(data.user, data.session) } };
}

async function handleCreateAccount(body, req) {
  if (!hasSupabaseWrites()) {
    return {
      status: 503,
      body: {
        error:
          "Account creation requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.",
      },
    };
  }

  const parsed = validateEmailPasswordBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };

  const { data: created, error: createError } = await getAdminClient().auth.admin.createUser({
    email: parsed.email,
    password: parsed.password,
    email_confirm: true,
    user_metadata: {
      source: "create_account_page",
    },
  });

  if (createError || !created || !created.user) {
    const message = createError && createError.message ? createError.message : "Could not create account.";
    const alreadyExists = /already|registered|exists/i.test(message);
    return {
      status: alreadyExists ? 409 : 400,
      body: {
        error: alreadyExists ? "An account already exists for this email. Please sign in." : message,
      },
    };
  }

  await saveCustomerProfile(created.user, body, req, "create_account_page");

  const { data: signedIn, error: signInError } = await getAuthClient().auth.signInWithPassword({
    email: parsed.email,
    password: parsed.password,
  });

  if (signInError || !signedIn || !signedIn.user) {
    return { status: 201, body: { ok: true, user: customerFromAuthUser(created.user) } };
  }

  return { status: 201, body: { ok: true, user: customerFromAuthUser(signedIn.user, signedIn.session) } };
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
    if (pathname === "/api/auth/sign-in" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleCustomerSignIn(body, req);
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/create-account" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleCreateAccount(body, req);
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
