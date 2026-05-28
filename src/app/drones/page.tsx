import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { objects } from "@/lib/objects";

export const metadata: Metadata = { title: "Drones" };

export default function DronesPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-px px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          {objects.map((drone) => (
            <article key={drone.slug} className="group border border-border bg-surface">
              <div className="grid min-h-full lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-border bg-bg/40 lg:border-b-0 lg:border-r">
                  <ObjectVisual visual={drone.visual} className="h-72 w-full grayscale" />
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="label">{drone.category}</p>
                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{drone.name}</h2>
                    </div>
                    <span className="font-mono text-sm text-muted">{drone.price}</span>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-muted">{drone.description}</p>

                  <dl className="mt-8 grid grid-cols-2 gap-px border border-border bg-border text-sm">
                    {[
                      ["Use", drone.use],
                      ["Flight", drone.flightTime],
                      ["Range", drone.range],
                      ["Status", drone.availability],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-surface p-4">
                        <dt className="label">{label}</dt>
                        <dd className="mt-2 text-fg">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {drone.highlights.map((highlight) => (
                      <span key={highlight} className="border border-border px-3 py-1.5 text-xs text-muted">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="border-t border-border px-5 py-16 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.05em]">
              Request Spectr Attack.
            </h2>
            <Link href="/contact" className="w-fit bg-fg px-6 py-3 text-sm font-medium text-bg hover:opacity-80">
              Contact Spectr
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
