import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChatMessages,
  postChatMessage,
  type ChatMessage,
  type ChatRoomType,
} from "../api/chat";
import { getAuthorId, getAuthorName } from "../lib/chatIdentity";
import { getSupabaseBrowserClient, isSupabaseRealtimeConfigured } from "../lib/supabaseClient";

const POLL_MS = 4000;

function mergeMessage(list: ChatMessage[], incoming: ChatMessage): ChatMessage[] {
  if (list.some((m) => m.id === incoming.id)) return list;
  return [...list, incoming].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function useChatRoom(roomType: ChatRoomType, roomSlug: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const authorId = useRef(getAuthorId());

  const load = useCallback(async () => {
    if (!roomSlug) return;
    try {
      const { messages: list } = await fetchChatMessages(roomType, roomSlug);
      setMessages(list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load chat");
    }
  }, [roomType, roomSlug]);

  useEffect(() => {
    if (!roomSlug) {
      setLoading(false);
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchChatMessages(roomType, roomSlug)
      .then(({ messages: list }) => {
        if (!cancelled) {
          setMessages(list);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roomType, roomSlug]);

  useEffect(() => {
    if (!roomSlug || !isSupabaseRealtimeConfigured()) {
      setLive(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channel = supabase
      .channel(`chat:${roomType}:${roomSlug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_type=eq.${roomType}&&room_slug=eq.${roomSlug}`,
        },
        (payload) => {
          const row = payload.new as Record<string, string>;
          if (row.room_slug !== roomSlug) return;
          const msg: ChatMessage = {
            id: row.id,
            roomType: row.room_type,
            roomSlug: row.room_slug,
            authorId: row.author_id,
            authorName: row.author_name,
            body: row.body,
            createdAt: row.created_at,
          };
          setMessages((prev) => mergeMessage(prev, msg));
        }
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });

    return () => {
      setLive(false);
      void supabase.removeChannel(channel);
    };
  }, [roomType, roomSlug]);

  useEffect(() => {
    if (!roomSlug || isSupabaseRealtimeConfigured()) return undefined;

    const id = window.setInterval(() => {
      void load();
    }, POLL_MS);
    return () => window.clearInterval(id);
  }, [roomSlug, load]);

  const send = useCallback(
    async (body: string, authorName: string) => {
      if (!roomSlug) return;
      const text = body.trim();
      if (!text) return;

      setSending(true);
      setError(null);
      try {
        const { message } = await postChatMessage(roomType, roomSlug, {
          authorId: authorId.current,
          authorName: authorName.trim() || "Anonymous",
          body: text,
        });
        setMessages((prev) => mergeMessage(prev, message));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not send message");
        throw err;
      } finally {
        setSending(false);
      }
    },
    [roomType, roomSlug]
  );

  return {
    messages,
    loading,
    sending,
    error,
    live,
    authorId: authorId.current,
    defaultName: getAuthorName(),
    send,
  };
}
