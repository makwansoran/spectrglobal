import Image from "next/image";
import Link from "next/link";

const menuSections = [
  {
    title: "Development",
    links: ["ATTACK", "RECON", "JAMMER"],
  },
  {
    title: "Use Cases",
    links: ["Operations", "Intelligence", "Aerospace"],
  },
  {
    title: "Company",
    links: ["Get Started", "Products"],
  },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between rounded-full bg-black px-5 text-white shadow-2xl shadow-black/20 ring-1 ring-white/10 sm:px-7">
        <Link href="/" className="flex items-center gap-3 hover:opacity-70">
          <Image src="/inzure-logo.png" alt="Spectr" width={28} height={28} className="h-7 w-auto invert" />
          <span className="brand-font text-sm font-medium uppercase tracking-[0.34em]">
            Spectr
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-white/70 sm:gap-8">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 py-3 text-white/70 hover:text-white focus:text-white focus:outline-none"
              aria-haspopup="true"
            >
              Menu
              <span className="text-[10px] transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180">
                ↓
              </span>
            </button>

            <div className="pointer-events-none absolute right-0 top-full mt-4 w-[min(86vw,720px)] translate-y-2 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="brand-font grid gap-8 border border-black/10 bg-white p-6 text-black shadow-2xl shadow-black/20 sm:grid-cols-3 sm:p-8">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                      {section.title}
                    </p>
                    <ul className="mt-5 space-y-4 text-sm normal-case tracking-normal">
                      {section.links.map((link) => (
                        <li key={link}>
                          <Link
                            href={link === "Get Started" ? "/contact" : "/products"}
                            className="block text-black transition-transform duration-300 hover:translate-x-1 hover:text-muted"
                          >
                            {link}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

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
