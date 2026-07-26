import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buildPageMetadata } from "@/lib/metadata";

const intro =
  "Droid is a general-purpose humanoid designed for warehouses and industrial floors as they are built today — no re-racking, no fixed conveyors, no dedicated cage.";

export const metadata: Metadata = buildPageMetadata({
  title: "Droid",
  description: intro,
  path: "/robotics",
});

const capabilities = [
  {
    title: "Manipulation",
    description:
      "Two-handed grasping across cartons, totes, polybags and irregular items, with force feedback rather than fixed grip profiles. The unit adapts to what is actually on the shelf.",
  },
  {
    title: "Locomotion",
    description:
      "Bipedal movement through standard aisle widths, over thresholds and ramps, and around people. Designed for the floor plan you have rather than a purpose-built cell.",
  },
  {
    title: "Perception",
    description:
      "Onboard sensing fused with the live warehouse model, so Droid knows what should be in a location as well as what it can see there — and flags the difference.",
  },
  {
    title: "Safety",
    description:
      "Continuous awareness of people in the workspace, with conservative behaviour by default. Every action is logged in Spectr C2 and legible to a supervisor.",
  },
];

const approach = [
  {
    step: "01",
    title: "The software comes first",
    description:
      "Before a robot arrives, the site is already running Spectr C2. The system knows the layout, the SKUs, the exceptions and the rhythm of the operation.",
  },
  {
    step: "02",
    title: "Tasks transfer, not jobs",
    description:
      "We do not replace a role. We identify a specific task the system already understands well and hand that one task to a Droid unit, under supervision.",
  },
  {
    step: "03",
    title: "Scope widens with evidence",
    description:
      "Each task that runs reliably becomes training signal for the next. The operator decides the pace, and can pull any task back at any time.",
  },
];

export default function RoboticsPage() {
  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <PageHeader
          align="center"
          title="A humanoid for the warehouse you already have."
          intro={intro}
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" size="lg">
              Apply to the pilot programme
              <ArrowIcon />
            </Button>
            <Button href="/wms" size="lg">
              Start with Spectr C2
            </Button>
          </div>
        </PageHeader>

        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading
              title="Designed around the constraints of a working site."
              subtitle="Every decision below follows from one rule: the building does not change to accommodate the robot."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2">
              {capabilities.map((capability, index) => (
                <Reveal key={capability.title} delay={(index % 2) * 90}>
                  <article className="card card-hover h-full p-8">
                    <h3 className="brand-font text-lg font-semibold tracking-tight text-fg">
                      {capability.title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted">{capability.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <SectionHeading
              title="Deployment is gradual by design."
              subtitle="Nobody should bet an operation on a robot arriving and working. We deliberately made the path incremental."
            />

            <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {approach.map((item, index) => (
                <Reveal key={item.step} as="li" delay={index * 110}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface font-mono text-xs tracking-[0.1em] text-accent">
                    {item.step}
                  </div>
                  <h3 className="brand-font mt-6 text-lg font-semibold tracking-tight text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-3.5 text-sm leading-7 text-muted">{item.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-x">
            <Reveal>
              <div className="card card-glow px-6 py-16 text-center sm:px-12">
                <h2 className="display mx-auto max-w-2xl text-2xl text-gradient sm:text-4xl">
                  We are selecting pilot sites now.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-muted">
                  The programme is small and deliberately hands-on. If you run a warehouse or
                  industrial floor and want Droid units on it early, tell us about the site and the
                  task you would hand over first.
                </p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Button href="/contact" size="lg">
                    Apply to pilot
                    <ArrowIcon />
                  </Button>
                  <Button href="/about" size="lg">
                    Read our thinking
                  </Button>
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
