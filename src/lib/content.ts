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
  previewImage?: string;
  previewImageAlt?: string;
};

export const softwareSection = {
  title: "Solutions",
};

export const offeringsCeoQuote = {
  eyebrow: "Spectr Philosophy",
  quote:
    "Forbidding is forbidden to us. Technological advancement is a must for our customers — not a feature we ship, but the standard we hold.",
  attribution: "Makwan Soran Ismail",
  role: "CEO, Spectr",
};

export const softwareProducts: SoftwareProduct[] = [
  {
    id: "spectr-os",
    index: "/0.1",
    name: "Spectr OS",
    description:
      "The operating system for the enterprise — data fusion, decision making, and agentic workflows in one runtime.",
    href: "/platforms/spectr-os",
    previewImage: "/images/products/spectr-os-ui.png",
    previewImageAlt: "Spectr OS warehouse intelligence interface",
  },
  {
    id: "aim",
    index: "/0.2",
    name: "AIM",
    description:
      "Artificial Intelligence Model — one model of your operation, shared by every unit and every decision on the floor.",
    href: "/platforms/aim",
  },
  {
    id: "metaphysics",
    index: "/0.3",
    name: "Metaphysics",
    description:
      "Ontology layer — the semantic model of your operation that makes Spectr OS coherent across every decision.",
    href: "/platforms/metaphysics",
  },
  {
    id: "argus",
    index: "/0.4",
    name: "Argus",
    description:
      "Object detection model — sees every unit, pallet, and exception on the floor in real time.",
    href: "/platforms/argus",
  },
];

export type Offering = {
  id: string;
  label: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const offerings: Offering[] = [
  {
    id: "spectr-os",
    label: "Spectr OS",
    title: "The operating system for the enterprise",
    href: "/platforms/spectr-os",
    image: "/images/offerings/spectr-os.jpg",
    imageAlt: "Spectr OS running industrial operations",
  },
  {
    id: "metaphysics",
    label: "Metaphysics",
    title: "Ontology layer for every object, action, and decision on the floor",
    href: "/platforms/metaphysics",
    image: "/images/offerings/spectr-c2.jpg",
    imageAlt: "Warehouse operations powered by the Metaphysics ontology",
  },
  {
    id: "aim",
    label: "AIM",
    title: "Artificial Intelligence Model for every decision on the floor",
    href: "/platforms/aim",
    image: "/images/offerings/spectr-mind.jpg",
    imageAlt: "Circuit board representing the Artificial Intelligence Model",
  },
  {
    id: "argus",
    label: "Argus",
    title: "Object detection model for every unit on the floor",
    href: "/platforms/argus",
    image: "/spectr-detection.png",
    imageAlt: "Argus object detection on warehouse assets",
  },
  {
    id: "pilots",
    label: "Pilot Programme",
    title: "Deploy with partner sites before general availability",
    href: "/contact",
    image: "/images/offerings/pilots.jpg",
    imageAlt: "Warehouse operations and logistics",
  },
  {
    id: "careers",
    label: "Careers",
    title: "There is so much left to build",
    href: "/careers",
    image: "/images/offerings/careers.jpg",
    imageAlt: "Team collaborating on product work",
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
      "We went live on Metaphysics across two sites in under a fortnight. Stock accuracy stopped being a weekly argument and started being a morning number we trust.",
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
      "AIM learned our SKU chaos faster than any consultant we have paid. Slotting recommendations that used to take a quarterly project now land as the day changes.",
    person: "Head of Warehouse",
    role: "Industrial spare parts",
  },
  {
    company: "EU RETAIL DC",
    quote:
      "We rolled Spectr OS across the DC without rebuilding a single aisle. Argus and Metaphysics already knew the work — deployment was configuration, not a science project.",
    person: "Automation Lead",
    role: "National retail distribution",
  },
  {
    company: "PORT SIDE LOGISTICS",
    quote:
      "I did not need another dashboard telling me we were behind. I needed the system to surface the next decision. Metaphysics does that without a seat count conversation.",
    person: "VP Operations",
    role: "Ports and terminals",
  },
  {
    company: "LINE-SIDE SUPPLY",
    quote:
      "Kitting used to burn a full shift of chase-downs. With Metaphysics the shortages show up before the line stops — and AIM keeps the plan current as the day changes.",
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
      "Audit trails and cycle counts that hold up under inspection mattered more than flashy AI. Metaphysics gave us both — and it cost nothing to put the whole team on it.",
    person: "Quality & Compliance Lead",
    role: "Regulated distribution",
  },
];

export const ceoQuote = {
  quote:
    "The bottleneck in warehouse intelligence is not dashboards or compute. It is not having a truthful, continuously updated model of a real working environment.",
  attribution: "Makwan Soran Ismail",
  role: "CEO, Spectr",
};

export const demoRequest = {
  title: "Request a Demo",
  body: "Interested in solving your problems with Spectr software? Tell us about your operation and we will set up a walkthrough.",
  submitLabel: "Submit",
};

export type NewsItem = {
  id: string;
  source: string;
  date: string;
  title: string;
  summary: string;
  href: string;
  cta: string;
  image: string;
  imageAlt: string;
};

export const newsSection = {
  title: "Latest News",
  viewAllLabel: "Newsroom",
  viewAllHref: "/news",
};

export const newsItems: NewsItem[] = [
  {
    id: "spectr-os-free",
    source: "Spectr",
    date: "March 2026",
    title: "Spectr OS is free for all enterprise customers — permanently",
    summary:
      "No licence fee, no user cap, no expiry date. AIM, Metaphysics, and Argus included for every enterprise running Spectr OS.",
    href: "/news",
    cta: "Read More",
    image: "/images/news/spectr-os-free.jpg",
    imageAlt: "Enterprise warehouse floor running on Spectr OS",
  },
  {
    id: "argus-benchmarks",
    source: "Spectr",
    date: "February 2026",
    title: "Argus surpasses YOLOv11 and leading detection models on warehouse floors",
    summary:
      "Spectr’s object detection model sets a new bar for real-time accuracy on industrial SKUs, pallets, and exceptions — where generic vision models fall short.",
    href: "/news",
    cta: "Read More",
    image: "/images/news/argus-detection.jpg",
    imageAlt: "Argus object detection bounding boxes on industrial equipment",
  },
];
