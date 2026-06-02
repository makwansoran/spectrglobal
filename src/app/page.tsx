import Image from "next/image";
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
          <section className="relative z-10 flex min-h-screen snap-start items-center bg-black text-white">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src="/landing-hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
              <div className="relative mx-auto flex flex-col items-center">
                <ScrollRevealHeading
                  as="h1"
                  revealOnMount
                  className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl"
                >
                  &quot;For real-world aerial operations.&quot;
                </ScrollRevealHeading>
                <div className="mt-10 flex justify-center">
                  <Link
                    href="/products/valkyrie"
                    className="inline-flex items-center gap-3 border border-white bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black shadow-[0_18px_45px_rgba(11,12,13,0.18)] hover:bg-transparent hover:text-white"
                  >
                    Check Out VALKYRIE
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

        </div>

        <section className="brand-font flex min-h-[82vh] snap-start flex-col bg-black lg:flex-row">
          <Link
            href="/products/valkyrie"
            className="group relative min-h-[41vh] flex-1 overflow-hidden bg-black text-white transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.35] lg:min-h-[82vh]"
          >
            <Image
              src="/valkyrie-hero.jpg"
              alt="VALKYRIE aircraft flying over mountain terrain"
              fill
              className="object-cover grayscale transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                  VALKYRIE
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                  Mission-configurable attack UAV built around payload delivery, terminal mission profiles, and operator workflow.
                </p>
              </div>
              <span className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                View VALKYRIE
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          <Link
            href="/centurion"
            className="group relative min-h-[41vh] flex-1 overflow-hidden bg-black text-white transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.35] lg:min-h-[82vh]"
          >
            <Image
              src="/centurion-laptop-mockup.png"
              alt="Centurion command dashboard on laptop"
              fill
              className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                  Centurion
                </h2>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                  A command dashboard for monitoring missions, coordinating field activity, and keeping operational context in one place.
                </p>
              </div>
              <span className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                View Centurion
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div className="mx-auto max-w-7xl">
            <div className="grid overflow-hidden border-x border-b border-border lg:grid-cols-2">
              <div className="relative min-h-[360px] bg-black sm:min-h-[420px] lg:min-h-[520px]">
                <Image
                  src="/norway-operations.png"
                  alt="Spectr development and production in Norway"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              <div className="flex min-h-[360px] flex-col justify-between bg-surface p-7 sm:min-h-[420px] sm:p-10 lg:min-h-[520px] lg:p-12">
                <div className="max-w-xl">
                  <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-fg sm:text-5xl lg:text-6xl">
                    Developed and produced in Norway
                  </h2>
                  <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
                    Spectr builds mission-ready aerial systems and operational software from Norway, with a focus on field reliability and operator workflow.
                  </p>
                </div>

                <div className="mt-10 flex flex-col items-start gap-5 sm:mt-12">
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg transition-colors hover:border-fg"
                  >
                    Learn More
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <NewsSlideshow />
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
                  href="/investor"
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
