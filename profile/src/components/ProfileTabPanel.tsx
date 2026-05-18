import type { ReactNode } from "react";

/** Minimal tab content area — no extra borders or duplicate headings. */
export function ProfileTabPanel({ children }: { children: ReactNode }) {
  return <div className="py-4">{children}</div>;
}
