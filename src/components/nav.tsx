import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-bg/95 px-6 py-5 backdrop-blur sm:px-10">
      <Link href="/" className="flex items-center gap-2.5 hover:opacity-60">
        <Image src="/inzure-logo.png" alt="Spectr" width={28} height={28} className="h-7 w-auto" />
        <span style={{ fontFamily: "var(--font-syne)", fontWeight: 700, letterSpacing: "0.04em" }}>
          Spectr
        </span>
      </Link>

      <nav className="flex items-center gap-8 text-sm">
        <Link href="/investments" className="text-fg hover:opacity-50">Drones</Link>
        <Link href="/partnership" className="text-fg hover:opacity-50">Business</Link>
        <Link href="/about" className="text-fg hover:opacity-50">About</Link>
        <Link
          href="/contact"
          className="border border-fg px-4 py-1.5 text-sm hover:bg-fg hover:text-bg"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
