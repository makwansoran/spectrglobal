import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="brand-font flex snap-start flex-col justify-end border-t border-border bg-bg text-fg">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-14 border-b border-border pb-14 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 hover:opacity-70">
              <Image
                src="/spectr-logo.png"
                alt="Spectr"
                width={28}
                height={28}
                className="h-7 w-auto"
              />
              <span className="text-sm font-semibold uppercase tracking-[0.34em]">Spectr</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-muted">
              Mission-ready aerial systems for operations, intelligence, and aerospace use cases.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Development</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/products/valkyrie" className="transition-opacity hover:opacity-50">VALKYRIE</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Company</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/contact" className="transition-opacity hover:opacity-50">Get Started</Link></li>
                <li><Link href="/about" className="transition-opacity hover:opacity-50">About Us</Link></li>
                <li><Link href="/products" className="transition-opacity hover:opacity-50">Products</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">Resources</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/newsroom" className="transition-opacity hover:opacity-50">Newsroom</Link></li>
                <li><Link href="/documentation" className="transition-opacity hover:opacity-50">Documentation</Link></li>
                <li><Link href="/security" className="transition-opacity hover:opacity-50">Security</Link></li>
                <li><Link href="/privacy" className="transition-opacity hover:opacity-50">Privacy Policy</Link></li>
                <li><Link href="/terms" className="transition-opacity hover:opacity-50">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X / Twitter"
              className="text-muted transition-opacity hover:opacity-60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted transition-opacity hover:opacity-60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-muted transition-opacity hover:opacity-60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
              </svg>
            </a>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
            © 2026 Spectr
          </p>
        </div>
      </div>
    </footer>
  );
}
