import Link from "next/link";
import { Footer } from "@/components/footer";
import { BackgroundPaths } from "@/components/background-paths";
import { Nav } from "@/components/nav";
import { NewsSlideshow } from "@/components/news-slideshow";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

const productShowcase = [
  {
    name: "ATTACK",
    href: "/products/attack",
    index: "/0.1",
    summary: "Long-endurance aerial capability for demanding field operations",
    explanation: "A fixed-wing platform for teams that need range, payload flexibility, and reliable deployment in the field.",
  },
  {
    name: "RECON",
    href: "/products/recon",
    index: "/0.2",
    summary: "Mission-configurable reconnaissance systems",
    explanation: "Built around payload, range, and operator workflow so each system fits the environment it serves.",
  },
  {
    name: "JAMMER",
    href: "/products/jammer",
    index: "/0.3",
    summary: "Counter-UAS support for controlled environments",
    explanation: "Configured for qualified operational use cases where planning, authorization, and compliance come first.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="h-screen flex-1 snap-y snap-proximity overflow-y-auto scroll-smooth">
        <section className="relative flex min-h-screen snap-start items-center overflow-hidden">
          <BackgroundPaths />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.82),rgba(255,255,255,0.45)_45%,rgba(255,255,255,0)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
            <div className="mx-auto">
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-fg sm:text-6xl lg:text-7xl"
              >
                For real-world aerial operations.
              </ScrollRevealHeading>
            </div>
          </div>
        </section>

        <section className="brand-font flex snap-start items-center bg-bg py-24 sm:py-32">
          <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
            <ScrollRevealHeading
              as="h2"
              className="text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl"
            >
              Our hardware powers real-time decisions in critical operations across the West — from the factory floor to the front lines.
            </ScrollRevealHeading>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Makwan Ismail, Founder of Spectr
            </p>
          </div>
        </section>

        <section className="brand-font flex snap-start items-center bg-bg">
          <div className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 lg:py-32">
            <div>
              <ScrollRevealHeading
                as="h2"
                className="text-4xl font-semibold leading-none text-fg sm:text-6xl"
              >
                Development
              </ScrollRevealHeading>
            </div>

            <div className="mt-10 space-y-2">
              {productShowcase.map((product) => (
                <article
                  key={product.name}
                  tabIndex={0}
                  className="product-row group grid cursor-pointer gap-5 px-5 py-7 outline-none sm:grid-cols-[180px_72px_1fr] sm:items-start sm:px-6"
                >
                  <h3 className="text-2xl font-semibold text-fg transition-transform duration-300 group-hover:translate-x-2 group-focus:translate-x-2 sm:text-3xl">
                    <Link
                      href={product.href}
                      className="inline-flex items-center gap-3 underline-offset-8 transition-[color,gap] duration-300 hover:gap-5 hover:text-muted hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg"
                    >
                      {product.name}
                      <span className="font-mono text-base leading-none opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                        →
                      </span>
                    </Link>
                  </h3>
                  <p className="font-mono text-sm text-muted transition-colors group-hover:text-fg group-focus:text-fg">
                    {product.index}
                  </p>
                  <div>
                    <p className="max-w-2xl text-lg leading-7 tracking-[-0.025em] text-fg sm:text-2xl sm:leading-9">
                      {product.summary}
                    </p>
                    <div className="product-row-detail mt-0">
                      <div className="overflow-hidden">
                        <p className="max-w-xl pt-4 text-sm leading-7 tracking-[-0.01em] text-muted sm:text-base">
                          {product.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="max-w-4xl">
              <p className="label">Newsroom</p>
              <ScrollRevealHeading
                as="h2"
                className="mt-5 text-4xl font-semibold leading-none text-fg sm:text-6xl"
              >
                Latest news from Spectr
              </ScrollRevealHeading>
            </div>
            <NewsSlideshow />
          </div>
        </section>

        <Footer />

      </main>
    </>
  );
}
