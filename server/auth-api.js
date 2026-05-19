/**
 * Spectr auth — Supabase Auth + public.profiles (username, email).
 */
const {
  getAdminClient,
  getAnonAuthClient,
  isSupabaseEnabled,
  hasSupabaseWrites,
} = require("./supabase-client");

const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function authNotConfigured(res, sendJson) {
  sendJson(res, 503, {
    error:
      "Auth is not configured. Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_ANON_KEY, then run the profiles section in supabase/schema.sql.",
  });
}

function bearerToken(req) {
  const raw = req.headers.authorization || req.headers.Authorization || "";
  const match = String(raw).match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function getProfileByUserId(userId) {
  const { data, error } = await getAdminClient()
    .from("profiles")
    .select("id, username, email, role, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function isUsernameTaken(username) {
  const { data, error } = await getAdminClient()
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .limit(1);
  if (error) {
    if (/does not exist|schema cache|Could not find the table/i.test(error.message || "")) {
      throw new Error("profiles table missing — run the profiles section in supabase/schema.sql");
    }
    throw error;
  }
  return Array.isArray(data) && data.length > 0;
}

function sessionPayload(session, profile) {
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    expires_in: session.expires_in,
    token_type: session.token_type,
    user: {
      id: session.user.id,
      email: session.user.email,
      username: profile?.username || session.user.user_metadata?.username || null,
      role: profile?.role || session.user.app_metadata?.role || "user",
    },
  };
}

function validateSignupBody(body) {
  const username = normalizeUsername(body.username);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (!USERNAME_RE.test(username)) {
    return { error: "Username must be 3–32 characters (letters, numbers, underscore only)." };
  }
  if (!EMAIL_RE.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.` };
  }
  return { username, email, password };
}

function validateLoginBody(body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  if (!EMAIL_RE.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!password) {
    return { error: "Password is required." };
  }
  return { email, password };
}

async function handleSignup(body) {
  if (!hasSupabaseWrites()) {
    return {
      status: 503,
      body: { error: "Account registration requires SUPABASE_SERVICE_ROLE_KEY on the server." },
    };
  }

  const parsed = validateSignupBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };

  const { username, email, password } = parsed;

  if (await isUsernameTaken(username)) {
    return { status: 409, body: { error: "That username is already taken." } };
  }

  const admin = getAdminClient();
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (createErr) {
    const msg = createErr.message || "Could not create account.";
    if (/already registered|already been registered|User already registered/i.test(msg)) {
      return { status: 409, body: { error: "An account with this email already exists." } };
    }
    return { status: 400, body: { error: msg } };
  }

  const userId = created.user?.id;
  if (!userId) {
    return { status: 500, body: { error: "Account created but user id missing." } };
  }

  const { error: profileErr } = await admin.from("profiles").insert({
    id: userId,
    username,
    email,
  });

  if (profileErr) {
    await admin.auth.admin.deleteUser(userId).catch(() => {});
    if (/duplicate key|unique/i.test(profileErr.message || "")) {
      return { status: 409, body: { error: "That username or email is already taken." } };
    }
    return { status: 500, body: { error: profileErr.message || "Could not save profile." } };
  }

  const { data: signIn, error: signInErr } = await getAnonAuthClient().auth.signInWithPassword({
    email,
    password,
  });

  if (signInErr || !signIn.session) {
    return {
      status: 201,
      body: {
        ok: true,
        message: "Account created. Sign in with your email and password.",
        user: { id: userId, email, username },
      },
    };
  }

  const profile = await getProfileByUserId(userId);
  return { status: 201, body: { ok: true, ...sessionPayload(signIn.session, profile) } };
}

async function handleLogin(body) {
  const parsed = validateLoginBody(body);
  if (parsed.error) return { status: 400, body: { error: parsed.error } };

  const { email, password } = parsed;
  const { data, error } = await getAnonAuthClient().auth.signInWithPassword({ email, password });

  if (error) {
    const msg = error.message || "Sign in failed.";
    if (/Invalid login credentials/i.test(msg)) {
      return { status: 401, body: { error: "Incorrect email or password." } };
    }
    return { status: 400, body: { error: msg } };
  }

  if (!data.session) {
    return { status: 401, body: { error: "Incorrect email or password." } };
  }

  const profile = await getProfileByUserId(data.session.user.id);
  return { status: 200, body: sessionPayload(data.session, profile) };
}

async function handleMe(token) {
  if (!token) {
    return { status: 401, body: { error: "Not signed in." } };
  }

  const { data, error } = await getAnonAuthClient().auth.getUser(token);
  if (error || !data.user) {
    return { status: 401, body: { error: "Session expired. Sign in again." } };
  }

  const profile = await getProfileByUserId(data.user.id);
  return {
    status: 200,
    body: {
      user: {
        id: data.user.id,
        email: data.user.email,
        username: profile?.username || data.user.user_metadata?.username || null,
        role: profile?.role || data.user.app_metadata?.role || "user",
        created_at: profile?.created_at || null,
      },
    },
  };
}

async function handleRefresh(body) {
  const refreshToken = String(body.refresh_token || "").trim();
  if (!refreshToken) {
    return { status: 400, body: { error: "refresh_token is required." } };
  }

  const { data, error } = await getAnonAuthClient().auth.refreshSession({ refresh_token: refreshToken });
  if (error || !data.session) {
    return { status: 401, body: { error: "Session expired. Sign in again." } };
  }

  const profile = await getProfileByUserId(data.session.user.id);
  return { status: 200, body: sessionPayload(data.session, profile) };
}

async function handleForgotPassword(body) {
  const email = normalizeEmail(body.email);
  if (!EMAIL_RE.test(email)) {
    return { status: 400, body: { error: "Enter a valid email address." } };
  }

  const redirectTo =
    String(body.redirect_to || "").trim() ||
    (process.env.SPECTR_SITE_URL
      ? `${String(process.env.SPECTR_SITE_URL).replace(/\/$/, "")}/login.html`
      : undefined);

  const { error } = await getAnonAuthClient().auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { status: 400, body: { error: error.message || "Could not send reset email." } };
  }

  return {
    status: 200,
    body: { ok: true, message: "If an account exists for that email, a reset link has been sent." },
  };
}

async function handleAuthApi(req, res, pathname, { sendJson, readJsonBody }) {
  if (!pathname.startsWith("/api/auth")) return false;

  if (!isSupabaseEnabled()) {
    authNotConfigured(res, sendJson);
    return true;
  }

  try {
    if (pathname === "/api/auth/signup" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleSignup(body);
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/login" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleLogin(body);
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/me" && req.method === "GET") {
      const result = await handleMe(bearerToken(req));
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/refresh" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleRefresh(body);
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/forgot-password" && req.method === "POST") {
      const body = await readJsonBody(req);
      const result = await handleForgotPassword(body);
      sendJson(res, result.status, result.body);
      return true;
    }

    if (pathname === "/api/auth/logout" && req.method === "POST") {
      sendJson(res, 200, { ok: true });
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
