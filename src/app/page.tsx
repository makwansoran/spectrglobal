import Link from "next/link";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="flex-1">
        <section className="relative flex min-h-[72vh] items-center overflow-hidden border-b border-border">
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

      </main>
    </>
  );
}
