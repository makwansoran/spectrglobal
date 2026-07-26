export const site = {
  name: "Spectr",
  legalName: "spectr as",
  orgNumber: "936 961 967",
  url: "https://www.spectr.no",
  email: "makwan@spectr.no",
  phone: "+47 465 03 934",
  phoneHref: "tel:+4746503934",
  location: "Norway",
  tagline: "Humanoid robots for the physical economy, and the AI warehouse system that gets you there.",
  description:
    "Spectr builds general-purpose humanoid robots for warehouses and industrial floors, and gives enterprises a free AI-native warehouse management system today.",
  social: {
    x: "https://x.com/spectrnorway",
    linkedin: "https://www.linkedin.com/company/spectr-norway/",
    instagram: "https://www.instagram.com/spectr.no/",
    youtube: "https://www.youtube.com/@SpectrNorway",
  },
} as const;

export const navLinks = [
  { label: "Robotics", href: "/robotics" },
  { label: "Free WMS", href: "/wms" },
  { label: "Company", href: "/about" },
  { label: "News", href: "/news" },
] as const;

export const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Humanoid robotics", href: "/robotics" },
      { label: "Spectr WMS", href: "/wms" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
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
