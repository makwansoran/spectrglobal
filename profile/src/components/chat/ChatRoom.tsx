import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChatRoom } from "../../hooks/useChatRoom";
import { getAuthorName, setAuthorName } from "../../lib/chatIdentity";
import type { ChatRoomType } from "../../api/chat";

type Props = {
  roomType: ChatRoomType;
  roomSlug: string;
  roomLabel: string;
};

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function ChatRoom({ roomType, roomSlug, roomLabel }: Props) {
  const { messages, loading, sending, error, live, authorId, send } = useChatRoom(
    roomType,
    roomSlug
  );
  const [displayName, setDisplayName] = useState(() => getAuthorName());
  const [draft, setDraft] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const canSend =
    displayName.trim().length > 0 && draft.trim().length > 0 && !sending;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    const name = displayName.trim();
    setAuthorName(name);
    const text = draft;
    setDraft("");
    try {
      await send(text, name);
    } catch {
      setDraft(text);
    }
  }

  return (
    <div className="spectr-card flex min-h-[420px] flex-col overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div>
          <p className="section-label mb-0">Live discussion</p>
          <h3 className="text-base font-semibold text-ink">{roomLabel}</h3>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider ${
            live
              ? "bg-emerald-50 text-emerald-800"
              : "bg-canvas text-muted"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${live ? "animate-pulse bg-emerald-500" : "bg-muted"}`}
            aria-hidden
          />
          {live ? "Live" : "Polling"}
        </span>
      </header>

      <div className="border-b border-line bg-canvas/40 px-4 py-3">
        <label htmlFor="chat-display-name" className="section-label mb-1 block">
          Display name
        </label>
        <input
          id="chat-display-name"
          type="text"
          maxLength={48}
          value={displayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setNameTouched(true);
          }}
          onBlur={() => {
            if (displayName.trim()) setAuthorName(displayName);
          }}
          placeholder="Your name"
          className="w-full max-w-xs rounded border border-line bg-white px-3 py-2 text-sm text-ink outline-none ring-ink/20 focus:ring-2"
          autoComplete="nickname"
        />
        {nameTouched && !displayName.trim() && (
          <p className="mt-1 text-xs text-red-600">Enter a name to post messages.</p>
        )}
      </div>

      <div
        ref={listRef}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {loading && (
          <p className="text-center text-sm text-muted">Loading messages…</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-muted">
            No messages yet. Start the conversation about {roomLabel}.
          </p>
        )}
        {messages.map((msg) => {
          const mine = msg.authorId === authorId;
          return (
            <article
              key={msg.id}
              className={`flex flex-col gap-0.5 ${mine ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  mine
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-ink"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              </div>
              <p className="px-1 font-mono text-[10px] uppercase tracking-wide text-muted">
                {msg.authorName}
                {formatTime(msg.createdAt) ? ` · ${formatTime(msg.createdAt)}` : ""}
              </p>
            </article>
          );
        })}
      </div>

      {error && (
        <p className="border-t border-line bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="border-t border-line bg-white p-4"
      >
        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-message"
          rows={3}
          maxLength={2000}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSend) void handleSubmit(e);
            }
          }}
          placeholder="Share your view… (Enter to send, Shift+Enter for new line)"
          className="mb-3 w-full resize-none rounded border border-line px-3 py-2 text-sm text-ink outline-none ring-ink/20 focus:ring-2"
          disabled={sending}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-muted">
            {draft.length}/2000
          </span>
          <button type="submit" className="btn-primary" disabled={!canSend}>
            {sending ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
