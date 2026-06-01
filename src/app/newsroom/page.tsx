import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { latestNewsStories } from "@/lib/news-stories";

export const metadata: Metadata = { title: "Newsroom" };

const briefs = [
  {
    label: "Field Notes",
    value: "VALKYRIE trials continue across mixed-weather test windows.",
  },
  {
    label: "Development",
    value: "VALKYRIE payload workflow validation enters the next build cycle.",
  },
  {
    label: "Operations",
    value: "Spectr publishes updated qualification requirements for deployment inquiries.",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
              >
                Newsroom
              </ScrollRevealHeading>
              <p className="max-w-lg text-base leading-8 text-white/62 sm:text-lg">
                Updates from Spectr on field-ready aerial systems, operational hardware, and the development work behind VALKYRIE.
              </p>
            </div>
          </div>
        </section>

        <section className="brand-font border-b border-border bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <Link
              href="/products"
              className="group flex min-h-[420px] flex-col justify-between bg-black p-8 text-white transition-opacity hover:opacity-95 sm:p-10"
            >
              <div>
                <h2 className="max-w-2xl text-4xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
                  Read the latest field systems update from Spectr.
                </h2>
              </div>
              <div className="mt-12 flex items-end justify-between gap-8 border-t border-white/15 pt-8">
                <p className="max-w-md text-sm leading-7 text-white/58">
                  A development note on operational readiness, qualified use cases, and what comes next for Spectr&apos;s aerial hardware roadmap.
                </p>
                <span className="font-mono text-2xl leading-none transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </Link>

            <div className="grid gap-px bg-border">
              {briefs.map((brief) => (
                <article key={brief.label} className="bg-surface p-7 sm:p-8">
                  <p className="mt-5 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.04em] text-fg sm:text-3xl">
                    {brief.value}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="border-b border-border pb-10">
              <h2 className="max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
                Company news and operational updates.
              </h2>
            </div>

            <div className="divide-y divide-border">
              {latestNewsStories.map((story) => (
                <article
                  key={story.title}
                  className="group grid gap-8 py-10 lg:grid-cols-[240px_1fr_80px] lg:items-start"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{story.meta}</p>
                  </div>
                  <div>
                    <h3 className="max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.055em] text-fg transition-colors group-hover:text-muted sm:text-5xl">
                      {story.title}
                    </h3>
                    <p className="mt-6 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                      {story.summary}
                    </p>
                  </div>
                  <div className="font-mono text-2xl leading-none text-muted transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font border-t border-border bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              For media and qualified operational inquiries.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base lg:text-right">
              Contact Spectr for company information, product context, and deployment qualification requests.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
