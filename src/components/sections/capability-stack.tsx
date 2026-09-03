import Link from "next/link";
import { GetStartedButton } from "@/components/get-started-button";

const blocks = [
  {
    title: "Operational intelligence.",
    body: "A continuously updated model of the real working environment — stock, aisles, exceptions, and the next competent move.",
    points: [
      "Live data fusion across WMS, ERP, sensors, and cameras",
      "One ontology for objects, locations, and decisions",
      "Evidence attached to every recommendation",
    ],
    href: "/platforms/spectr-os",
    cta: "Discover Spectr OS",
  },
  {
    title: "Agentic execution.",
    body: "Agents that propose, schedule, and close work against the live model — with humans still in command.",
    points: [
      "Multi-step workflows with approvals and guardrails",
      "Shift-ready actions instead of another dashboard",
      "Full history of every action taken",
    ],
    href: "/platforms/spectr-os",
    cta: "See workflows",
  },
  {
    title: "Deployed on your terms.",
    body: "Self-host, edge, or cloud. Host in the EU or on your infrastructure. Your data stays yours.",
    points: [
      "Host in the EU, on the edge, or on your own infrastructure",
      "Configuration on your aisle — not a science project",
      "Audit and governance built in from day one",
    ],
    href: "/contact",
    cta: "Talk to Spectr",
  },
];

export function CapabilityStack() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container-x space-y-20 sm:space-y-28">
        {blocks.map((block) => (
          <div key={block.title} className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-20">
            <h2 className="display text-[clamp(2.2rem,5vw,4.6rem)] text-fg">{block.title}</h2>
            <div>
              <p className="text-lg leading-8 text-muted">{block.body}</p>
              <ul className="mt-8 space-y-3">
                {block.points.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-6 text-fg">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {point}
                  </li>
                ))}
              </ul>
              {block.href === "/contact" ? (
                <GetStartedButton className="mt-8" label={block.cta} size="md">
                  {block.cta}
                </GetStartedButton>
              ) : (
                <Link href={block.href} className="btn btn-secondary mt-8">
                  {block.cta}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
