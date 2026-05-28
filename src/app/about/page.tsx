import type { Metadata } from "next";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">
        <div className="px-6 py-16 sm:px-10">
          <h1 className="display text-5xl sm:text-6xl">About</h1>
        </div>
        <div className="grid lg:grid-cols-2">
          <div className="p-8 lg:p-16">
            <span className="label block">What we do</span>
            <p className="mt-6 text-lg leading-relaxed">
              Spectr supplies dependable drones for aerial imaging, inspection,
              mapping, training, and commercial operations. We help customers
              choose aircraft that match the work they need to do.
            </p>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              From first-time pilots to fleet operators, our focus is clear
              guidance, reliable equipment, and support after the drone ships.
            </p>
          </div>
          <div className="p-8 lg:p-16">
            <span className="label block">Store profile</span>
            <div className="mt-6">
              {[
                ["Founded", "2026"],
                ["Drone categories", "5"],
                ["Shipping", "Worldwide"],
                ["Support", "Priority setup help"],
                ["Business orders", "Available"],
                ["Office", "Oslo"],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between py-4 text-sm">
                  <span className="text-muted">{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
