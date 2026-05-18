import type { ReactNode } from "react";
import type { CommodityProfile } from "../../types/commodity";

function SidebarCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="spectr-card p-4 md:p-5">
      <h3 className="section-label mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function CommoditySidebar({
  commodity,
  layout = "stack",
}: {
  commodity: CommodityProfile;
  layout?: "stack" | "grid";
}) {
  const wrapClass =
    layout === "grid"
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      : "space-y-4 lg:sticky lg:top-32";

  return (
    <div className={wrapClass}>
      <SidebarCard title="Data sources">
        <ul className="space-y-1.5 text-sm text-muted">
          {commodity.dataSources.map((s) => (
            <li key={s.name}>
              {s.url ? (
                <a href={s.url} className="text-accent hover:underline" target="_blank" rel="noreferrer">
                  {s.name}
                </a>
              ) : (
                s.name
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
          Last updated{" "}
          <time className="font-mono text-ink/70">
            {new Date(commodity.lastUpdated).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </p>
      </SidebarCard>
    </div>
  );
}
