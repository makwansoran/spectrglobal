import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Documentation" };

const documentation = [
  {
    title: "Product Briefs",
    description:
      "Review high-level capabilities, use cases, availability, and recommended configurations for every Spectr platform.",
    items: ["ATTACK platform overview", "RECON payload options", "JAMMER deployment notes"],
  },
  {
    title: "Operator Resources",
    description:
      "Plan field usage with concise references for preparation, launch readiness, support equipment, and recovery workflow.",
    items: ["Pre-mission checklist", "Field kit requirements", "Maintenance planning"],
  },
  {
    title: "Procurement Support",
    description:
      "Find the information teams need to evaluate fit, start a request, and coordinate follow-up with Spectr.",
    items: ["Specification summaries", "Request process", "Support contact path"],
  },
];

export default function DocumentationPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-border px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-7xl">
            <p className="label">Resources</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              Documentation.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Product references, operator guidance, and procurement resources for Spectr systems.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-px border border-border bg-border lg:grid-cols-3">
            {documentation.map((section) => (
              <article key={section.title} className="bg-surface p-6 sm:p-8">
                <h2 className="text-3xl font-semibold tracking-[-0.05em] text-fg">{section.title}</h2>
                <p className="mt-5 text-sm leading-7 text-muted">{section.description}</p>
                <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center justify-between gap-4">
                      <span>{item}</span>
                      <span className="font-mono text-muted">/</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
