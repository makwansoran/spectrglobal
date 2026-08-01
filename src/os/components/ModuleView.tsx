"use client";

import type { JSX } from "react";
import { useRouter } from "next/navigation";
import type { ViewId } from "../lib/views";
import { VIEW_META } from "../lib/views";
import { createClient } from "@/lib/supabase/client";

interface ModuleViewProps {
  id: Exclude<ViewId, "command" | "metaphysics" | "catalog" | "map" | "argus">;
}

export default function ModuleView({ id }: ModuleViewProps): JSX.Element {
  const meta = VIEW_META[id];
  const router = useRouter();

  async function signOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    try {
      await fetch("/api/auth/demo", { method: "DELETE" });
    } catch {
      // ignore
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-8 py-5">
        <h1 className="text-lg font-medium text-ink">{meta.title}</h1>
        <p className="mt-1 text-sm text-ink-dim">{meta.description}</p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8">
        <p className="max-w-md text-center text-sm text-ink-faint">
          This module is ready. Connect your data plane or ask the Command chat to operate it.
        </p>
        {id === "settings" ? (
          <button type="button" onClick={() => void signOut()} className="bevel bevel-sm bevel-quiet">
            Sign out
          </button>
        ) : null}
      </div>
    </div>
  );
}
