import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { softwareProducts, softwareSection } from "@/lib/content";

export function SoftwareProducts() {
  return (
    <section id="features" className="section scroll-mt-24 border-t border-border">
      <div className="container-x">
        <Reveal>
          <h2 className="brand-font text-[clamp(3rem,12vw,8rem)] font-normal leading-[0.9] tracking-[-0.05em] text-fg">
            {softwareSection.title}
          </h2>
        </Reveal>

        <ul className="mt-16 border-t border-border">
          {softwareProducts.map((product, index) => (
            <li key={product.id} className="border-b border-border">
              <Reveal delay={index * 90}>
                <Link
                  href={product.href}
                  aria-label={product.name}
                  className="group grid items-center gap-6 py-8 transition-colors sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-10 sm:py-10 lg:py-12"
                >
                  <div>
                    <p className="max-w-sm text-sm leading-7 text-fg/80 transition-colors group-hover:text-fg sm:text-[0.95rem]">
                      {product.description}
                    </p>
                    <p className="mt-3 font-mono text-[13px] tracking-[0.08em] text-muted">{product.index}</p>
                  </div>

                  <div className="flex items-baseline justify-between gap-4 sm:justify-end">
                    <h3 className="brand-font text-[clamp(2.75rem,10vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.04em] text-fg transition-opacity group-hover:opacity-70">
                      {product.name}
                    </h3>
                    <span className="hidden font-mono text-[13px] tracking-[0.08em] text-muted lg:inline">
                      {product.index}
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
