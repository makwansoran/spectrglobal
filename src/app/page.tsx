import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { NewsSlideshow } from "@/components/news-slideshow";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

const productShowcase = [
  {
    name: "RECON",
    href: "/products/recon",
    index: "/0.1",
    summary: "Mission-configurable reconnaissance systems",
    explanation: "Built around payload, range, and operator workflow so each system fits the environment it serves.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="h-screen flex-1 snap-y snap-proximity overflow-y-auto scroll-smooth">
        <div className="relative overflow-hidden bg-bg">
          <section className="relative z-10 flex min-h-screen snap-start items-center">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
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

          <section className="brand-font relative z-10 flex snap-start items-center py-24 sm:py-32">
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
        </div>

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
              <ScrollRevealHeading
                as="h2"
                className="text-4xl font-semibold leading-none text-fg sm:text-6xl"
              >
                Newsroom
              </ScrollRevealHeading>
            </div>
            <NewsSlideshow />
          </div>
        </section>

        <section className="brand-font snap-start bg-bg px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="relative min-h-[520px] overflow-hidden bg-neutral-800 text-white">
              <video
                className="absolute inset-0 h-full w-full object-cover grayscale"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_tiny.jpg"
                aria-hidden="true"
              >
                <source
                  src="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_large.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-neutral-900/65" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />

              <div className="relative flex min-h-[520px] flex-col justify-between p-7 sm:p-10 lg:p-12">
                <div className="max-w-4xl">
                  <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                    Investor Relations
                  </h2>
                  <p className="mt-8 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                    Follow Spectr&apos;s company updates, operating milestones, and long-term aerospace systems roadmap.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white"
                >
                  Go To Investor Page
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />

      </main>
    </>
  );
}
