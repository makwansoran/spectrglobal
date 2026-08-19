"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
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
