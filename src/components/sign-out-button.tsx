"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton({ dark = false, href = "/login" }: { dark?: boolean; href?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await fetch("/api/auth/demo", { method: "DELETE" });
    router.replace(href);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className={dark ? "ops-signout disabled:opacity-60" : "rounded-md border border-border bg-white px-3 py-1.5 text-[13px] font-medium text-ink hover:bg-surface-2 disabled:opacity-60"}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
