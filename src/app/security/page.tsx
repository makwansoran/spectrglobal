import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Security & Confidentiality",
  description:
    "Spectr security, confidentiality, Norwegian ownership, and controlled infrastructure commitments.",
};

const principles = [
  {
    title: "100% Norwegian",
    text: "Norwegian-owned and operated. All business activity takes place in Norway with no foreign ownership interests.",
  },
  {
    title: "Own infrastructure",
    text: "All production and data processing runs exclusively on our own controlled systems hosted on Norwegian infrastructure.",
  },
  {
    title: "No third parties",
    text: "We use no external vendors in our production chain. No data is shared with or processed by third parties.",
  },
  {
    title: "Full control",
    text: "100% internal control over every process, from development to final delivery. No exceptions.",
  },
  {
    title: "Confidentiality",
    text: "We operate under strict confidentiality requirements and handle sensitive information with the highest level of care.",
  },
  {
    title: "Norwegian law",
    text: "We operate in full compliance with Norwegian law, the Security Act, GDPR, and national information security requirements.",
  },
];

export default function SecurityPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 bg-bg">
        <section className="brand-font relative flex min-h-screen items-center bg-black px-5 py-36 text-white sm:px-8 lg:py-44">
          <div className="mx-auto max-w-7xl">
            <h1 className="max-w-6xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[8.5rem]">
              Developed and produced in Norway
            </h1>
          </div>
          <a
            href="#security-principles"
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:bottom-12"
          >
            <span>Scroll to verify</span>
            <span className="security-scroll-icon" aria-hidden="true">
              <span />
            </span>
          </a>
        </section>

        <section id="security-principles" className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-px border border-border bg-border lg:grid-cols-3">
              {principles.map((principle) => (
                <article key={principle.title} className="bg-surface p-7 sm:p-8">
                  <div className="flex h-full flex-col justify-between gap-10">
                    <div>
                      <h2 className="text-3xl font-semibold leading-none tracking-[-0.055em] text-fg">
                        {principle.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-7 text-muted">{principle.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-10 border border-border bg-black p-7 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                Proud Norwegian company
              </p>
              <h2 className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
                Critical technology should stay local.
              </h2>
            </div>

            <div className="space-y-10">
              <p className="max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
                We believe critical technology should be developed, owned, and controlled locally &mdash; to safeguard Norwegian interests for the long term.
              </p>

              <div className="border-t border-white/15 pt-8">
                <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">
                  Legal compliance
                </h3>
                <p className="mt-6 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
                  Our operations are structured in accordance with the Norwegian Security Act (sikkerhetsloven) and the Business Security Regulation (virksomhetsikkerhetsforskriften &sect; 83). We maintain the necessary organisational and technical safeguards to meet the requirements for handling classified information and critical infrastructure, as defined under Norwegian law.
                </p>
                <Link
                  href="https://lovdata.no/lov/2018-06-01-24/%C2%A79-3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex w-fit items-center gap-3 border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white"
                >
                  Read more: sikkerhetsloven &sect; 9-3 (Lovdata)
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Proud Norwegian company
              </p>
              <h2 className="mt-6 max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
                We believe critical technology should be developed under full national control.
              </h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 border border-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg transition-colors hover:bg-fg hover:text-white"
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
