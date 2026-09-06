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
  { label: "Spectr OS", href: "/platforms/spectr-os" },
  { label: "Offerings", href: "/offerings" },
  { label: "About", href: "/about" },
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
  previewVideo?: string;
};

export const navSections: NavSection[] = [
  {
    label: "Spectr OS",
    href: "/platforms/spectr-os",
    previewVideo: "/videos/spectr-os.mp4",
  },
  {
    label: "Offerings",
    href: "/offerings",
  },
  {
    label: "About",
    href: "/about",
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
      { label: "Get started", href: "/contact" },
    ],
  },
  {
    title: "Offerings",
    links: [
      { label: "All offerings", href: "/offerings" },
      { label: "Manufacturing", href: "/use-cases/manufacturing" },
      { label: "Logistics", href: "/use-cases/logistics" },
      { label: "Waste Management", href: "/use-cases/waste-management" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
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
