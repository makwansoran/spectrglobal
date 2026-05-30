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

        <section className="brand-font flex min-h-screen snap-start items-center border-b border-border bg-bg">
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

        <section className="brand-font flex min-h-screen snap-start items-center border-b border-border bg-bg">
          <div className="mx-auto w-full max-w-7xl px-5 py-28 sm:px-8 lg:py-32">
            <div>
              <ScrollRevealHeading
                as="h2"
                className="text-4xl font-semibold leading-none text-fg sm:text-6xl"
              >
                Use Cases
              </ScrollRevealHeading>
            </div>

            <div className="mt-10 grid gap-px bg-border sm:grid-cols-3">
              {capabilityBoxes.map((capability) => (
                <article
                  key={capability.name}
                  className={`group relative h-80 overflow-hidden p-6 transition-[background-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:-translate-y-2 hover:scale-[1.045] hover:shadow-[0_28px_70px_rgba(0,0,0,0.18)] ${
                    capability.image ? "bg-black" : "bg-bg hover:bg-surface"
                  }`}
                >
                  {capability.image ? (
                    <>
                      <Image
                        src={capability.image}
                        alt=""
                        fill
                        quality={100}
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 group-hover:bg-black/25" aria-hidden="true" />
                    </>
                  ) : null}
                  <h3
                    className={`relative z-10 text-2xl font-semibold tracking-[-0.045em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 sm:text-3xl ${
                      capability.image ? "text-white" : "text-fg"
                    }`}
                  >
                    {capability.name}
                  </h3>
                </article>
              ))}
            </div>
          </div>
        </section>

        <footer className="brand-font flex min-h-screen snap-start items-end border-t border-border bg-bg text-fg">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
            <div className="grid gap-14 border-y border-border py-14 lg:grid-cols-[1.1fr_1.9fr]">
              <div>
                <Link href="/" className="inline-block text-sm font-medium uppercase tracking-[0.34em]">
                  Spectr
                </Link>
                <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
                  Mission-ready aerial systems for operations, intelligence, and aerospace use cases.
                </p>
              </div>

              <div className="grid gap-10 sm:grid-cols-3">
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Development</h3>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li><Link href="/products" className="hover:text-muted">ATTACK</Link></li>
                    <li><Link href="/products" className="hover:text-muted">RECON</Link></li>
                    <li><Link href="/products" className="hover:text-muted">JAMMER</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Use Cases</h3>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li>Operations</li>
                    <li>Intelligence</li>
                    <li>Aerospace</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Company</h3>
                  <ul className="mt-6 space-y-4 text-sm">
                    <li><Link href="/contact" className="hover:text-muted">Get Started</Link></li>
                    <li><Link href="/products" className="hover:text-muted">Products</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-8 text-xs uppercase tracking-[0.14em] text-muted sm:flex-row sm:items-center sm:justify-between">
              <p>Copyright 2026 Spectr</p>
              <p>For real-world aerial operations.</p>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}
