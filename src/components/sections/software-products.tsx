import Link from "next/link";
import { softwareProducts, softwareSection } from "@/lib/content";

const solutionHoverClass: Record<(typeof softwareProducts)[number]["id"], string> = {
  "spectr-os": "solution-card--blue",
  aim: "solution-card--purple",
  metaphysics: "solution-card--orange",
  argus: "solution-card--green",
};

export function SoftwareProducts() {
  return (
    <section id="features" className="section scroll-mt-24">
      <div className="container-x">
        <h2 className="brand-font text-[clamp(3rem,12vw,8rem)] font-normal leading-[0.9] tracking-[-0.05em] text-fg">
          {softwareSection.title}
        </h2>

        <ul className="mt-16 space-y-3">
          {softwareProducts.map((product) => (
            <li key={product.id}>
              <Link
                href={product.href}
                aria-label={product.name}
                className={`bevel-panel bevel-panel-muted solution-card group block px-5 py-8 sm:px-6 sm:py-10 lg:py-12 ${solutionHoverClass[product.id]}`}
              >
                <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-10">
                  <div>
                    <p className="solution-card__body max-w-sm text-sm leading-7 text-fg/80 sm:text-[0.95rem]">
                      {product.description}
                    </p>
                    <p className="solution-card__meta mt-3 font-mono text-[13px] tracking-[0.08em] text-muted">
                      {product.index}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 sm:justify-end">
                    <h3 className="solution-card__title brand-font text-[clamp(1.75rem,4.5vw,3rem)] font-normal leading-[0.95] tracking-[-0.03em] text-fg">
                      {product.name}
                    </h3>
                    <span className="solution-card__meta hidden font-mono text-[13px] tracking-[0.08em] text-muted lg:inline">
                      {product.index}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
