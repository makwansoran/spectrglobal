import Link from "next/link";
import { Nav } from "@/components/nav";

const productShowcase = [
  {
    name: "ATTACK",
    index: "/0.1",
    summary: "Long-endurance aerial capability for demanding field operations",
    explanation: "A fixed-wing platform for teams that need range, payload flexibility, and reliable deployment in the field.",
  },
  {
    name: "UAV",
    index: "/0.2",
    summary: "Mission-configurable unmanned aerial systems",
    explanation: "Built around payload, range, and operator workflow so each system fits the environment it serves.",
  },
  {
    name: "JAMMER",
    index: "/0.3",
    summary: "Counter-UAS support for controlled environments",
    explanation: "Configured for qualified operational use cases where planning, authorization, and compliance come first.",
  },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        <section className="relative flex min-h-screen items-center overflow-hidden border-b border-border">
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
              <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.055em] text-fg sm:text-6xl lg:text-7xl">
                For real-world aerial operations.
              </h1>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/products"
                  className="bg-fg px-6 py-3 text-sm font-medium text-bg hover:opacity-80"
                >
                  View products
                </Link>
                <Link
                  href="/contact"
                  className="border border-border px-6 py-3 text-sm text-fg hover:border-fg"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font border-b border-border bg-bg">
          <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:py-28">
            <div>
              <p className="text-sm font-medium text-fg">Our Products</p>
              <h2 className="mt-6 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.045em] text-fg sm:text-5xl">
                Equip operations, from field teams to front-line environments
              </h2>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {productShowcase.map((product) => (
                <article
                  key={product.name}
                  tabIndex={0}
                  className="product-row group grid cursor-default gap-5 px-5 py-7 outline-none sm:grid-cols-[150px_72px_1fr] sm:items-start sm:px-6"
                >
                  <h3 className="text-2xl font-semibold tracking-[-0.045em] text-fg transition-transform duration-300 group-hover:translate-x-2 group-focus:translate-x-2 sm:text-3xl">
                    {product.name}
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

      </main>
    </>
  );
}
