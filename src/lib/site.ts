export const site = {
  name: "Spectr",
  legalName: "spectr as",
  orgNumber: "936 961 967",
  url: "https://www.spectr.no",
  email: "makwan@spectr.no",
  phone: "+47 465 03 934",
  phoneHref: "tel:+4746503934",
  location: "Norway",
  product: "Spectr",
  tagline: "Open models for computer vision, AI vision, and VLA.",
  description:
    "Spectr builds open-source computer vision, AI vision, and vision-language-action models. Detect, segment, and act from one stack.",
  github: "https://github.com/makwansoran/spectrglobal",
  social: {
    x: "https://x.com/spectrnorway",
    linkedin: "https://www.linkedin.com/company/spectr-norway/",
    instagram: "https://www.instagram.com/spectr.no/",
    youtube: "https://www.youtube.com/@SpectrNorway",
  },
} as const;

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
  { label: "Models", href: "/#models" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Docs", href: "/developers" },
  { label: "Company", href: "/about" },
];

export const navQuickLinks = [
  { label: "About Spectr", href: "/about" },
  { label: "Newsroom", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
] as const;

export const downloads = {
  windows: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "/downloads/Spectr-Setup-x64.exe",
  mac: process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? "/downloads/Spectr-Setup.dmg",
  linux: process.env.NEXT_PUBLIC_DOWNLOAD_LINUX ?? "/downloads/Spectr-Setup.AppImage",
} as const;
