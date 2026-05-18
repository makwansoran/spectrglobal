import type { CommodityProfile } from "../types/commodity";
import { QuickStatsRow } from "./QuickStatsRow";

type Props = { commodity: CommodityProfile };

export function CommodityHero({ commodity }: Props) {
  return (
    <header className="relative border-b border-line bg-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 0%, rgba(183, 148, 246, 0.14), transparent 70%), radial-gradient(ellipse 40% 35% at 80% 40%, rgba(147, 197, 253, 0.12), transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4 md:gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-line bg-canvas font-display text-xl font-bold text-ink md:h-20 md:w-20 md:text-2xl">
              {commodity.logoInitials}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">{commodity.name}</h1>
              <p className="mt-1 text-sm text-muted">Futures contract · {commodity.categoryLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {commodity.industryTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-line bg-white px-2.5 py-0.5 text-xs font-medium text-ink"
                  >
                    {tag}
                  </span>
                ))}
                <span className="rounded border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-xs font-medium text-accent">
                  Commodity
                </span>
                {commodity.exchange ? (
                  <span className="rounded border border-line bg-canvas px-2.5 py-0.5 font-mono text-xs text-muted">
                    {commodity.exchange}
                  </span>
                ) : null}
                {commodity.symbol ? (
                  <span className="rounded border border-line bg-canvas px-2.5 py-0.5 font-mono text-xs text-ink">
                    {commodity.symbol}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
            <button type="button" className="btn-primary">
              Follow
            </button>
            <button type="button" className="btn-ghost">
              Export
            </button>
            <button type="button" className="btn-ghost">
              Share
            </button>
          </div>
        </div>

        <QuickStatsRow stats={commodity.quickStats} />
      </div>
    </header>
  );
}
