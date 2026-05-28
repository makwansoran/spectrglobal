import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-20">
        <section className="border-b border-border px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="label">Contact</p>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
                Tell us the mission. We will help specify the aircraft.
              </h1>
            </div>
            <p className="max-w-xl self-end text-lg leading-8 text-muted">
              Use this page for drone availability, model selection, fleet
              orders, training needs, and deployment support.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-px px-5 py-16 sm:px-8 lg:grid-cols-2">
          <div className="border border-border bg-surface p-8 sm:p-10">
            <span className="label block">Sales</span>
            <h2 className="mt-8 text-3xl font-semibold tracking-[-0.05em]">Drone enquiries</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Questions about models, pricing, stock, delivery timelines, and
              accessories.
            </p>
            <a href="mailto:sales@spectrglobal.com" className="mt-8 block font-mono text-sm uppercase tracking-[0.16em] hover:opacity-60">
              sales@spectrglobal.com
            </a>
          </div>

          <div className="border border-border bg-surface p-8 sm:p-10">
            <span className="label block">Operations</span>
            <h2 className="mt-8 text-3xl font-semibold tracking-[-0.05em]">Fleet and field work</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">
              Fleet purchases, inspection programs, mapping teams, procurement,
              and operator training.
            </p>
            <a href="mailto:business@spectrglobal.com" className="mt-8 block font-mono text-sm uppercase tracking-[0.16em] hover:opacity-60">
              business@spectrglobal.com
            </a>
          </div>
        </section>

        <section className="border-t border-border px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="label">What to include</p>
            <div className="mt-8 grid gap-6 text-sm leading-7 text-muted sm:grid-cols-3">
              <p>Primary use case and environment.</p>
              <p>Number of drones and desired timeline.</p>
              <p>Any training, payload, or support requirements.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
