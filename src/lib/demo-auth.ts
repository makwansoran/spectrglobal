export const DEMO_COOKIE = "spectr_demo_session";

export const LOCAL_USERNAME = "user 1";
export const LOCAL_PASSWORD = "user 1";
export const ADMIN_USERNAME = "spectr1";
export const ADMIN_PASSWORD = "spectr2";

const SESSION_SECRET = "spectr-local-session";

export type LocalRole = "user" | "admin";
export type LocalSession = { username: string; role: LocalRole };

export function verifyLocalCredentials(username: string, password: string): LocalSession | null {
  const name = username.trim();
  if (name === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return { username: name, role: "admin" };
  }
  if (name === LOCAL_USERNAME && password === LOCAL_PASSWORD) {
    return { username: name, role: "user" };
  }
  return null;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): Uint8Array {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export async function signLocalSession(username: string, role: LocalRole): Promise<string> {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        username: username.trim(),
        role,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
      }),
    ),
  );
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function readDemoSession(
  token: string | undefined,
): Promise<LocalSession | null> {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = await hmac(payload);
  if (!timingSafeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      username?: string;
      email?: string;
      role?: LocalRole;
      exp?: number;
    };
    const username = data.username?.trim() || data.email?.trim();
    if (!username || !data.exp || data.exp < Date.now()) return null;
    const role: LocalRole =
      data.role === "admin" || username === ADMIN_USERNAME ? "admin" : "user";
    return { username, role };
  } catch {
    return null;
  }
}
