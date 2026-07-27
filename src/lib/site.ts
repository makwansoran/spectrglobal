export const site = {
  name: "Spectr",
  legalName: "spectr as",
  orgNumber: "936 961 967",
  url: "https://www.spectr.no",
  email: "makwan@spectr.no",
  phone: "+47 465 03 934",
  phoneHref: "tel:+4746503934",
  location: "Norway",
  tagline: "Droid for the physical economy, and Spectr C2 — the free AI warehouse system that gets you there.",
  description:
    "Spectr builds Droid, a general-purpose humanoid for warehouses and industrial floors, and gives enterprises Spectr C2 — a free AI-native warehouse management system.",
  social: {
    x: "https://x.com/spectrnorway",
    linkedin: "https://www.linkedin.com/company/spectr-norway/",
    instagram: "https://www.instagram.com/spectr.no/",
    youtube: "https://www.youtube.com/@SpectrNorway",
  },
} as const;

export const navPrimary = [
  {
    label: "Spectr OS",
    href: "/#features",
    children: [
      { label: "Droid", href: "/robotics" },
      { label: "AIM", href: "/#features" },
      { label: "Metaphysics", href: "/wms" },
      { label: "Argus", href: "/#features" },
    ],
  },
  { label: "Offerings", href: "/#offerings" },
  { label: "Careers", href: "/careers" },
  { label: "Newsroom", href: "/news" },
  { label: "Spectr Explained", href: "/about" },
] as const;

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
    title: "Spectr OS",
    links: [
      { label: "Droid", href: "/robotics" },
      { label: "AIM", href: "/#features" },
      { label: "Metaphysics", href: "/wms" },
      { label: "Argus", href: "/#features" },
      { label: "Get started", href: "/contact" },
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
