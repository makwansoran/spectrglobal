const { signToken, SESSION_MS } = require("../lib/token");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const password = process.env.SPECTR_AUTH_PASSWORD;
  if (!password) {
    return res.status(503).json({
      error: "Server auth is not configured. Set SPECTR_AUTH_PASSWORD in Vercel environment variables.",
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const email = String(body.email || "").trim().toLowerCase();
  const pass = String(body.password || "");
  const expectedUser = String(process.env.SPECTR_AUTH_USER || "admin").trim().toLowerCase();

  if (email !== expectedUser || pass !== password) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const exp = Date.now() + SESSION_MS;
  const token = signToken({ sub: email, exp });
  if (!token) {
    return res.status(503).json({ error: "Could not issue session token." });
  }

  return res.status(200).json({ token, expires: exp, email });
};
