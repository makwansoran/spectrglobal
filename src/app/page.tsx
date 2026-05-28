import Link from "next/link";
import { Nav } from "@/components/nav";
import { Typewriter } from "@/components/typewriter";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1 pt-[72px]">

        {/* ── Hero ── */}
        <section className="px-6 pb-20 pt-24 sm:px-10 lg:pt-32">
          <div className="max-w-4xl">
            <Typewriter
              text="Professional drones for creators, survey teams, and commercial operators."
              as="h1"
              speed={20}
              delay={150}
              className="display text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
            />
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/investments"
                className="border border-fg bg-fg px-6 py-3 text-sm text-bg hover:opacity-80"
              >
                Shop drones
              </Link>
              <Link
                href="/partnership"
                className="border border-border px-6 py-3 text-sm text-muted hover:border-fg hover:text-fg"
              >
                Business orders
              </Link>
            </div>
          </div>
        </section>


      </main>
    </>
  );
}
