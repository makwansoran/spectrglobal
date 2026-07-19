import { BevelButton } from "@/components/bevel-button";

type RoadmapPhase = {
  year: string;
  scale: string;
  autonomy: string[];
  command: string[];
};

type HomeRoadmapProps = {
  title: string;
  note: string;
  learnMore: string;
  phases: RoadmapPhase[];
  autonomyLabel: string;
  commandLabel: string;
};

export function HomeRoadmap({
  title,
  note,
  learnMore,
  phases,
  autonomyLabel,
  commandLabel,
}: HomeRoadmapProps) {
  return (
    <section className="brand-font bg-surface px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[88rem]">
        <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl lg:text-6xl">
          {title}
        </h2>

        <div className="mt-16 space-y-0 border-t border-border">
          {phases.map((phase) => (
            <article
              key={phase.year}
              className="grid gap-8 border-b border-border py-12 lg:grid-cols-[0.35fr_0.65fr]"
            >
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                  {phase.year}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-fg sm:text-4xl">
                  {phase.scale}
                </p>
              </div>
              <div className="grid gap-10 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {autonomyLabel}
                  </p>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-muted">
                    {phase.autonomy.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                    {commandLabel}
                  </p>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-muted">
                    {phase.command.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-base leading-7 text-muted">{note}</p>
          <BevelButton href="/security" className="w-fit shrink-0">
            {learnMore}
            <span aria-hidden="true">→</span>
          </BevelButton>
        </div>
      </div>
    </section>
  );
}
