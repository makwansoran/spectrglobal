import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
      <Link href="/" className="flex items-center gap-3 hover:opacity-70">
        <span className="grid h-9 w-9 place-items-center border border-fg/30 bg-fg/5">
          <Image src="/inzure-logo.png" alt="Spectr" width={22} height={22} className="h-5 w-auto invert" />
        </span>
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.24em]">
          Spectr
        </span>
      </Link>

      <nav className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-muted sm:gap-8">
        <Link href="/drones" className="hover:text-fg">Drones</Link>
        <Link
          href="/contact"
          className="border border-fg/40 px-4 py-2 text-fg hover:bg-fg hover:text-bg"
        >
          Contact
        </Link>
      </nav>
      </div>
    </header>
  );
}
