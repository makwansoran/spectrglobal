/**
 * Chat — Supabase only (table: chat_messages).
 */
const { isSupabaseEnabled, requireSupabase } = require("./supabase-client");

let supabaseChat;

function getSupabaseChat() {
  if (supabaseChat !== undefined) return supabaseChat;
  try {
    supabaseChat = require("./supabase-chat-store");
  } catch {
    supabaseChat = null;
  }
  return supabaseChat;
}

const MAX_BODY = 2000;
const MAX_FETCH = 100;

async function listMessages(roomType, roomSlug, limit = 50) {
  requireSupabase();
  const sb = getSupabaseChat();
  if (!sb?.isSupabaseEnabled?.()) {
    throw new Error("chat_messages table requires Supabase");
  }
  const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), MAX_FETCH);
  return sb.listMessagesSupabase(roomType, roomSlug, lim);
}

async function postMessage(roomType, roomSlug, { authorId, authorName, body }) {
  requireSupabase();
  const type = String(roomType || "").trim();
  const slug = String(roomSlug || "").trim();
  if (!type || !slug) throw new Error("Invalid room");
  if (type !== "company" && type !== "commodity") throw new Error("Invalid room type");

  const text = String(body || "").trim();
  if (!text) throw new Error("Message cannot be empty");
  if (text.length > MAX_BODY) throw new Error(`Message too long (max ${MAX_BODY} characters)`);

  const aid = String(authorId || "").trim().slice(0, 64);
  const name = String(authorName || "Anonymous").trim().slice(0, 48) || "Anonymous";
  if (!aid) throw new Error("Missing author id");

  const sb = getSupabaseChat();
  if (!sb?.hasSupabaseWrites?.()) {
    throw new Error("Chat writes require Supabase");
  }
  return sb.insertMessageSupabase(type, slug, { authorId: aid, authorName: name, body: text });
}

function storageMode() {
  return isSupabaseEnabled() ? "supabase" : "unconfigured";
}

module.exports = {
  listMessages,
  postMessage,
  storageMode,
  MAX_BODY,
};
