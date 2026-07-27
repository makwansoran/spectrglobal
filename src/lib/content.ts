export const hero = {
  title: "Robots that work the floor. Software that runs it.",
  primaryCta: { label: "Get Spectr C2 free", href: "/contact" },
  secondaryCta: { label: "See Droid", href: "/robotics" },
};

export const marqueeItems = [
  "Warehousing",
  "Fulfilment",
  "3PL & logistics",
  "Cold chain",
  "Manufacturing",
  "Ports & terminals",
  "Retail distribution",
  "Spare parts",
];

export const marqueeCaption = "Built for the operations that move physical goods";

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
  subtitle: "Run the floor today. Add embodiment when you are ready.",
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

export type UseCase = {
  title: string;
  description: string;
  points: string[];
};

export const useCasesSection = {
  title: "Every operation where goods have to move.",
  subtitle: "Start with Spectr C2. Add Droid where the labour is hardest to fill.",
};

export const useCases: UseCase[] = [
  {
    title: "Warehouse operations",
    description:
      "Run receiving through dispatch on one system, with stock accuracy that holds up under audit and slotting that adapts to real demand.",
    points: ["Cycle counting", "Dynamic slotting", "Live stock accuracy"],
  },
  {
    title: "Fulfilment & 3PL",
    description:
      "Handle multiple clients, SLAs and carrier mixes in a single tenant model, with per-client reporting that does not need a spreadsheet.",
    points: ["Multi-client tenancy", "SLA tracking", "Carrier integration"],
  },
  {
    title: "Manufacturing & parts",
    description:
      "Keep line-side inventory correct, feed kitting and assembly on time, and put Droid units on the repetitive transfer work first.",
    points: ["Line-side supply", "Kitting", "Robot-assisted transfer"],
  },
];

export const benefitsSection = {
  title: "Serious capability. No licence conversation.",
  subtitle:
    "We build Droid, and we give away Spectr C2. That shapes every decision below.",
};

export const benefits = [
  {
    title: "Genuinely free",
    description:
      "Spectr C2 costs nothing for enterprises. Not a trial, not a capped tier — the working system, indefinitely.",
  },
  {
    title: "Built for real floors",
    description:
      "Designed against messy racking, mixed SKUs, partial data and people working shifts, not a reference warehouse.",
  },
  {
    title: "Learns your operation",
    description:
      "Every scan, exception and correction improves the model of your specific site rather than a generic average.",
  },
  {
    title: "Droid-ready from day one",
    description:
      "The data model already describes the world the way Droid needs it, so adding hardware is a deployment, not a migration.",
  },
  {
    title: "Open and API-first",
    description:
      "REST and webhooks across the whole surface. Connect your ERP, TMS, carriers and BI without waiting on us.",
  },
  {
    title: "European data governance",
    description:
      "GDPR-aligned by default, hosted in the EU or on your own infrastructure. Your operational data is never sold or resold.",
  },
];

export const howItWorksSection = {
  title: "Three steps to a warehouse that improves itself.",
};

export const howItWorks = [
  {
    step: "01",
    title: "Connect your operation",
    description:
      "Bring in your locations, SKUs and open orders. We map your existing structure rather than asking you to redesign it around the software.",
  },
  {
    step: "02",
    title: "Run Spectr C2 free",
    description:
      "Your team works the floor on Spectr C2. Accuracy climbs, exceptions get logged properly, and the model starts learning the site.",
  },
  {
    step: "03",
    title: "Add Droid when ready",
    description:
      "When a task is well understood by the system, a Droid unit can take it. You choose the pace, task by task, aisle by aisle.",
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

export const principlesSection = {
  title: "What we believe about physical work.",
  subtitle:
    "Testimonials arrive once customers are live. In the meantime, here is the thinking the company is built on.",
};

export const principles = [
  {
    quote:
      "The bottleneck in humanoid robotics is not actuators or compute. It is not having a truthful, continuously updated model of a real working environment.",
    attribution: "On why Spectr C2 comes first",
  },
  {
    quote:
      "Software that charges per seat gets deployed to the fewest possible seats. That is exactly the wrong incentive when you need coverage of the whole floor.",
    attribution: "On pricing Spectr C2 at zero",
  },
  {
    quote:
      "A robot that requires you to rebuild your warehouse has moved the cost, not removed it. Human-shaped spaces call for human-shaped machines.",
    attribution: "On the Droid form factor",
  },
  {
    quote:
      "Every warehouse is a different problem wearing the same uniform. General capability has to come from learning the site, not from configuration screens.",
    attribution: "On site-specific intelligence",
  },
  {
    quote:
      "Automation should absorb the shifts nobody wants and the injuries nobody plans for, and leave the judgement work to people.",
    attribution: "On what to automate first",
  },
  {
    quote:
      "If the operator cannot see why the system made a decision, the system will be overridden until it is switched off. Legibility is a feature.",
    attribution: "On trust on the floor",
  },
];

export const getStartedCtas = [
  { label: "Request a Demo", href: "/contact", tone: "light" as const },
  { label: "Start Building", href: "/wms", tone: "dark" as const },
];

export const faqSection = {
  title: "The questions we get asked first.",
};

export const faqs = [
  {
    question: "Is Spectr C2 actually free, or free for a while?",
    answer:
      "Actually free. Enterprises can run Spectr C2 with unlimited users, locations and volume at no licence cost, with no expiry date. Migration, self-hosting, integrations, governance, support, and the Droid pilot programme are all included. There is nothing to upgrade into.",
  },
  {
    question: "Why would a robotics company give away warehouse software?",
    answer:
      "Because useful humanoid robots need an accurate, continuously updated model of a real working environment, and that is precisely what Spectr C2 produces. Every warehouse running it makes Droid better. The exchange is honest: you get a serious system for free, we get to build toward embodiment on real operational ground.",
  },
  {
    question: "What happens to our data?",
    answer:
      "Your operational data stays yours. It is hosted in the EU or in your own environment, governed under GDPR, and never sold or shared with third parties. Where we use aggregate patterns to improve our models, it is covered explicitly in the agreement and you can decline without losing any functionality.",
  },
  {
    question: "Do we have to take Droid to use Spectr C2?",
    answer:
      "No. Spectr C2 is a complete product on its own and many customers will never deploy a robot. There is no bundling requirement and no pressure to move to hardware.",
  },
  {
    question: "When will Droid be available?",
    answer:
      "We are in active development and running a limited pilot programme with partner sites rather than taking general orders. If you operate a warehouse or industrial floor and want to be part of early deployment, apply to the pilot and we will talk about whether your site is a fit.",
  },
  {
    question: "How long does it take to get Spectr C2 running?",
    answer:
      "A single-site operation with clean master data can be live in days. Complex multi-site rollouts with ERP integration and historical migration typically run a few weeks. We scope it honestly before you commit anything.",
  },
  {
    question: "What does it integrate with?",
    answer:
      "Everything with an API, plus the usual suspects natively — major ERPs, transport management systems, carrier networks and BI tools. If something is missing, the open REST API and webhooks let your team build it without waiting on our roadmap.",
  },
];

export const closingCta = {
  title: "Start with Spectr C2. Finish with Droid on the floor.",
  subtitle:
    "Tell us about your operation and we will show you what Spectr C2 looks like running on your data — at no cost, with no procurement cycle.",
  primary: { label: "Get Spectr C2 free", href: "/contact" },
  secondary: { label: "Explore Droid", href: "/robotics" },
};
