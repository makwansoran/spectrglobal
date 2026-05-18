import type { ReactNode } from "react";
import type { CompanyProfile } from "../../types/company";
import { formatCurrency } from "../../utils/format";

function SidebarCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="spectr-card p-4 md:p-5">
      <h3 className="section-label mb-3">{title}</h3>
      {children}
    </div>
  );
}

export function Sidebar({ company }: { company: CompanyProfile }) {
  return (
    <div className="space-y-4 lg:sticky lg:top-32">
      {company.keyFacts.length > 0 && (
        <SidebarCard title="Key facts">
          <dl className="space-y-2.5">
            {company.keyFacts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs text-muted">{f.label}</dt>
                <dd className="text-sm font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </SidebarCard>
      )}

      {company.competitors.length > 0 && (
        <SidebarCard title="Competitors">
          <ul className="space-y-2">
            {company.competitors.map((c) => (
              <li key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-ink">{c.name}</span>
                <span className="font-mono text-xs text-muted">{c.country}</span>
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}

      {company.funding.length > 0 && (
        <SidebarCard title="Funding & M&A">
          <ul className="space-y-3">
            {company.funding.map((e) => (
              <li key={e.id} className="border-l-2 border-accent pl-3">
                <p className="text-xs text-muted">
                  {e.date} · {e.type}
                </p>
                <p className="text-sm text-ink">{e.description}</p>
                {e.amount != null && (
                  <p className="mt-0.5 font-mono text-sm text-accent">{formatCurrency(e.amount)}</p>
                )}
              </li>
            ))}
          </ul>
        </SidebarCard>
      )}

      <SidebarCard title="ESG risk score">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xl font-bold"
            style={{
              borderColor:
                company.esg.overall >= 70 ? "#0d8050" : company.esg.overall >= 50 ? "#bf7326" : "#c23030",
              color:
                company.esg.overall >= 70 ? "#0d8050" : company.esg.overall >= 50 ? "#bf7326" : "#c23030",
            }}
          >
            {company.esg.overall}
          </div>
          <div className="flex-1 space-y-1 text-xs">
            {(
              [
                ["Environmental", company.esg.environmental],
                ["Social", company.esg.social],
                ["Governance", company.esg.governance],
              ] as const
            ).map(([label, score]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-muted">{label}</span>
                <span className="font-mono text-ink">{score}</span>
              </div>
            ))}
          </div>
        </div>
      </SidebarCard>

      <SidebarCard title="Data sources">
        <ul className="space-y-1.5 text-sm text-muted">
          {company.dataSources.map((s) => (
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
            {new Date(company.lastUpdated).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </p>
      </SidebarCard>
    </div>
  );
}
