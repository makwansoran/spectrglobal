import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
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
  "AIM — models, planning, decision systems",
  "Argus — perception and object detection",
  "Metaphysics — ontology and warehouse data",
  "Backend — distributed systems, real-time data",
  "Product engineering — full-stack Spectr OS tooling",
  "Deployment — on-site integration and field engineering",
];

export default function CareersPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader title="A decade-long problem needs people who want one." intro={intro} />

        <section className="pb-16">
          <div className="container-x">
            <div className="grid gap-5 md:grid-cols-3">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 90}>
                  <div className="card card-hover h-full p-8">
                    <h2 className="brand-font text-lg font-semibold tracking-tight text-fg">
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
                    <h2 className="display text-2xl text-gradient sm:text-3xl">
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

                  <div className="lg:border-l lg:border-border lg:pl-20">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                      Areas we hire into
                    </h3>
                    <ul className="mt-6 divide-y divide-border">
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
