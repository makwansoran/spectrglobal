import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";

const productShowcase = [
  {
    name: "ATTACK",
    index: "/0.1",
    summary: "Long-endurance aerial capability for demanding field operations",
    explanation: "A fixed-wing platform for teams that need range, payload flexibility, and reliable deployment in the field.",
  },
  {
    name: "RECON",
    index: "/0.2",
    summary: "Mission-configurable reconnaissance systems",
    explanation: "Built around payload, range, and operator workflow so each system fits the environment it serves.",
  },
  {
    name: "JAMMER",
    index: "/0.3",
    summary: "Counter-UAS support for controlled environments",
    explanation: "Configured for qualified operational use cases where planning, authorization, and compliance come first.",
  },
];

const capabilityBoxes = [
  { name: "Operations", image: "/covertops.png" },
  { name: "Intelligence", image: "/port-of-discharge-hq.jpg" },
  { name: "Aerospace", image: "/aerospace-hq.jpg" },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="h-screen flex-1 snap-y snap-proximity overflow-y-auto scroll-smooth">
        <section className="relative flex min-h-screen snap-start items-center overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.08),transparent_30%),linear-gradient(135deg,rgba(0,0,0,0.06)_0,transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />

          <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
            <div className="mx-auto">
              <ScrollRevealHeading
                as="h1"
                className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-fg sm:text-6xl lg:text-7xl"
              >
                For real-world aerial operations.
              </ScrollRevealHeading>
            </div>
          </div>
        </section>

        <section className="brand-font flex snap-start items-center border-b border-border bg-bg py-24 sm:py-32">
          <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
            <ScrollRevealHeading
              as="p"
              className="max-w-4xl text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl"
            >
              Our hardware powers real-time decisions in critical operations across the West — from the factory floor to the front lines.
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="brand-font flex snap-start items-center border-b border-border bg-bg">
          <div className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 lg:py-32">
            <div>
              <ScrollRevealHeading
                as="h2"
                className="text-4xl font-semibold leading-none text-fg sm:text-6xl"
              >
                Development
              </ScrollRevealHeading>
            </div>

            <div className="mt-10 divide-y divide-border border-y border-border">
              {productShowcase.map((product, index) => (
                <article
                  key={product.name}
                  tabIndex={0}
                  className="product-row group grid cursor-default gap-5 px-5 py-7 outline-none sm:grid-cols-[150px_72px_1fr] sm:items-start sm:px-6"
                >
                  <ScrollRevealHeading
                    as="h3"
                    delay={120 + index * 140}
                    className="text-2xl font-semibold text-fg transition-transform duration-300 group-hover:translate-x-2 group-focus:translate-x-2 sm:text-3xl"
                  >
                    {product.name}
                  </ScrollRevealHeading>
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

        <footer className="brand-font flex min-h-screen snap-start flex-col justify-end border-t border-border bg-bg text-fg">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">

            {/* Top: logo + tagline / nav columns */}
            <div className="grid gap-14 border-b border-border pb-14 lg:grid-cols-[1.2fr_1.8fr]">
              <div>
                <Link href="/" className="inline-flex items-center gap-3 hover:opacity-70">
                  <Image
                    src="/inzure-logo.png"
                    alt="Spectr"
                    width={28}
                    height={28}
                    className="h-7 w-auto"
                  />
                  <span className="text-sm font-semibold uppercase tracking-[0.34em]">Spectr</span>
                </Link>
                <p className="mt-6 max-w-xs text-sm leading-7 text-muted">
                  Mission-ready aerial systems for operations, intelligence, and aerospace use cases.
                </p>
              </div>

              <div className="grid gap-10 sm:grid-cols-3">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Development</h3>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li><Link href="/products" className="transition-opacity hover:opacity-50">ATTACK</Link></li>
                    <li><Link href="/products" className="transition-opacity hover:opacity-50">RECON</Link></li>
                    <li><Link href="/products" className="transition-opacity hover:opacity-50">JAMMER</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Company</h3>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li><Link href="/contact" className="transition-opacity hover:opacity-50">Get Started</Link></li>
                    <li><Link href="/products" className="transition-opacity hover:opacity-50">Products</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom: social icons + copyright */}
            <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-6">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter"
                  className="text-muted transition-opacity hover:opacity-60"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-muted transition-opacity hover:opacity-60"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-muted transition-opacity hover:opacity-60"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                  </svg>
                </a>
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                © 2026 Spectr
              </p>
            </div>

          </div>
        </footer>

      </main>
    </>
  );
}
