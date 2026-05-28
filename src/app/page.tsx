import Link from "next/link";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        <section className="relative min-h-screen overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.08),transparent_30%),linear-gradient(135deg,rgba(0,0,0,0.06)_0,transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />

          <div className="relative mx-auto flex min-h-screen max-w-7xl items-end px-5 pb-12 pt-28 sm:px-8 lg:pb-20">
            <div>
              <p className="label mb-8">Autonomous aerial systems</p>
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-fg sm:text-7xl lg:text-8xl">
                Spectr Attack for real-world aerial operations.
              </h1>
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
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-3 lg:py-28">
          {[
            ["01", "Single platform", "Spectr Attack is the only drone in the lineup, focused on serious field deployment."],
            ["02", "Mission fit", "We configure the aircraft around environment, payload, operator workflow, and support needs."],
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
              A focused drone supplier for operators who need one capable
              aircraft, clear support, and a clean path to deployment.
            </h2>
          </div>
        </section>
      </main>
    </>
  );
}
