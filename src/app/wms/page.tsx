import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

const intro =
  "Spectr C2 is a complete, AI-native warehouse management system. Enterprises run it with unlimited users, locations and volume at no licence cost — permanently.";

export const metadata: Metadata = buildPageMetadata({
  title: "Spectr C2 — free for enterprises",
  description: intro,
  path: "/wms",
});

const modules = [
  {
    title: "Inbound & receiving",
    description:
      "ASN handling, blind receipts, quality holds and cross-docking, with discrepancies raised at the dock rather than discovered at the count.",
  },
  {
    title: "Putaway & slotting",
    description:
      "Location suggestions that account for velocity, weight, size and pick path, and that re-slot themselves as demand shifts rather than at an annual review.",
  },
  {
    title: "Picking & packing",
    description:
      "Wave, batch, zone and cluster picking with route optimisation, plus packing validation that catches the wrong item before it leaves the building.",
  },
  {
    title: "Inventory accuracy",
    description:
      "Continuous cycle counting driven by where the system expects error, not by a calendar. Full audit trail on every adjustment.",
  },
  {
    title: "Dispatch & carriers",
    description:
      "Load building, carrier selection, label generation and tracking handoff, with SLA visibility per client for 3PL operations.",
  },
  {
    title: "Reporting & analytics",
    description:
      "Ask questions in plain language against live data. Throughput, accuracy, labour and exception reporting without a BI project.",
  },
];

const whyFree = [
  {
    title: "What you get",
    points: [
      "The complete system, not a limited tier",
      "Unlimited users, locations and order volume",
      "No expiry date and no forced upgrade",
      "Open REST API and webhooks throughout",
      "EU hosting, or your own infrastructure",
    ],
  },
  {
    title: "What we get",
    points: [
      "Real operations running real software",
      "Ground truth on how warehouses actually behave",
      "The data foundation Spectr OS learns from",
      "Partners who know their floor better than we do",
      "A shot at the hardest problems in warehouse intelligence",
    ],
  },
];

const faqs = [
  {
    question: "What is the catch?",
    answer:
      "There is no licence fee and no usage cap. Migration, self-hosting, integrations, governance, and support are all included. There is nothing to upgrade into.",
  },
  {
    question: "Can we self-host it?",
    answer:
      "Yes. Self-hosted and private-cloud deployments are included in the free Spectr C2 tier.",
  },
  {
    question: "How does migration from our current WMS work?",
    answer:
      "We map your existing locations, SKUs and open orders, run both systems in parallel over an agreed cutover window, and reconcile before you switch. Straightforward single sites take days; multi-site rollouts with ERP integration take weeks.",
  },
  {
    question: "Is our data used to train your models?",
    answer:
      "Only where explicitly agreed in your contract, and always in aggregate. You can decline entirely without losing any functionality, and your data is never sold or shared with third parties.",
  },
];

export default function WmsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader
          title="A serious warehouse system, at no cost."
          intro={intro}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Get started free
              <ArrowIcon />
            </Button>
            <Button href="/#features" size="lg">
              See Spectr OS
            </Button>
          </div>
        </PageHeader>

        <section className="section pt-4">
          <div className="container-x">
            <SectionHeading
              title="The whole loop, from dock to dispatch."
              subtitle="No module is held back behind a paid tier. What follows is what you get on day one."
            />

            <div className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, index) => (
                <Reveal key={module.title} delay={(index % 3) * 80}>
                  <div className="h-full bg-surface p-8 transition-colors hover:bg-surface-2">
                    <h3 className="brand-font text-lg font-semibold tracking-tight text-fg">
                      {module.title}
                    </h3>
                    <p className="mt-3.5 text-sm leading-7 text-muted">{module.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading
              title="Why we give it away, stated plainly."
              subtitle="Free software with a hidden agenda is worse than paid software. So here is the agenda."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {whyFree.map((column, index) => (
                <Reveal key={column.title} delay={index * 90}>
                  <div className="card h-full p-8 sm:p-10">
                    <h3 className="brand-font text-lg font-semibold tracking-tight text-fg">
                      {column.title}
                    </h3>
                    <ul className="mt-6 divide-y divide-border">
                      {column.points.map((point) => (
                        <li key={point} className="py-3.5 text-sm leading-6 text-fg/80">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading title="Before you commit anything." />

            <div className="mx-auto mt-14 max-w-3xl space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={faq.question} delay={index * 70}>
                  <article className="card p-7 sm:p-8">
                    <h3 className="brand-font text-base font-medium tracking-tight text-fg">
                      {faq.question}
                    </h3>
                    <p className="mt-3.5 text-sm leading-7 text-muted">{faq.answer}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <Reveal>
              <div className="card card-glow px-6 py-16 text-center sm:px-12">
                <h2 className="display mx-auto max-w-2xl text-2xl text-gradient sm:text-4xl">
                  There is no procurement cycle for free.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted">
                  Send us the shape of your operation and we will show you Spectr C2 running on your
                  own data. If it does not fit, we will tell you that too.
                </p>
                <Button href="/contact" size="lg" className="mt-9">
                  Get Spectr C2 free
                  <ArrowIcon />
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
