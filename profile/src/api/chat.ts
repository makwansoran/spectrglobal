export type ChatMessage = {
  id: string;
  roomType: string;
  roomSlug: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type ChatRoomType = "company" | "commodity";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchChatMessages(
  roomType: ChatRoomType,
  roomSlug: string,
  limit = 50
): Promise<{ messages: ChatMessage[]; realtime: boolean }> {
  const params = new URLSearchParams({
    roomType,
    roomSlug,
    limit: String(limit),
  });
  const res = await fetch(`${apiBase}/api/chat?${params}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to load chat");
  }
  return res.json();
}

export async function postChatMessage(
  roomType: ChatRoomType,
  roomSlug: string,
  payload: { authorId: string; authorName: string; body: string }
): Promise<{ message: ChatMessage; realtime: boolean }> {
  const params = new URLSearchParams({ roomType, roomSlug });
  const res = await fetch(`${apiBase}/api/chat?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to send message");
  }
  return res.json();
}
