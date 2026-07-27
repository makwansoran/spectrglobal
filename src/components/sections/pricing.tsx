import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { getStartedCtas } from "@/lib/content";

export function Pricing() {
  return (
    <section id="pricing" className="section scroll-mt-20">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            {getStartedCtas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={`cta-panel ${cta.tone === "dark" ? "cta-panel-dark" : "cta-panel-light"}`}
              >
                <span>{cta.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
