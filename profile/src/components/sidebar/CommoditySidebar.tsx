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

export function CommoditySidebar({ commodity }: { commodity: CommodityProfile }) {
  return (
    <div className="space-y-4 lg:sticky lg:top-32">
      {commodity.keyFacts.length > 0 && (
        <SidebarCard title="Contract details">
          <dl className="space-y-2.5">
            {commodity.keyFacts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="text-sm font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </SidebarCard>
      )}

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
