"use client";

import { ArrowIcon, Button } from "@/components/button";
import { TypeInOnView } from "@/components/type-in";
import { softwareProducts, softwareSection } from "@/lib/content";

function SolutionRow({
  product,
  index,
}: {
  product: (typeof softwareProducts)[number];
  index: number;
}) {
  return (
    <li>
      <article className="solution-row group">
        <div className="grid items-center gap-6 py-8 transition-[padding] duration-300 ease-out group-hover:py-11 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-10 sm:py-10 sm:group-hover:py-14 lg:py-12 lg:group-hover:py-16">
          <div>
            <TypeInOnView
              as="p"
              text={product.description}
              delayMs={160 + index * 60}
              charMs={14}
              className="max-w-sm text-sm leading-7 text-fg/80 transition-colors duration-300 group-hover:text-fg sm:text-[0.95rem]"
            />
            <p className="mt-3 font-mono text-[13px] tracking-[0.08em] text-muted">{product.index}</p>
          </div>

          <div className="flex items-baseline justify-between gap-4 sm:justify-end">
            <TypeInOnView
              as="h3"
              text={product.name}
              delayMs={80 + index * 80}
              charMs={55}
              className="brand-font text-[clamp(2.75rem,10vw,7.5rem)] font-normal leading-[0.9] tracking-[-0.04em] text-fg transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
            <span className="hidden font-mono text-[13px] tracking-[0.08em] text-muted lg:inline">
              {product.index}
            </span>
          </div>
        </div>

        <div className="solution-row__cta grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="flex justify-start pb-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:justify-end sm:pb-10">
              <Button href={product.href}>
                Learn More
                <ArrowIcon />
              </Button>
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

export function SoftwareProducts() {
  return (
    <section id="features" className="section scroll-mt-24">
      <div className="container-x">
        <TypeInOnView
          as="h2"
          text={softwareSection.title}
          charMs={70}
          className="brand-font text-[clamp(3rem,12vw,8rem)] font-normal leading-[0.9] tracking-[-0.05em] text-fg"
        />

        <ul className="mt-16">
          {softwareProducts.map((product, index) => (
            <SolutionRow key={product.id} product={product} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
}
