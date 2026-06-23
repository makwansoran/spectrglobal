import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav.links");
  const sections = await getTranslations("Footer.sections");

  return (
    <footer className="brand-font flex snap-start flex-col justify-end border-t border-border bg-bg text-fg">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-14 border-b border-border pb-14 lg:grid-cols-[1.2fr_1.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 hover:opacity-70">
              <Image src="/spectr-logo.png" alt="Spectr" width={28} height={28} className="h-7 w-auto" />
              <span className="text-sm font-semibold uppercase tracking-[0.34em]">Spectr</span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-7 text-muted">{t("tagline")}</p>
            <p className="mt-4 text-xs leading-6 text-muted">
              {t("orgNumber")} · {t("location")}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{sections("development")}</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/products/valkyrie" className="transition-opacity hover:opacity-50">{nav("valkyrie")}</Link></li>
                <li><Link href="/products/centurion" className="transition-opacity hover:opacity-50">{nav("centurion")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{sections("company")}</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/contact" className="transition-opacity hover:opacity-50">{nav("contact")}</Link></li>
                <li><Link href="/about" className="transition-opacity hover:opacity-50">{nav("about")}</Link></li>
                <li><Link href="/products" className="transition-opacity hover:opacity-50">{nav("products")}</Link></li>
                <li><Link href="/careers" className="transition-opacity hover:opacity-50">{nav("careers")}</Link></li>
                <li><Link href="/investor" className="transition-opacity hover:opacity-50">{nav("investor")}</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{sections("resources")}</h3>
              <ul className="mt-6 space-y-4 text-sm">
                <li><Link href="/newsroom" className="transition-opacity hover:opacity-50">{nav("newsroom")}</Link></li>
                <li><Link href="/documentation" className="transition-opacity hover:opacity-50">{nav("documentation")}</Link></li>
                <li><Link href="/security" className="transition-opacity hover:opacity-50">{nav("security")}</Link></li>
                <li><Link href="/privacy" className="transition-opacity hover:opacity-50">{nav("privacy")}</Link></li>
                <li><Link href="/terms" className="transition-opacity hover:opacity-50">{nav("terms")}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <SocialButton href="https://x.com/spectrnorway" label="X / Twitter" className="bg-black text-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </SocialButton>
            <SocialButton href="https://www.linkedin.com/company/spectr-norway/" label="LinkedIn" className="bg-[#0A66C2] text-white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
            </SocialButton>
            <SocialButton href="https://www.instagram.com/spectr.no/" label="Instagram" className="bg-[linear-gradient(135deg,#405DE6,#833AB4,#C13584,#E1306C,#FD1D1D,#FCAF45)] text-white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608.975-.975 2.242-1.253 3.608-1.315 1.266-.058 1.646-.07 4.85-.07Zm0 1.77c-3.15 0-3.522.012-4.77.069-1.154.052-1.781.245-2.197.407-.55.214-.943.47-1.356.883-.413.413-.669.806-.883 1.356-.162.416-.355 1.043-.407 2.197-.057 1.248-.069 1.62-.069 4.77s.012 3.522.069 4.77c.052 1.154.245 1.781.407 2.197.214.55.47.943.883 1.356.413.413.806.669 1.356.883.416.162 1.043.355 2.197.407 1.248.057 1.62.069 4.77.069s3.522-.012 4.77-.069c1.154-.052 1.781-.245 2.197-.407.55-.214.943-.47 1.356-.883.413-.413.669-.806.883-1.356.162-.416.355-1.043.407-2.197.057-1.248.069-1.62.069-4.77s-.012-3.522-.069-4.77c-.052-1.154-.245-1.781-.407-2.197-.214-.55-.47-.943-.883-1.356-.413-.413-.806-.669-1.356-.883-.416-.162-1.043-.355-2.197-.407-1.248-.057-1.62-.069-4.77-.069Zm0 3.675a4.392 4.392 0 1 1 0 8.784 4.392 4.392 0 0 1 0-8.784Zm0 1.77a2.622 2.622 0 1 0 0 5.244 2.622 2.622 0 0 0 0-5.244Zm4.62-2.034a1.026 1.026 0 1 1 0 2.052 1.026 1.026 0 0 1 0-2.052Z" />
            </SocialButton>
            <SocialButton href="https://www.youtube.com/@SpectrNorway" label="YouTube" className="bg-[#FF0000] text-white">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
            </SocialButton>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  className,
  children,
}: {
  href: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-75 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        {children}
      </svg>
      {label.split(" ")[0]}
    </a>
  );
}
