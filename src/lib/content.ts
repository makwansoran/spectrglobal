export type UseCase = {
  id: string;
  index: string;
  name: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const useCasesSection = {
  title: "Use Cases",
};

export { industryListings as useCases } from "@/lib/use-cases";

export const spectrBootcamp = {
  href: "/bootcamp",
  eyebrow: "SPECTR BOOTCAMP",
  title: "Learn to create your own AI.",
  body: "SPECTR BOOTCAMP is a one-video course on building a model with your own data, wiring it into a workflow, and running it locally — on your machines, not someone else’s cloud. Every Spectr account includes the course.",
  courseLabel: "1 video course",
  cta: "Open bootcamp →",
  attendTitle: "Want to attend?",
  attendBody:
    "Log in with your Spectr account. SPECTR BOOTCAMP is included for every Spectr user — Spectr OS downloads are granted separately.",
  attendCta: "Log in to attend",
  videoSrc: "/videos/spectr-bootcamp.mp4",
  videoTitle: "Spectr Bootcamp — create, train, and run your own AI",
  planEyebrow: "Show plan",
  planTitle: "Five steps from your data to a local AI workflow",
  steps: [
    {
      index: "01",
      title: "Bring your data",
      body: "Collect the logs, sensors, and operational records that already describe how your organisation works.",
      image: "/images/bootcamp/step-1-data.png",
      imageAlt: "Industrial datasets and sensor logs prepared for training",
    },
    {
      index: "02",
      title: "Train the model",
      body: "Fit the model on your data so it learns your processes, constraints, and language — not a generic internet average.",
      image: "/images/bootcamp/step-2-train.png",
      imageAlt: "Local workstation training a neural network",
    },
    {
      index: "03",
      title: "Design the workflow",
      body: "Connect ingest, inference, and action as a workflow: nodes, handoffs, and the decisions the system is allowed to take.",
      image: "/images/bootcamp/step-3-workflow.png",
      imageAlt: "Node-based workflow canvas connecting data, training, and output",
    },
    {
      index: "04",
      title: "Run it locally",
      body: "Stand the runtime up on your own hardware so the model and the data never have to leave the site.",
      image: "/images/bootcamp/step-4-local.png",
      imageAlt: "On-premises server and laptop running a local AI runtime",
    },
    {
      index: "05",
      title: "Operate the loop",
      body: "Put the workflow on the floor. Watch it, correct it, and retrain as the work changes.",
      image: "/images/bootcamp/step-5-operate.png",
      imageAlt: "Control room operating a live industrial AI workflow",
    },
  ],
} as const;

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
      "We went live on Spectr OS across two sites in under a fortnight. Stock accuracy stopped being a weekly argument and started being a morning number we trust.",
    person: "Operations Director",
    role: "Multi-client fulfilment, Nordics",
  },
  {
    company: "COLD CHAIN NETWORK",
    quote:
      "We could put every shift lead on the system, not just the planners. Exceptions get closed on the floor instead of sitting in a spreadsheet for three days.",
    person: "Site Manager",
    role: "Temperature-controlled distribution",
  },
  {
    company: "SPARE PARTS HUB",
    quote:
      "Spectr OS learned our SKU chaos faster than any consultant we have paid. Slotting recommendations that used to take a quarterly project now land as the day changes.",
    person: "Head of Warehouse",
    role: "Industrial spare parts",
  },
  {
    company: "EU RETAIL DC",
    quote:
      "We rolled Spectr OS across the DC without rebuilding a single aisle. The runtime already knew the work — deployment was configuration, not a science project.",
    person: "Automation Lead",
    role: "National retail distribution",
  },
  {
    company: "PORT SIDE LOGISTICS",
    quote:
      "I did not need another dashboard telling me we were behind. I needed the system to surface the next decision. Spectr OS does that without a seat count conversation.",
    person: "VP Operations",
    role: "Ports and terminals",
  },
  {
    company: "LINE-SIDE SUPPLY",
    quote:
      "Kitting used to burn a full shift of chase-downs. With Spectr OS the shortages show up before the line stops — and the plan stays current as the day changes.",
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
      "Audit trails and cycle counts that hold up under inspection mattered more than flashy AI. Spectr OS gave us both — and the whole team could work from the same model.",
    person: "Quality & Compliance Lead",
    role: "Regulated distribution",
  },
];

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

export const newsItems: NewsItem[] = [
  {
    id: "spectr-os-free",
    source: "Spectr",
    date: "March 2026",
    title: "The operating system for the whole floor",
    summary:
      "Spectr OS fuses the floor and holds the ontology so shift leads, planners, and agents work from the same live model.",
    href: "/news",
    cta: "Read More",
    image: "/images/news/spectr-os-free.jpg",
    imageAlt: "Enterprise warehouse floor running on Spectr OS",
  },
];
