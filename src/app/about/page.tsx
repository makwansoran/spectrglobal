import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { buildPageMetadata } from "@/lib/metadata";

const intro =
  "Spectr is a Norwegian software company. We build Spectr OS — the operating system for warehouses and industrial floors — with AIM, Metaphysics, and Argus.";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: intro,
  path: "/about",
});

const paragraphs = [
  "Physical work is where the labour shortage bites hardest. Warehouses, distribution centres and factory floors run on shifts that are difficult to fill, on tasks that wear people down, and on systems that were designed for a slower decade. That is the problem we set out to work on.",
  "Our conviction is that the hard part of warehouse intelligence is not another dashboard. What is missing is a truthful, continuously updated model of a real working environment — where the stock is, how the aisles behave, what goes wrong on a Tuesday afternoon, and what a competent operator does about it.",
  "That model does not come from a lab. It comes from software running a real warehouse. So we built Spectr OS: AIM for decisions, Metaphysics for ontology, and Argus for object detection — given to enterprises without a licence fee, without a user cap and without an expiry date.",
  "We are a small team working from Norway, deliberately close to the operators we build for. If that sounds like the kind of problem you want to spend a decade on, we would like to hear from you.",
];

const facts = [
  { label: "Founded", value: "Norway" },
  { label: "Focus", value: "Spectr OS" },
  { label: "Layers", value: "AIM · Metaphysics · Argus" },
  { label: "Stage", value: "Pilot programme" },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader title="Building for the work that cannot be done remotely." intro={intro} />

        <section className="pb-16">
          <div className="container-x">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                    {fact.label}
                  </dt>
                  <dd className="brand-font mt-3 text-lg font-semibold tracking-tight text-fg">
                    {fact.value}
                  </dd>
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
      </main>
      <Footer />
    </>
  );
}
