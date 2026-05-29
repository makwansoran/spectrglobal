import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full bg-black px-5 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10 sm:px-7">
        <Link href="/" className="flex items-center gap-3 hover:opacity-70">
          <Image src="/inzure-logo.png" alt="Spectr" width={28} height={28} className="h-7 w-auto invert" />
          <span className="brand-font text-sm font-medium uppercase tracking-[0.34em]">
            Spectr
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/70 sm:gap-8">
          <Link
            href="/contact"
            className="bg-white px-5 py-2.5 text-black hover:bg-white/85"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
