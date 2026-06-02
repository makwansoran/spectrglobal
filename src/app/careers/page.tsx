import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Spectr and build mission-ready aerospace systems from Norway.",
};

const focusAreas = [
  {
    title: "Aerospace systems",
    text: "Work on UAV platforms, field-ready hardware, and the systems that support demanding operational use.",
  },
  {
    title: "Operational software",
    text: "Build command interfaces, mission workflows, and tools that help operators keep context when decisions matter.",
  },
  {
    title: "Norwegian capability",
    text: "Help develop critical technology under national control, with a focus on reliability, security, and real deployment needs.",
  },
];

export default function CareersPage() {
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
              Join Our Mission
            </ScrollRevealHeading>
            <p className="mt-10 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Spectr is building mission-ready aerospace systems and operational software from Norway.
            </p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              Build systems for real-world operations.
            </h2>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>
                We are looking for people who care about practical engineering, disciplined execution, and technology that can hold up outside the lab.
              </p>
              <p>
                If you want to work across aerospace hardware, operator workflow, and secure software systems, we want to hear from you.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {focusAreas.map((area) => (
              <article key={area.title} className="bg-surface p-7 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">{area.title}</h3>
                <p className="mt-5 text-sm leading-7 text-muted">{area.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              Interested in joining Spectr?
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
