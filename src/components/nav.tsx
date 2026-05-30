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

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-70">
          <Image
            src="/inzure-logo.png"
            alt="Spectr"
            width={32}
            height={32}
            className="h-8 w-auto invert"
            priority
          />
          <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em]">
            Spectr
          </span>
        </Link>

        <nav className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-white/70 sm:gap-6">

          {/* Dropdown */}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-3 text-white/70 hover:text-white focus:text-white focus:outline-none"
              aria-haspopup="true"
            >
              Menu
              <svg
                className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            <div className="pointer-events-none absolute right-0 top-full mt-4 w-[min(90vw,740px)] translate-y-2 opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="brand-font border border-black/10 bg-white shadow-2xl shadow-black/20">
                <div className="grid gap-8 p-6 sm:grid-cols-3 sm:p-8">
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
                              className="block text-black transition-transform duration-300 hover:translate-x-1 hover:opacity-60"
                            >
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Social row inside dropdown */}
                <div className="flex items-center gap-5 border-t border-black/8 px-6 py-4 sm:px-8">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-opacity hover:opacity-60"
                    aria-label="X / Twitter"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-opacity hover:opacity-60"
                    aria-label="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
                    </svg>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted transition-opacity hover:opacity-60"
                    aria-label="YouTube"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social icons in navbar */}
          <div className="hidden items-center gap-4 sm:flex">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-opacity hover:text-white"
              aria-label="X / Twitter"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-opacity hover:text-white"
              aria-label="LinkedIn"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
              </svg>
            </a>
          </div>

          {/* CTA */}
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
