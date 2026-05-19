import { useCallback, useEffect, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  username: string | null;
  role?: string;
};

type SessionPayload = {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
  user?: AuthUser;
};

declare global {
  interface Window {
    SpectrAuth?: {
      getSession: () => SessionPayload | null;
      saveSession: (payload: SessionPayload, remember?: boolean) => SessionPayload;
      clearSession: () => void;
      isExpired: (session: SessionPayload) => boolean;
      authHeaders: (session?: SessionPayload | null) => Record<string, string>;
      rememberEnabled: () => boolean;
      formatApiError?: (data: unknown, fallback?: string) => string;
    };
  }
}

function readSession(): SessionPayload | null {
  return window.SpectrAuth?.getSession() ?? null;
}

async function refreshSession(session: SessionPayload): Promise<SessionPayload | null> {
  if (!session.refresh_token || !window.SpectrAuth) return null;
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const data = (await res.json().catch(() => ({}))) as SessionPayload & { error?: string };
  if (!res.ok || !data.access_token) return null;
  return window.SpectrAuth.saveSession(data, window.SpectrAuth.rememberEnabled());
}

async function fetchMe(session: SessionPayload): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", {
    headers: window.SpectrAuth?.authHeaders(session) ?? {},
  });
  const data = (await res.json().catch(() => ({}))) as { user?: AuthUser };
  if (!res.ok || !data.user) return null;
  return data.user;
}

export function useAuthSession() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  const resolve = useCallback(async () => {
    const auth = window.SpectrAuth;
    if (!auth) {
      setUser(null);
      setReady(true);
      return;
    }

    let session = readSession();
    if (!session?.access_token) {
      setUser(null);
      setReady(true);
      return;
    }

    if (auth.isExpired(session) && session.refresh_token) {
      session = (await refreshSession(session)) ?? null;
    }

    if (!session?.access_token || auth.isExpired(session)) {
      auth.clearSession();
      setUser(null);
      setReady(true);
      return;
    }

    if (session.user?.email && session.user?.role) {
      setUser(session.user);
      setReady(true);
      return;
    }

    const me = await fetchMe(session);
    if (me) {
      session.user = me;
      auth.saveSession(session, auth.rememberEnabled());
      setUser(me);
    } else {
      setUser(session.user ?? null);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    void resolve();
  }, [resolve]);

  const logout = useCallback(() => {
    window.SpectrAuth?.clearSession();
    setUser(null);
    window.location.href = "/login.html";
  }, []);

  return { user, ready, logout, refresh: resolve };
}
