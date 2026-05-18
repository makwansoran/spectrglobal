require("../scripts/load-env").loadEnv();
const { listMessages, postMessage, storageMode } = require("../server/chat-store");

module.exports = async (req, res) => {
  const roomType = String(req.query?.roomType || "").trim();
  const roomSlug = String(req.query?.roomSlug || "").trim();

  if (!roomType || !roomSlug) {
    res.status(400).json({ error: "roomType and roomSlug are required" });
    return;
  }

  if (roomType !== "company" && roomType !== "commodity") {
    res.status(400).json({ error: "roomType must be company or commodity" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Spectr-Chat-Storage", storageMode());

  try {
    if (req.method === "GET") {
      const limit = req.query?.limit || "50";
      const messages = await listMessages(roomType, roomSlug, limit);
      res.status(200).json({ messages, realtime: storageMode() === "supabase" });
      return;
    }

    if (req.method === "POST") {
      let payload = req.body;
      if (typeof payload === "string") {
        try {
          payload = JSON.parse(payload);
        } catch {
          payload = {};
        }
      }
      const message = await postMessage(roomType, roomSlug, {
        authorId: payload?.authorId,
        authorName: payload?.authorName,
        body: payload?.body,
      });
      res.status(201).json({ message, realtime: storageMode() === "supabase" });
      return;
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    const msg = err.message || "Chat error";
    const code = /empty|too long|Invalid|Missing/i.test(msg) ? 400 : 500;
    res.status(code).json({ error: msg });
  }
};
