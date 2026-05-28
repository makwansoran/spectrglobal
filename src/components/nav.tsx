import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black bg-black text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3 hover:opacity-70">
        <Image src="/inzure-logo.png" alt="Spectr" width={28} height={28} className="h-7 w-auto invert" />
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.24em]">
          Spectr
        </span>
      </Link>

      <nav className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/70 sm:gap-8">
        <Link href="/drones" className="hover:text-white">Drones</Link>
        <Link
          href="/contact"
          className="border border-white/40 px-4 py-2 text-white hover:bg-white hover:text-black"
        >
          Contact
        </Link>
      </nav>
      </div>
    </header>
  );
}
