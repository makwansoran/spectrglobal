const { requireAuth, backendBase, readBearer } = require("../lib/token");

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

  if (!requireAuth(req, res)) return;

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  try {
    const upstream = await fetch(backendBase() + "/hedge-fund/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + readBearer(req),
      },
      body: JSON.stringify(body),
    });

    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    if (!upstream.body) {
      const text = await upstream.text();
      return res.send(text);
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    res.flushHeaders && res.flushHeaders();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
      if (res.flush) res.flush();
    }

    return res.end();
  } catch (e) {
    return res.status(502).json({
      error: "Could not reach AI Hedge Fund backend.",
      detail: String(e.message || e),
    });
  }
};
