import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { buildPageMetadata } from "@/lib/metadata";
import { team, teamExperience, teamIntro } from "@/lib/team";

const intro =
  "Spectr is a Norwegian software company. We build Spectr OS — the operating system for warehouses and industrial floors.";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: intro,
  path: "/about",
});

const paragraphs = [
  "Physical work is where the labour shortage bites hardest. Warehouses, distribution centres and factory floors run on shifts that are difficult to fill, on tasks that wear people down, and on systems that were designed for a slower decade. That is the problem we set out to work on.",
  "Our conviction is that the hard part of warehouse intelligence is not another dashboard. What is missing is a truthful, continuously updated model of a real working environment — where the stock is, how the aisles behave, what goes wrong on a Tuesday afternoon, and what a competent operator does about it.",
  "That model does not come from a lab. It comes from software running a real warehouse. So we built Spectr OS — given to enterprises without a licence fee, without a user cap and without an expiry date.",
  "We are a small team working from Norway, deliberately close to the operators we build for. If that sounds like the kind of problem you want to spend a decade on, we would like to hear from you.",
];

const facts = [
  { label: "Founded", value: "Norway" },
  { label: "Focus", value: "Spectr OS" },
  { label: "Product", value: "Spectr OS" },
  { label: "Stage", value: "Pilot programme" },
];

export default function AboutPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <PageHeader title="Building for the work that cannot be done remotely." intro={intro} />

        <section className="pb-16">
          <div className="container-x">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-border bg-white p-6">
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="display mt-3 text-3xl text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-x">
            <div className="mx-auto max-w-2xl space-y-6">
              {paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={index * 60}>
                  <p className="text-base leading-8 text-fg/80">{paragraph}</p>
                </Reveal>
              ))}
              <div className="pt-6">
                <Button href="/contact">
                  Get in touch
                  <ArrowIcon />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-white py-16 sm:py-24" aria-labelledby="founders-heading">
          <div className="container-x">
            <div className="max-w-2xl">
              <h2
                id="founders-heading"
                className="display text-[clamp(2rem,4vw,3.25rem)] text-fg"
              >
                Founders
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">{teamIntro}</p>
            </div>

            <ul className="mt-14 grid gap-8 lg:grid-cols-3">
              {team.map((member) => (
                <li key={member.name}>
                  <article className="h-full rounded-2xl border border-border bg-white p-7 sm:p-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                      {member.location}
                    </p>
                    <h3 className="mt-3 text-2xl font-medium tracking-[-0.03em] text-fg">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{member.role}</p>
                    <p className="mt-5 text-[15px] leading-7 text-fg/80">{member.bio}</p>
                    <dl className="mt-8 space-y-4 border-t border-border pt-6">
                      {member.experience.map((item) => (
                        <div key={item.label}>
                          <dt className="text-xs font-medium uppercase tracking-[0.08em] text-muted">
                            {item.label}
                          </dt>
                          <dd className="mt-1 text-sm leading-6 text-fg">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-white py-16 sm:py-24" aria-labelledby="who-we-are-heading">
          <div className="container-x">
            <h2
              id="who-we-are-heading"
              className="display text-[clamp(2rem,4vw,3.25rem)] text-fg"
            >
              Who we are
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {teamExperience.map((item) => (
                <article key={item.id}>
                  <h3 className="text-xl font-medium tracking-[-0.02em] text-fg">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-muted">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
