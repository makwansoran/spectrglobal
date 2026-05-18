const AUTHOR_ID_KEY = "spectr-chat-author-id";
const AUTHOR_NAME_KEY = "spectr-chat-author-name";

function randomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `u-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export function getAuthorId(): string {
  try {
    const existing = localStorage.getItem(AUTHOR_ID_KEY);
    if (existing?.trim()) return existing.trim();
    const id = randomId();
    localStorage.setItem(AUTHOR_ID_KEY, id);
    return id;
  } catch {
    return randomId();
  }
}

export function getAuthorName(): string {
  try {
    return localStorage.getItem(AUTHOR_NAME_KEY)?.trim() || "";
  } catch {
    return "";
  }
}

export function setAuthorName(name: string) {
  try {
    localStorage.setItem(AUTHOR_NAME_KEY, name.trim().slice(0, 48));
  } catch {
    /* ignore */
  }
}
