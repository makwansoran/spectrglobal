import Link from "next/link";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,0,0,0.08),transparent_30%),linear-gradient(135deg,rgba(0,0,0,0.06)_0,transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent" />

          <div className="relative mx-auto flex max-w-7xl items-start px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
            <div>
              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-fg sm:text-7xl lg:text-8xl">
                For real-world aerial operations.
              </h1>
              <div className="mt-10 flex flex-wrap gap-4">
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

      </main>
    </>
  );
}
