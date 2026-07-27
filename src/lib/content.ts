export const hero = {
  title: "Enterprise Intelligence Solutions.",
  titleLine2: "for every Decision.",
};

export type SoftwareProduct = {
  id: string;
  index: string;
  name: string;
  description: string;
  href: string;
};

export const softwareSection = {
  intro:
    "Our software powers real-time, AI-driven decisions on warehouse and industrial floors — from receiving docks to dispatch lanes.",
  title: "Our Software",
  subtitle: "Automate operations, from the factory floor to the fulfilment lane",
};

export const softwareProducts: SoftwareProduct[] = [
  {
    id: "droid",
    index: "/0.1",
    name: "Droid",
    description: "A humanoid built for floors that already exist — aisles, racking, and shifts as they are.",
    href: "/robotics",
  },
  {
    id: "spectr-mind",
    index: "/0.2",
    name: "Spectr Mind",
    description: "One model of your operation, shared by every unit and every decision on the floor.",
    href: "/#features",
  },
  {
    id: "spectr-c2",
    index: "/0.3",
    name: "Spectr C2",
    description: "A complete AI warehouse management system — free for enterprises, permanently.",
    href: "/wms",
  },
];

export type Offering = {
  id: string;
  label: string;
  title: string;
  href: string;
};

export const offerings: Offering[] = [
  {
    id: "droid",
    label: "Droid",
    title: "Humanoid labour for warehouses that already exist",
    href: "/robotics",
  },
  {
    id: "spectr-c2",
    label: "Spectr C2",
    title: "The free AI warehouse management system",
    href: "/wms",
  },
  {
    id: "spectr-mind",
    label: "Spectr Mind",
    title: "One operational model for every decision on the floor",
    href: "/#features",
  },
  {
    id: "pilots",
    label: "Pilot Programme",
    title: "Deploy with partner sites before general availability",
    href: "/contact",
  },
  {
    id: "careers",
    label: "Careers",
    title: "There is so much left to build",
    href: "/careers",
  },
];

export const partnersSection = {
  title: "What our partners say about us",
};

export type PartnerQuote = {
  company: string;
  quote: string;
  person: string;
  role: string;
};

export const partnerQuotes: PartnerQuote[] = [
  {
    company: "NORDIC 3PL",
    quote:
      "We went live on Spectr C2 across two sites in under a fortnight. Stock accuracy stopped being a weekly argument and started being a morning number we trust.",
    person: "Operations Director",
    role: "Multi-client fulfilment, Nordics",
  },
  {
    company: "COLD CHAIN NETWORK",
    quote:
      "The free licence meant we could put every shift lead on the system, not just the planners. Exceptions get closed on the floor instead of sitting in a spreadsheet for three days.",
    person: "Site Manager",
    role: "Temperature-controlled distribution",
  },
  {
    company: "SPARE PARTS HUB",
    quote:
      "Spectr Mind learned our SKU chaos faster than any consultant we have paid. Slotting recommendations that used to take a quarterly project now land as the day changes.",
    person: "Head of Warehouse",
    role: "Industrial spare parts",
  },
  {
    company: "EU RETAIL DC",
    quote:
      "We piloted Droid on tote transfer first. Same aisles, same racking — no rebuild. The WMS already knew the work, so the robot was a deployment, not a science project.",
    person: "Automation Lead",
    role: "National retail distribution",
  },
  {
    company: "PORT SIDE LOGISTICS",
    quote:
      "I did not need another dashboard telling me we were behind. I needed the system to surface the next decision. Spectr C2 does that without a seat count conversation.",
    person: "VP Operations",
    role: "Ports and terminals",
  },
  {
    company: "LINE-SIDE SUPPLY",
    quote:
      "Kitting used to burn a full shift of chase-downs. With Spectr C2 the shortages show up before the line stops — and we can hand the repetitive transfer work to Droid when we are ready.",
    person: "Plant Logistics Manager",
    role: "Manufacturing",
  },
  {
    company: "REGIONAL FULFILMENT",
    quote:
      "Migration from our legacy WMS was the part we feared. Their team mapped locations and open orders in days, then ran both systems in parallel until we cut over clean.",
    person: "IT & Operations",
    role: "Regional e-commerce fulfilment",
  },
  {
    company: "PHARMA DISTRIBUTOR",
    quote:
      "Audit trails and cycle counts that hold up under inspection mattered more than flashy AI. Spectr C2 gave us both — and it cost nothing to put the whole team on it.",
    person: "Quality & Compliance Lead",
    role: "Regulated distribution",
  },
];

export const ceoQuote = {
  quote:
    "The bottleneck in humanoid robotics is not actuators or compute. It is not having a truthful, continuously updated model of a real working environment.",
  attribution: "Makwan Hassan",
  role: "CEO, Spectr",
};

export type NewsItem = {
  id: string;
  source: string;
  date: string;
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export const newsSection = {
  title: "Latest News",
  viewAllLabel: "Newsroom",
  viewAllHref: "/news",
};

export const newsItems: NewsItem[] = [
  {
    id: "spectr-c2-free",
    source: "Spectr",
    date: "March 2026",
    title: "Spectr C2 is free for enterprises — permanently",
    summary:
      "A complete AI-native warehouse management system with no licence fee, no user cap, and no expiry date.",
    href: "/wms",
    cta: "Read More",
  },
  {
    id: "droid-pilots",
    source: "Spectr",
    date: "February 2026",
    title: "Droid pilot programme opens for Nordic warehouse partners",
    summary:
      "Limited early deployments on existing floors — same aisles, same racking, no rebuild required.",
    href: "/robotics",
    cta: "Read More",
  },
];
