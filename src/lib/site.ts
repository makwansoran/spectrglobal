export const site = {
  name: "Spectr",
  legalName: "spectr as",
  orgNumber: "936 961 967",
  url: "https://www.spectr.no",
  email: "makwan@spectr.no",
  phone: "+47 465 03 934",
  phoneHref: "tel:+4746503934",
  location: "Norway",
  tagline: "Spectr OS — the operating system for the enterprise.",
  description:
    "Spectr builds Spectr OS, an operating system for the enterprise — with AIM, Metaphysics, and Argus.",
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
      { label: "Spectr OS", href: "/platforms/spectr-os" },
      { label: "AIM", href: "/platforms/aim" },
      { label: "Metaphysics", href: "/platforms/metaphysics" },
      { label: "Argus", href: "/platforms/argus" },
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
      { label: "Spectr OS", href: "/platforms/spectr-os" },
      { label: "AIM", href: "/platforms/aim" },
      { label: "Metaphysics", href: "/platforms/metaphysics" },
      { label: "Argus", href: "/platforms/argus" },
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
