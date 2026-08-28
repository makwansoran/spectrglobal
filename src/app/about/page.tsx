import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { buildPageMetadata } from "@/lib/metadata";
import { teamExperience } from "@/lib/team";

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
            <dl className="grid gap-8 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl border border-border bg-white p-6">
                  <dt className="text-sm text-muted">{fact.label}</dt>
                  <dd className="display mt-3 text-3xl text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-t border-border bg-white py-16 sm:py-24">
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
