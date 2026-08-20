import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { buildPageMetadata } from "@/lib/metadata";

const intro =
  "We are a small team in Norway working on Spectr OS. We hire slowly, for people who want to stay with a hard problem for years rather than quarters.";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description: intro,
  path: "/careers",
});

const values = [
  {
    title: "Work close to the floor",
    text: "We build for warehouses by standing in them. Everyone here spends time on site with the operators using what we ship.",
  },
  {
    title: "Ship, then learn",
    text: "A prototype in a real aisle teaches more than a quarter of planning. We favour short loops and honest post-mortems.",
  },
  {
    title: "Own the whole problem",
    text: "Small team, wide scope. You will cross from model to interface to deployment more often than a job title suggests.",
  },
];

const areas = [
  "Spectr OS — runtime, decision systems, and agentic workflows",
  "Backend — distributed systems, real-time data",
  "Product engineering — full-stack Spectr OS tooling",
  "Deployment — on-site integration and field engineering",
];

export default function CareersPage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <PageHeader title="A decade-long problem needs people who want one." intro={intro} />

        <section className="pb-16">
          <div className="container-x">
            <div className="grid gap-5 md:grid-cols-3">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 90}>
                  <div className="card card-hover h-full p-8">
                    <h2 className="display text-3xl text-fg">
                      {value.title}
                    </h2>
                    <p className="mt-3.5 text-sm leading-7 text-muted">{value.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-28">
          <div className="container-x">
            <Reveal>
              <div className="card p-10 sm:p-14">
                <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                  <div>
                    <h2 className="display text-[clamp(1.8rem,4vw,3rem)] text-fg">
                      No open listings right now.
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-muted">
                      We do not post roles we are not ready to fill. If your work overlaps with the
                      areas listed here, write to us anyway — describe something you have built and
                      why it was hard. Speculative applications from strong engineers get read
                      properly, and several of our team joined that way.
                    </p>
                    <Button href="/contact" className="mt-8">
                      Send an application
                      <ArrowIcon />
                    </Button>
                  </div>

                  <div className="lg:pl-20">
                    <h3 className="text-sm font-medium text-muted">
                      Areas we hire into
                    </h3>
                    <ul className="mt-6 space-y-1">
                      {areas.map((area) => (
                        <li key={area} className="py-4 text-sm leading-6 text-fg/80">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function CareersPageFrontPage() {
  return (
    <main id="main-content" className="flex-1 bg-[#F9F9F9]">
      {/* Hero */}
      <section className="px-6 pb-[100px] pt-[128px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="max-w-[760px]">
            <h1 className="m-0 text-[clamp(42px,6vw,72px)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#0A0A0A]">
              A decade-long problem needs people who want one.
            </h1>

            <p className="mt-7 max-w-[620px] text-base leading-[1.7] text-[#6B6B72]">
              {intro}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 pb-[128px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mb-12">
            <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
              How we work
            </h2>
          </div>

          <div className="grid border-t border-[#D2D2CE] md:grid-cols-3">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={[
                  "border-b border-[#D2D2CE] py-8 md:border-b-0 md:py-10",
                  index > 0 ? "md:border-l md:pl-8" : "md:pr-8",
                  index === 1 ? "md:px-8" : "",
                  index === 2 ? "md:pl-8" : "",
                ].join(" ")}
              >
                <span className="font-mono text-[11px] tracking-[0.08em] text-[#8A8A8F]">
                  0{index + 1}
                </span>

                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] text-[#0A0A0A]">
                  {value.title}
                </h3>

                <p className="mt-3.5 max-w-[320px] text-sm leading-7 text-[#6B6B72]">
                  {value.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="px-6 pb-[140px]">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="border-y border-[#D2D2CE]">
            <div className="grid gap-12 py-12 lg:grid-cols-[1fr_1fr] lg:gap-20 lg:py-16">
              <div>
                <h2 className="m-0 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
                  No open listings right now.
                </h2>

                <p className="mt-6 max-w-[560px] text-sm leading-7 text-[#6B6B72]">
                  We do not post roles we are not ready to fill. If your work
                  overlaps with the areas listed here, write to us anyway —
                  describe something you have built and why it was hard.
                  Speculative applications from strong engineers get read
                  properly, and several of our team joined that way.
                </p>

                <a
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#0A0A0A] bg-[#0A0A0A] px-[22px] py-[11px] text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#262626]"
                >
                  Send an application

                  <svg
                    width="14"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M8.5 1L13 5.5M13 5.5L8.5 10M13 5.5H1"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              <div className="lg:border-l lg:border-[#D2D2CE] lg:pl-12">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B72]">
                  Areas we hire into
                </h3>

                <ul className="mt-5 border-t border-[#D2D2CE]">
                  {areas.map((area) => (
                    <li
                      key={area}
                      className="border-b border-[#D2D2CE] py-4 text-sm text-[#0A0A0A]"
                    >
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
