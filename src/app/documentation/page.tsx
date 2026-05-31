import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Documentation" };

const quickStart = [
  {
    title: "Evaluate a platform",
    description:
      "Review RECON by mission profile, operating environment, payload needs, and deployment readiness.",
    href: "/products",
    action: "View products",
  },
  {
    title: "Prepare a request",
    description:
      "Collect the operational context, qualification requirements, and support details Spectr needs before a deployment conversation.",
    href: "/contact",
    action: "Contact Spectr",
  },
  {
    title: "Read the latest updates",
    description:
      "Follow product development notes, field readiness updates, and company information from the Spectr team.",
    href: "/newsroom",
    action: "Open newsroom",
  },
];

const documentationSections = [
  {
    title: "Product Documentation",
    description: "Platform references for teams evaluating Spectr systems.",
    links: [
      "RECON payload and sensing configuration",
      "Recommended support equipment",
    ],
  },
  {
    title: "Operator Guides",
    description: "Field guidance for preparation, readiness, and handoff.",
    links: [
      "Pre-mission planning checklist",
      "Launch and recovery workflow",
      "Field kit and maintenance planning",
      "Post-operation inspection reference",
    ],
  },
  {
    title: "Deployment Readiness",
    description: "Qualification and planning material for operational use.",
    links: [
      "Use-case qualification requirements",
      "Environment and authorization review",
      "Training and support expectations",
      "Procurement information packet",
    ],
  },
  {
    title: "Support",
    description: "Help paths for teams already coordinating with Spectr.",
    links: [
      "Request technical clarification",
      "Coordinate product documentation",
      "Schedule deployment planning",
      "Submit media or company inquiries",
    ],
  },
];

const referenceCards = [
  {
    title: "RECON",
    text: "Mission-configurable reconnaissance systems built around payload and workflow.",
  },
];

export default function DocumentationPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <h1 className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]">
              Documentation
            </h1>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {quickStart.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[280px] flex-col justify-between bg-surface p-7 transition-opacity hover:opacity-80 sm:p-8"
              >
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg sm:text-4xl">
                    {item.title}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-muted">{item.description}</p>
                </div>
                <span className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-fg">
                  {item.action}
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[320px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-5xl">
                Browse documentation
              </h2>
              <p className="mt-6 text-sm leading-7 text-muted">
                Start with the product family, then move through operator planning, deployment readiness, and support.
              </p>
            </aside>

            <div className="grid gap-4">
              {documentationSections.map((section) => (
                <article key={section.title} className="bg-surface p-7 sm:p-8">
                  <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                      <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                        {section.title}
                      </h3>
                      <p className="mt-5 text-sm leading-7 text-muted">{section.description}</p>
                    </div>
                    <ul className="grid gap-3 text-sm text-fg sm:grid-cols-2">
                      {section.links.map((link) => (
                        <li key={link} className="bg-bg px-4 py-4">
                          {link}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              Platform references
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {referenceCards.map((card) => (
                <article key={card.title} className="bg-black p-7 text-white sm:p-8">
                  <h3 className="text-4xl font-semibold tracking-[-0.06em]">{card.title}</h3>
                  <p className="mt-6 text-sm leading-7 text-white/62">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              Need a specific document?
            </h2>
            <div className="max-w-xl lg:text-right">
              <p className="text-sm leading-7 text-muted">
                Contact Spectr with your platform, operating environment, and qualification context so the right documentation can be prepared.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
              >
                Request documentation
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
