import { site } from "@/lib/site";

export function Footer({ dark = false }: { dark?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={dark ? "mt-auto border-t border-white/10 bg-[#070708] text-zinc-100" : "mt-auto border-t border-border bg-white"}>
      <div className="container-x flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <SocialLink href={site.social.linkedin} label="LinkedIn" dark={dark}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
        </SocialLink>
        <p className={`text-sm ${dark ? "text-zinc-500" : "text-muted"}`}>
          © {year} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  dark = false,
  children,
}: {
  href: string;
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={dark ? "text-zinc-400 hover:text-white" : "text-muted hover:text-fg"}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}
