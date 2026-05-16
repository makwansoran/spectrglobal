const crypto = require("crypto");

function getSecret() {
  return process.env.SPECTR_AUTH_TOKEN_SECRET || process.env.SPECTR_AUTH_PASSWORD || "";
}

function signToken(payload) {
  const secret = getSecret();
  if (!secret) return null;
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  return body + "." + sig;
}

function verifyToken(token) {
  const secret = getSecret();
  if (!secret || !token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("base64url");
  if (sig.length !== expected.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function readBearer(req) {
  const h = req.headers.authorization || req.headers.Authorization || "";
  if (typeof h === "string" && h.toLowerCase().startsWith("bearer ")) {
    return h.slice(7).trim();
  }
  return null;
}

function requireAuth(req, res) {
  const payload = verifyToken(readBearer(req));
  if (!payload) {
    res.status(401).json({ error: "Sign in required." });
    return null;
  }
  return payload;
}

function backendBase() {
  return (process.env.HEDGE_FUND_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
}

module.exports = {
  signToken,
  verifyToken,
  readBearer,
  requireAuth,
  backendBase,
  SESSION_MS: 12 * 60 * 60 * 1000,
};
