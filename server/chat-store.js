/**
 * Chat rooms keyed by room_type + room_slug (company | commodity).
 * Supabase when configured; else local JSON files under data/chat/.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LOCAL_CHAT_DIR = path.join(ROOT, "data", "chat");
const MAX_BODY = 2000;
const MAX_FETCH = 100;

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

function roomKey(roomType, roomSlug) {
  return `${roomType}:${roomSlug}`;
}

function localRoomPath(roomType, roomSlug) {
  const safe = `${roomType}-${roomSlug}`.replace(/[^a-z0-9-]/gi, "-").slice(0, 120);
  return path.join(LOCAL_CHAT_DIR, `${safe}.json`);
}

function readLocalRoom(roomType, roomSlug) {
  const file = localRoomPath(roomType, roomSlug);
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeLocalRoom(roomType, roomSlug, messages) {
  fs.mkdirSync(LOCAL_CHAT_DIR, { recursive: true });
  const trimmed = messages.slice(-500);
  fs.writeFileSync(localRoomPath(roomType, roomSlug), JSON.stringify(trimmed));
  return trimmed;
}

function normalizeMessage(row) {
  return {
    id: row.id,
    roomType: row.room_type || row.roomType,
    roomSlug: row.room_slug || row.roomSlug,
    authorId: row.author_id || row.authorId,
    authorName: row.author_name || row.authorName,
    body: row.body,
    createdAt: row.created_at || row.createdAt,
  };
}

async function listMessages(roomType, roomSlug, limit = 50) {
  const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), MAX_FETCH);
  const sb = getSupabaseChat();
  if (sb?.isSupabaseEnabled?.()) {
    try {
      return await sb.listMessagesSupabase(roomType, roomSlug, lim);
    } catch (err) {
      console.warn("Supabase chat list failed:", err.message);
    }
  }
  return readLocalRoom(roomType, roomSlug)
    .slice(-lim)
    .map(normalizeMessage);
}

async function postMessage(roomType, roomSlug, { authorId, authorName, body }) {
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
  if (sb?.hasSupabaseWrites?.()) {
    try {
      return await sb.insertMessageSupabase(type, slug, { authorId: aid, authorName: name, body: text });
    } catch (err) {
      console.warn("Supabase chat insert failed:", err.message);
    }
  }

  const msg = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    roomType: type,
    roomSlug: slug,
    authorId: aid,
    authorName: name,
    body: text,
    createdAt: new Date().toISOString(),
  };
  const room = readLocalRoom(type, slug);
  room.push(msg);
  writeLocalRoom(type, slug, room);
  return msg;
}

function storageMode() {
  const sb = getSupabaseChat();
  if (sb?.isSupabaseEnabled?.()) return "supabase";
  return "local";
}

module.exports = {
  listMessages,
  postMessage,
  storageMode,
  roomKey,
  MAX_BODY,
};
