import { useEffect, useId, useRef, useState } from "react";
import { useAuthSession } from "../hooks/useAuthSession";

function initials(username: string | null | undefined, email: string | undefined) {
  const name = username || email || "?";
  const parts = name.replace(/^@/, "").split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function UserMenu() {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { user, ready, logout } = useAuthSession();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  if (!ready) {
    return <span className="user-menu-spacer" aria-hidden />;
  }

  if (!user) {
    const next = encodeURIComponent(
      typeof window !== "undefined" ? window.location.pathname + window.location.search : "/"
    );
    return (
      <a href={`/login.html?next=${next}`} className="user-menu-login">
        Login
      </a>
    );
  }

  const label = user.username ? `@${user.username}` : user.email;

  return (
    <div ref={wrapRef} className={`user-menu${open ? " is-open" : ""}`}>
      <button
        type="button"
        className="user-menu-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="user-menu-avatar" aria-hidden>
          {initials(user.username, user.email)}
        </span>
        <span className="sr-only">Account menu</span>
      </button>
      {open && (
        <div
          id={menuId}
          className="user-menu-panel"
          role="menu"
          aria-label="Account"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="user-menu-label">{label}</p>
          <a href="/settings.html" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            Settings
          </a>
          <a href="/watchlist.html" className="user-menu-item" role="menuitem" onClick={() => setOpen(false)}>
            Watchlist
          </a>
          <button type="button" className="user-menu-item user-menu-item--danger" role="menuitem" onClick={logout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
