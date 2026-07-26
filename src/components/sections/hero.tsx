import { ArrowIcon, Button } from "@/components/button";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32">
      <div className="container-x">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="eyebrow fade-up">{hero.eyebrow}</span>

          <h1 className="display fade-up fade-up-2 mt-8 text-4xl text-gradient sm:text-6xl lg:text-[4.25rem]">
            {hero.title}
          </h1>

          <p className="fade-up fade-up-3 mt-7 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="fade-up fade-up-4 mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <ArrowIcon />
            </Button>
            <Button href={hero.secondaryCta.href} size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>

          <p className="fade-up fade-up-5 mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {hero.note}
          </p>
        </div>

        <div className="fade-up fade-up-5 mx-auto mt-20 max-w-5xl">
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}

const panelRows = [
  { code: "A-14-03", task: "Putaway · 24 cartons", status: "Complete", tone: "done" },
  { code: "B-07-11", task: "Pick wave · 186 lines", status: "Running", tone: "live" },
  { code: "C-02-08", task: "Cycle count · zone C", status: "Running", tone: "live" },
  { code: "D-11-02", task: "Slotting review · 42 SKUs", status: "Queued", tone: "idle" },
];

function HeroPanel() {
  return (
    <div className="card card-glow p-1.5">
      <div className="rounded-[13px] bg-[#07080d] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div className="flex items-center gap-2.5">
            <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              Spectr WMS · live floor
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Metric label="Stock accuracy" value="99.4%" />
            <Metric label="Open exceptions" value="3" />
            <Metric label="Units active" value="12" />
          </div>
        </div>

        <ul className="mt-2 divide-y divide-border">
          {panelRows.map((row) => (
            <li key={row.code} className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-mono text-[11px] tracking-[0.1em] text-muted">{row.code}</span>
                <span className="truncate text-sm text-fg/85">{row.task}</span>
              </div>
              <StatusPill status={row.status} tone={row.tone} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="brand-font text-base font-semibold tracking-tight text-fg">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</div>
    </div>
  );
}

function StatusPill({ status, tone }: { status: string; tone: string }) {
  const styles =
    tone === "done"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
      : tone === "live"
        ? "border-accent/30 bg-accent/10 text-accent"
        : "border-border bg-white/[0.03] text-muted";

  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${styles}`}
    >
      {status}
    </span>
  );
}
