import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export const metadata: Metadata = {
  title: "Centurion",
  description: "Command dashboard for monitoring missions and coordinating field activity.",
};

const capabilities = [
  {
    title: "Mission overview",
    text: "Keep map context, assets, and field activity visible in one operational view.",
  },
  {
    title: "Live coordination",
    text: "Support teams with shared situational awareness across mission planning and execution.",
  },
  {
    title: "Operational control",
    text: "Bring drone feeds, mission layers, and decision context into a focused command interface.",
  },
];

export default function CenturionPage() {
  return (
    <>
      <Nav variant="light" />
      <main className="brand-font min-h-screen flex-1 bg-black text-white">
        <section className="px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <ScrollRevealHeading
                  as="h1"
                  revealOnMount
                  className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
                >
                  Centurion
                </ScrollRevealHeading>
                <p className="mt-8 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
                  A command dashboard for monitoring missions, coordinating field activity, and keeping operational context in one place.
                </p>
                <Link
                  href="/contact"
                  className="mt-10 inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
                >
                  Request Access
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="relative min-h-[360px] overflow-hidden border border-white/12 bg-white/5 sm:min-h-[460px]">
                <Image
                  src="/centurion-laptop-mockup.png"
                  alt="Centurion command dashboard on laptop"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
              Built for field command.
            </h2>
            <div className="space-y-7 text-base leading-8 text-white/62 sm:text-lg">
              <p>
                Centurion is designed for operators who need mission context, map data, live feeds, and coordination tools to stay close together during real-world activity.
              </p>
              <p>
                The interface supports aerial operations by keeping the operational picture clear, readable, and ready for teams working under time pressure.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article key={capability.title} className="border border-white/10 bg-white/[0.04] p-7 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-white">{capability.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/56">{capability.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 border border-white/10 bg-white p-7 text-black sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
              Request access to Centurion.
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:opacity-80"
            >
              Contact Spectr
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
