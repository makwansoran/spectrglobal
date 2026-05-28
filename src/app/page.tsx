import Link from "next/link";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1 pt-20">
        <section className="relative min-h-[calc(100vh-80px)] overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08)_0,transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />

          <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-end gap-16 px-5 pb-12 pt-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
            <div>
              <p className="label mb-8">Autonomous aerial systems</p>
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-fg sm:text-7xl lg:text-8xl">
                Drones for teams operating in the real world.
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
                Spectr supplies mission-ready drones for imaging, mapping,
                inspection, and field operations. Built for clarity. Selected for
                reliability.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/drones"
                className="bg-fg px-6 py-3 text-sm font-medium text-bg hover:opacity-80"
              >
                View drones
              </Link>
              <Link
                href="/contact"
                className="border border-border px-6 py-3 text-sm text-fg hover:border-fg"
              >
                Contact
              </Link>
              </div>
            </div>

            <div className="hidden border border-border bg-surface/70 p-4 shadow-2xl shadow-black/40 lg:block">
              <div className="aspect-[4/5] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_55%_35%,rgba(255,255,255,0.24),transparent_18%)] p-6">
                <div className="flex h-full flex-col justify-between">
                  <div className="grid grid-cols-3 gap-3">
                    {["FLT", "MAP", "ISR"].map((item) => (
                      <span key={item} className="border border-border px-3 py-2 font-mono text-xs text-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                  <div>
                    <div className="mb-8 h-px w-full bg-border" />
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                      Operational coverage
                    </p>
                    <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                      Airframes, payloads, and support for field deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:py-28">
          {[
            ["01", "Flight hardware", "Compact camera drones, FPV systems, survey platforms, and industrial aircraft."],
            ["02", "Mission fit", "We match aircraft to use case, environment, team skill level, and support needs."],
            ["03", "Deployment support", "Procurement, setup guidance, and training for operators who need to move fast."],
          ].map(([num, title, body]) => (
            <div key={num} className="border-t border-border pt-6">
              <span className="label">{num}</span>
              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{body}</p>
            </div>
          ))}
        </section>

        <section className="border-y border-border bg-surface">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <p className="label">Why Spectr</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">
              A focused drone supplier for creators, survey teams, and
              operators who need aerial capability without noise.
            </h2>
          </div>
        </section>
      </main>
    </>
  );
}
