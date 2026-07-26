import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { useCases, useCasesSection } from "@/lib/content";

export function UseCases() {
  return (
    <section id="use-cases" className="section scroll-mt-20">
      <div className="container-x">
        <SectionHeading
          eyebrow={useCasesSection.eyebrow}
          title={useCasesSection.title}
          subtitle={useCasesSection.subtitle}
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {useCases.map((useCase, index) => (
            <Reveal key={useCase.title} delay={index * 90}>
              <article className="card card-hover flex h-full flex-col p-8">
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="brand-font mt-5 text-xl font-semibold tracking-tight text-fg">
                  {useCase.title}
                </h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted">{useCase.description}</p>
                <ul className="mt-7 flex flex-wrap gap-2 border-t border-border pt-6">
                  {useCase.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-full border border-border bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
