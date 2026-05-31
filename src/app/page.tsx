import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { NewsSlideshow } from "@/components/news-slideshow";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="h-screen flex-1 snap-y snap-proximity overflow-y-auto scroll-smooth">
        <div className="relative overflow-hidden bg-bg">
          <section className="relative z-10 flex min-h-screen snap-start items-center">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
              <div className="mx-auto flex flex-col items-center">
                <ScrollRevealHeading
                  as="h1"
                  revealOnMount
                  className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-fg sm:text-6xl lg:text-7xl"
                >
                  <span className="font-mono text-[0.72em] font-normal text-muted">[</span>
                  For real-world aerial operations.
                  <span className="font-mono text-[0.72em] font-normal text-muted">]</span>
                </ScrollRevealHeading>
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/products/recon"
                    className="inline-flex items-center gap-3 border border-fg bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black shadow-[0_18px_45px_rgba(11,12,13,0.08)] hover:bg-fg hover:text-white"
                  >
                    Check Out RECON
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
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

        <section className="brand-font snap-start bg-bg px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/products/recon"
              className="group block overflow-hidden bg-black text-white"
            >
              <div className="relative min-h-[520px]">
                <video
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_tiny.jpg"
                  aria-label="RECON drone video preview"
                >
                  <source
                    src="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_large.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative flex min-h-[520px] flex-col justify-between p-7 sm:p-10 lg:p-12">
                  <div className="max-w-4xl">
                    <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                      RECON
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                      Mission-configurable reconnaissance systems built around payload, range, and operator workflow.
                    </p>
                  </div>
                  <span className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                    View RECON
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <Link
              href="/contact"
              className="group block overflow-hidden bg-black text-white"
            >
              <div className="relative min-h-[520px]">
                <video
                  className="absolute inset-0 h-full w-full object-cover grayscale"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_tiny.jpg"
                  aria-label="Centurion operations dashboard preview"
                >
                  <source
                    src="https://cdn.pixabay.com/video/2020/01/06/30978-384234040_large.mp4"
                    type="video/mp4"
                  />
                </video>
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/25 to-transparent" />
                <div className="relative flex min-h-[520px] flex-col justify-between p-7 sm:p-10 lg:items-end lg:p-12 lg:text-right">
                  <div className="max-w-3xl">
                    <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                      Centurion
                    </h2>
                    <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                      A command dashboard for monitoring missions, coordinating field activity, and keeping operational context in one place.
                    </p>
                  </div>
                  <span className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white lg:self-end">
                    Request Access
                    <span aria-hidden="true">→</span>
                  </span>
                </div>
              </div>
            </Link>
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
