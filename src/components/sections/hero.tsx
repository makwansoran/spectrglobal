import { hero } from "@/lib/content";

/** Deterministic mosaic cells — Spectr ink/slate palette (not a brand copy of Mistral orange). */
const MOSAIC_COLORS = [
  "#0a0a0b",
  "#141416",
  "#1c1c1f",
  "#2a2a2e",
  "#3a3a40",
  "#4a4a52",
  "#5c5c66",
  "#6e6e78",
  "#8a8a94",
  "#a8a8b0",
  "#c8c8ce",
  "#e4e4e8",
  "#f0f0f2",
  "#ffffff",
  "#0a0a0b",
  "#252528",
];

const COLS = 48;
const ROWS = 6;

function mosaicColor(col: number, row: number) {
  const n = (col * 17 + row * 31 + col * row * 3) % MOSAIC_COLORS.length;
  return MOSAIC_COLORS[n]!;
}

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex min-h-0 flex-1 flex-col pt-24 sm:pt-28 lg:grid lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-[minmax(0,1.55fr)_minmax(16rem,0.72fr)] lg:pt-28">
        <div className="flex flex-1 items-end border-b border-border px-5 pb-10 pt-16 sm:px-8 sm:pb-12 lg:border-b-0 lg:border-r lg:px-12 lg:pb-14 xl:px-16">
          <h1 className="brand-font max-w-[14ch] text-[clamp(2.75rem,8vw,6.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
            <span className="block">{hero.title}</span>
            <span className="mt-1 block sm:mt-2">{hero.titleLine2}</span>
          </h1>
        </div>

        <aside className="flex flex-col justify-end gap-10 border-b border-border bg-surface-2 px-5 py-10 sm:px-8 sm:py-12 lg:border-b-0 lg:px-10 lg:pb-14 lg:pt-28 xl:px-12">
          <p className="max-w-sm text-[1.05rem] leading-8 text-fg/80 sm:text-[1.125rem] sm:leading-8">
            {hero.support}
          </p>
          <div className="flex flex-col gap-0.5 text-fg/45" aria-hidden="true">
            <span className="text-sm leading-none">↓</span>
            <span className="text-sm leading-none">↓</span>
            <span className="text-sm leading-none">↓</span>
          </div>
        </aside>
      </div>

      <div className="hero-mosaic relative h-[5.5rem] shrink-0 border-t border-border sm:h-28 lg:h-32">
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            return (
              <span
                key={i}
                style={{ backgroundColor: mosaicColor(col, row) }}
                className="block"
              />
            );
          })}
        </div>
        <p className="pointer-events-none absolute inset-y-0 right-[8%] flex items-center font-mono text-[10px] uppercase tracking-[0.28em] text-white mix-blend-difference sm:right-[12%] sm:text-[11px]">
          {hero.mosaicLabel}
        </p>
      </div>
    </section>
  );
}
