import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">
        <div className="px-6 py-16 sm:px-10">
          <h1 className="display text-5xl sm:text-6xl">Contact</h1>
          <p className="mt-4 max-w-xl text-muted">
            Ask about drone availability, business orders, training, or the right model for your mission.
          </p>
        </div>
        <div className="grid sm:grid-cols-2">
          <div className="p-8 sm:p-12">
            <span className="label block">Sales enquiries</span>
            <p className="mt-4 text-sm text-muted">For questions about drone models, pricing, availability, and shipping.</p>
            <a href="mailto:sales@spectrglobal.com" className="mt-6 block text-lg hover:opacity-50">sales@spectrglobal.com</a>
          </div>
          <div className="p-8 sm:p-12">
            <span className="label block">Business orders</span>
            <p className="mt-4 text-sm text-muted">For fleet purchases, team training, inspection programs, and procurement requests.</p>
            <a href="mailto:business@spectrglobal.com" className="mt-6 block text-lg hover:opacity-50">business@spectrglobal.com</a>
          </div>
        </div>
      </main>
    </>
  );
}
