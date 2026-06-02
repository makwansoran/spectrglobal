import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "Investor Relations" };

const focusAreas = [
  {
    title: "Company updates",
    text: "Follow Spectr's progress as we build Norway-based aerospace systems for real-world operational use.",
  },
  {
    title: "Operating milestones",
    text: "Track product, manufacturing, and field-readiness milestones across VALKYRIE, CENTURION, and supporting systems.",
  },
  {
    title: "Long-term roadmap",
    text: "Understand the strategic direction behind Spectr's hardware, software, and national-control technology.",
  },
];

export default function InvestorPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              Investor Relations
            </ScrollRevealHeading>
            <p className="mt-10 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Follow Spectr&apos;s company updates, operating milestones, and long-term aerospace systems roadmap.
            </p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
                Building durable aerospace capability from Norway.
              </h2>
            </div>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>
                Spectr is developing mission-ready UAV hardware and operational software for organizations that need reliable field technology, secure control, and long-term product depth.
              </p>
              <p>
                Investor relations inquiries are handled directly by the Spectr team. We share company materials, milestone updates, and strategic context with qualified stakeholders.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {focusAreas.map((area) => (
                <article key={area.title} className="bg-surface p-7 sm:p-8">
                  <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">{area.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-muted">{area.text}</p>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-20 max-w-4xl text-center">
              <ScrollRevealHeading
                as="h2"
                className="text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl"
              >
                Our hardware powers real-time decisions in critical operations across the West — from the factory floor to the front lines.
              </ScrollRevealHeading>
              <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Makwan Ismail, Founder of Spectr
              </p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              Request investor information.
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
            >
              Contact Spectr
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
