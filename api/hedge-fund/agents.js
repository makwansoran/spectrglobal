const { requireAuth, backendBase, readBearer } = require("../lib/token");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!requireAuth(req, res)) return;

  try {
    const upstream = await fetch(backendBase() + "/hedge-fund/agents", {
      headers: { Authorization: "Bearer " + readBearer(req) },
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (e) {
    return res.status(502).json({
      error: "Could not reach AI Hedge Fund backend. Is it running?",
      detail: String(e.message || e),
    });
  }
};
