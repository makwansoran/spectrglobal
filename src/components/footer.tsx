import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { site } from "@/lib/site";
import "./footer.css";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Spectr OS", href: "/platforms/spectr-os" },
      { label: "Argus", href: "/argus" },
      { label: "VisionLab", href: "/visionlab" },
      { label: "Offerings", href: "/offerings" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Logistics", href: "/use-cases/logistics" },
      { label: "Waste management", href: "/use-cases/waste-management" },
      { label: "Mining", href: "/use-cases/mining" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers" },
      { label: "News", href: "/news" },
      { label: "Developers", href: "/developers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
] as const;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer({ dark = false }: { dark?: boolean }) {
  const year = new Date().getFullYear();

  return (
    <footer className={dark ? "site-footer site-footer--dark" : "site-footer"}>
      <div className="site-footer__columns">
        {columns.map((column) => (
          <div key={column.title} className="site-footer__column">
            <p className="site-footer__heading">{column.title}</p>
            <ul>
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="site-footer__column">
          <p className="site-footer__heading">Social</p>
          <ul>
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__social-link"
                aria-label="Spectr on LinkedIn"
              >
                <LinkedInIcon className="site-footer__social-icon" />
                <span>LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="site-footer__legal">© {year} {site.legalName}. All rights reserved.</p>

      <div className="site-footer__mark" aria-hidden="true">
        <LogoMark invert={dark} title="" className="site-footer__icon" />
        <span>Spectr</span>
      </div>
    </footer>
  );
}
