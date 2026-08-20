import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { footerColumns, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border" style={{ backgroundColor: "#F9F9F9" }}>
      <div className="container-x py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="text-[15px] font-medium tracking-[-0.02em] text-fg">Spectr</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
              {site.tagline}
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="text-sm font-medium text-fg">{column.title}</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link href={link.href} className="text-muted hover:text-fg">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-5">
            <SocialLink href={site.social.x} label="X">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.264 5.632L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
            </SocialLink>
            <SocialLink href={site.social.linkedin} label="LinkedIn">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
            </SocialLink>
            <SocialLink href={site.social.instagram} label="Instagram">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.34 3.608 1.315.975.975 1.253 2.242 1.315 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.34 2.633-1.315 3.608-.975.975-2.242 1.253-3.608 1.315-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.34-3.608-1.315-.975-.975-1.253-2.242-1.315-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.34-2.633 1.315-3.608.975-.975 2.242-1.253 3.608-1.315 1.266-.058 1.646-.07 4.85-.07Zm0 1.77c-3.15 0-3.522.012-4.77.069-1.154.052-1.781.245-2.197.407-.55.214-.943.47-1.356.883-.413.413-.669.806-.883 1.356-.162.416-.355 1.043-.407 2.197-.057 1.248-.069 1.62-.069 4.77s.012 3.522.069 4.77c.052 1.154.245 1.781.407 2.197.214.55.47.943.883 1.356.413.413.806.669 1.356.883.416.162 1.043.355 2.197.407 1.248.057 1.62.069 4.77.069s3.522-.012 4.77-.069c1.154-.052 1.781-.245 2.197-.407.55-.214.943-.47 1.356-.883.413-.413.669-.806.883-1.356.162-.416.355-1.043.407-2.197.057-1.248.069-1.62.069-4.77s-.012-3.522-.069-4.77c-.052-1.154-.245-1.781-.407-2.197-.214-.55-.47-.943-.883-1.356-.413-.413-.806-.669-1.356-.883-.416-.162-1.043-.355-2.197-.407-1.248-.057-1.62-.069-4.77-.069Zm0 3.675a4.392 4.392 0 1 1 0 8.784 4.392 4.392 0 0 1 0-8.784Zm0 1.77a2.622 2.622 0 1 0 0 5.244 2.622 2.622 0 0 0 0-5.244Zm4.62-2.034a1.026 1.026 0 1 1 0 2.052 1.026 1.026 0 0 1 0-2.052Z" />
            </SocialLink>
            <SocialLink href={site.social.youtube} label="YouTube">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
            </SocialLink>
          </div>
          <p className="text-sm text-muted">
            © {year} {site.legalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted hover:text-fg"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
