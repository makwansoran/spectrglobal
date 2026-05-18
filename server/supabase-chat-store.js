/**
 * Supabase chat_messages storage + realtime-ready table.
 */
const { createClient } = require("@supabase/supabase-js");

let adminClient;

function getSupabaseKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
}

function isSupabaseEnabled() {
  return Boolean(process.env.SUPABASE_URL && getSupabaseKey());
}

function hasSupabaseWrites() {
  return isSupabaseEnabled();
}

function getClient() {
  if (!isSupabaseEnabled()) throw new Error("Supabase is not configured");
  if (!adminClient) {
    adminClient = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return adminClient;
}

function rowToMessage(row) {
  return {
    id: row.id,
    roomType: row.room_type,
    roomSlug: row.room_slug,
    authorId: row.author_id,
    authorName: row.author_name,
    body: row.body,
    createdAt: row.created_at,
  };
}

async function listMessagesSupabase(roomType, roomSlug, limit = 50) {
  const { data, error } = await getClient()
    .from("chat_messages")
    .select("id, room_type, room_slug, author_id, author_name, body, created_at")
    .eq("room_type", roomType)
    .eq("room_slug", roomSlug)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(rowToMessage);
}

async function insertMessageSupabase(roomType, roomSlug, { authorId, authorName, body }) {
  const { data, error } = await getClient()
    .from("chat_messages")
    .insert({
      room_type: roomType,
      room_slug: roomSlug,
      author_id: authorId,
      author_name: authorName,
      body,
    })
    .select("id, room_type, room_slug, author_id, author_name, body, created_at")
    .single();

  if (error) throw error;
  return rowToMessage(data);
}

module.exports = {
  isSupabaseEnabled,
  hasSupabaseWrites,
  listMessagesSupabase,
  insertMessageSupabase,
};
