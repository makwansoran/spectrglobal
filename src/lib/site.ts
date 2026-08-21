export const site = {
  name: "Spectr",
  legalName: "spectr as",
  orgNumber: "936 961 967",
  url: "https://www.spectr.no",
  email: "makwan@spectr.no",
  phone: "+47 465 03 934",
  phoneHref: "tel:+4746503934",
  location: "Norway",
  product: "Spectr OS",
  tagline: "Spectr OS — the operating system for the enterprise.",
  description:
    "Spectr builds Spectr OS, an operating system for the enterprise.",
  social: {
    x: "https://x.com/spectrnorway",
    linkedin: "https://www.linkedin.com/company/spectr-norway/",
    instagram: "https://www.instagram.com/spectr.no/",
    youtube: "https://www.youtube.com/@SpectrNorway",
  },
} as const;

export const navPrimary = [
  { label: "Products", href: "/platforms/spectr-os" },
  { label: "Solutions", href: "/platforms/spectr-os" },
  { label: "Company", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  label: string;
  href: string;
  items?: NavItem[];
};

export const navSections: NavSection[] = [
  {
    label: "Products",
    href: "/platforms/spectr-os",
    items: [
      {
        label: "Spectr OS",
        href: "/platforms/spectr-os",
        description: "The operating system for the enterprise — fuse data, decide, and act.",
      },
    ],
  },
  {
    label: "Solutions",
    href: "/platforms/spectr-os",
    items: [
      { label: "Logistics & supply chain", href: "/platforms/spectr-os", description: "Network decisions from inventory to yard." },
      { label: "Manufacturing", href: "/platforms/spectr-os", description: "Lines, parts, labour, and quality as one model." },
      { label: "Energy & industrials", href: "/platforms/spectr-os", description: "Plant signals turned into governed action." },
      { label: "Ports & terminals", href: "/platforms/spectr-os", description: "Yard, berth, and cargo in one runtime." },
    ],
  },
  {
    label: "Company",
    href: "/about",
    items: [
      { label: "About us", href: "/about", description: "A Norwegian team building Spectr OS." },
      { label: "Careers", href: "/careers", description: "A decade-long problem needs people who want one." },
      { label: "News", href: "/news", description: "Product releases and progress from the team." },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

export const navQuickLinks = [
  { label: "About Spectr", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Newsroom", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
] as const;

export const footerColumns = [
  {
    title: "Products",
    links: [
      { label: "Spectr OS", href: "/platforms/spectr-os" },
      { label: "Integrations", href: "/#integrations" },
      { label: "Get started", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Logistics", href: "/platforms/spectr-os" },
      { label: "Manufacturing", href: "/platforms/spectr-os" },
      { label: "Energy", href: "/platforms/spectr-os" },
      { label: "Healthcare", href: "/platforms/spectr-os" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "News", href: "/news" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms & conditions", href: "/terms" },
    ],
  },
] as const;

export const downloads = {
  windows: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "/downloads/Spectr-Setup-x64.exe",
  mac: process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? "/downloads/Spectr-Setup.dmg",
  linux: process.env.NEXT_PUBLIC_DOWNLOAD_LINUX ?? "/downloads/Spectr-Setup.AppImage",
} as const;
