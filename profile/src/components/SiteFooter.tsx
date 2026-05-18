export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/10 bg-plt-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a href="/index.html" className="inline-flex items-center gap-2 text-white no-underline">
              <img
                src="/assets/brand/spectr-mark.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 brightness-0 invert"
                decoding="async"
              />
              <span className="font-display text-xl font-bold tracking-tight">Spectr</span>
            </a>
            <p className="mt-2 text-sm text-white/60">
              Operational intelligence — <strong className="font-semibold text-white">SPECTR AS</strong>
            </p>
          </div>
          <div className="text-sm text-white/55">
            <p className="font-mono text-xs tracking-wide text-white/45">SPECTR AS</p>
            <p className="mt-1">Org. nr. 926 574 892</p>
            <p>Eksempelgata 1, NO-0162 Oslo, Norway</p>
            <p className="mt-3 font-mono text-xs">© {year} SPECTR AS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
