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

const socials = [
  { label: "X", href: site.social.x },
  { label: "LinkedIn", href: site.social.linkedin },
  { label: "Instagram", href: site.social.instagram },
  { label: "YouTube", href: site.social.youtube },
] as const;

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
            {socials.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
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
