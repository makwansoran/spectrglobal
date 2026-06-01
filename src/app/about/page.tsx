import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = { title: "About Us" };

const milestones = [
  {
    year: "2024",
    title: "Early systems work",
    text: "Spectr began with a focus on practical aerial systems, field handling, and hardware that could support real operational workflows.",
  },
  {
    year: "2025",
    title: "RECON takes shape",
    text: "The team refined a mission-configurable UAV direction around payload planning, operator needs, and deployment support.",
  },
  {
    year: "2026",
    title: "Operational readiness",
    text: "Spectr continues building toward reliable aerospace systems and software-assisted field operations from Norway.",
  },
];

export default function AboutPage() {
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
              About Us
            </ScrollRevealHeading>
            <p className="mt-10 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Spectr is a Norway-based aerospace company building mission-ready UAV systems and operational tools for teams that need dependable field technology.
            </p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
                Built for practical operations.
              </h2>
            </div>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>
                Spectr was created to build technology that feels useful in the field, not just impressive in a showroom. Our work centers on UAV platforms, operator workflow, and the systems needed to plan, monitor, and support missions.
              </p>
              <p>
                We design around the realities of deployment: payload needs, environmental constraints, training, support, and the handoff between hardware and software. RECON and Centurion reflect that direction.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              Company history.
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {milestones.map((milestone) => (
                <article key={milestone.year} className="bg-surface p-7 sm:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{milestone.year}</p>
                  <h3 className="mt-6 text-3xl font-semibold tracking-[-0.055em] text-fg">{milestone.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-muted">{milestone.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              Want to work with Spectr?
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
            >
              Contact us
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
