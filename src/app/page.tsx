import Image from "next/image";
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

const capabilityBoxes = [
  { name: "Operations", image: "/operations-hq.jpg" },
  { name: "Intelligence", image: "/intelligence-hq.jpg" },
  { name: "Aerospace", image: "/aerospace-hq.jpg" },
];

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        <section className="relative flex min-h-screen items-center overflow-hidden">
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
            </div>
          </div>
        </section>

        <section className="brand-font border-b border-border bg-bg">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div>
              <h2 className="text-reveal text-4xl font-semibold leading-none tracking-[-0.055em] text-fg sm:text-6xl">
                Development
              </h2>
            </div>

            <div className="mt-10 divide-y divide-border border-y border-border">
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

            <div className="mt-20">
              <h2 className="text-reveal text-4xl font-semibold leading-none tracking-[-0.055em] text-fg sm:text-6xl">
                Use Cases
              </h2>
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

      </main>
    </>
  );
}
