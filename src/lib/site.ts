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
  { label: "Solutions", href: "/use-cases/manufacturing" },
  { label: "Company", href: "/company" },
  { label: "News", href: "/news" },
] as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  label: string;
  href?: string;
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
      {
        label: "Spectr Edge",
        href: "/platforms/spectr-edge",
        description: "On-site compute for AI vision.",
      },
    ],
  },
  {
    label: "Solutions",
    items: [
      { label: "Logistics", href: "/use-cases/logistics", description: "Planning and execution across the network." },
      { label: "Manufacturing", href: "/use-cases/manufacturing", description: "Strategy and the shop floor as one model." },
      { label: "Waste Management", href: "/use-cases/waste-management", description: "Collection, plants, and materials in one loop." },
    ],
  },
  {
    label: "Company",
    href: "/company",
    items: [
      { label: "About us", href: "/about", description: "A Norwegian team building Spectr OS." },
      { label: "SPECTR BOOTCAMP", href: "/bootcamp", description: "Learn to create your own AI and run it locally." },
      { label: "Waitlist", href: "/waitlist", description: "Be among the first to use Spectr OS." },
      { label: "News", href: "/news", description: "Product releases and progress from the team." },
    ],
  },
  { label: "News", href: "/news" },
];

export const navQuickLinks = [
  { label: "About Spectr", href: "/about" },
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
      { label: "Spectr Edge", href: "/platforms/spectr-edge" },
      { label: "Get started", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Logistics", href: "/use-cases/logistics" },
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Waste Management", href: "/use-cases/waste-management" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "News", href: "/news" },
      { label: "Waitlist", href: "/waitlist" },
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
