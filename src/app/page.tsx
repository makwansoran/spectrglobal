import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
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
                  className="mx-auto max-w-3xl text-3xl font-semibold leading-[0.98] text-white sm:text-5xl lg:text-6xl"
                >
                  For real-world aerial operations.
                </ScrollRevealHeading>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70 sm:text-sm">
                  Made In Norway
                </p>
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
              src="/valkyrie-hero.png"
              alt="VALKYRIE aircraft flying over mountain terrain"
              fill
              className="object-cover grayscale transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
                  VALKYRIE
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                  Affordable, highly effective, long-range attack UAV built around payload delivery, terminal mission profiles, and operator workflow.
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center gap-3 border border-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
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
              alt="CENTURION command dashboard on laptop"
              fill
              className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
                  CENTURION
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                  A command dashboard for monitoring missions, coordinating field activity, and keeping operational context in one place.
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center gap-3 border border-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                View CENTURION
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div>
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
          <div>
            <div className="relative flex min-h-[420px] overflow-hidden border-y border-border bg-white px-5 py-20 text-center sm:px-8 lg:min-h-[520px] lg:py-28">
              <div className="pointer-events-none absolute inset-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1920 1080"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full opacity-80"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="newsroom-wave-gradient" x1="0" x2="0" y1="1080" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#1742ff" />
                      <stop offset="1" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  {[
                    { y: -170, scaleY: 1.55, opacity: 0.16, duration: "58s" },
                    { y: -45, scaleY: 1.1, opacity: 0.22, duration: "72s" },
                    { y: 120, scaleY: 0.82, opacity: 0.18, duration: "64s" },
                  ].map((line) => (
                    <g key={line.duration} opacity={line.opacity} transform={`translate(0 ${line.y}) scale(1 ${line.scaleY})`}>
                      <path
                        fill="url(#newsroom-wave-gradient)"
                        d="M-1920 538.5C-1650 430-1420 690-1160 565-910 445-690 380-430 515-170 650 20 720 310 560 610 395 800 410 1080 555c280 145 500 110 760-35 260-145 500-130 760 35 260 165 480 90 760-35v82c-280 125-500 200-760 35-260-165-500-180-760-35-260 145-480 180-760 35-280-145-470-160-770 35-290 160-480 90-740-45-260-135-480-70-730 50-260 125-490-135-760-27Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          from="0 0"
                          to="-1920 0"
                          dur={line.duration}
                          repeatCount="indefinite"
                        />
                      </path>
                      <path
                        fill="url(#newsroom-wave-gradient)"
                        d="M0 538.5C270 430 500 690 760 565c250-120 470-185 730-50 260 135 450 205 740 45 300-165 490-150 770-5s500 110 760-35c260-145 500-130 760 35 260 165 480 90 760-35v82c-280 125-500 200-760 35-260-165-500-180-760-35-260 145-480 180-760 35-280-145-470-160-770 35-290 160-480 90-740-45-260-135-480-70-730 50C500 800 270 540 0 648.5Z"
                      >
                        <animateTransform
                          attributeName="transform"
                          type="translate"
                          from="0 0"
                          to="-1920 0"
                          dur={line.duration}
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  ))}
                </svg>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.58)_0,rgba(255,255,255,0.82)_46%,rgba(255,255,255,0.98)_100%)]" />
              </div>
              <div className="relative z-10 mx-auto flex flex-col items-center justify-center">
                <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl">
                  Newsroom
                </h2>
                <p className="mt-8 max-w-xl text-base leading-8 text-muted sm:text-lg">
                  Company updates, media coverage, founder notes, and product stories from Spectr.
                </p>
                <Link
                  href="/newsroom"
                  className="mt-12 inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                >
                  Go To Newsroom
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div>
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

              <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                <div>
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
          </div>
        </section>

        <section className="brand-font snap-start bg-black text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-white sm:text-7xl lg:text-8xl">
                Join Our Mission
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                Build aerospace systems and operational software for teams working in demanding real-world environments.
              </p>
            </div>
            <Link
              href="/careers"
              className="inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
            >
              View Careers
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <Footer />

      </main>
    </>
  );
}
