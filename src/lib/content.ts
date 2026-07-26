export const hero = {
  title: "Robots that work the floor. Software that runs it.",
  subtitle:
    "Spectr is building Droid, a general-purpose humanoid for warehouses and industrial sites. Spectr C2 — the AI warehouse management system that trains it — is free for enterprises, today and permanently.",
  primaryCta: { label: "Get Spectr C2 free", href: "/contact" },
  secondaryCta: { label: "See Droid", href: "/robotics" },
  note: "No licence fee. No seat count. No expiry.",
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

export type Feature = {
  id: string;
  tab: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
};

export const features: Feature[] = [
  {
    id: "droid",
    tab: "Droid",
    kicker: "The robot",
    title: "A humanoid built for floors that already exist.",
    description:
      "Most automation asks you to rebuild the building around it. Droid is designed for the aisles, racking, totes and doorways you already have — bipedal, tool-agnostic, and able to work a shift alongside people.",
    bullets: [
      "Human-scale reach and footprint, so no re-racking or fixed conveyors",
      "Two-handed manipulation for picking, totes, cartons and irregular items",
      "Onboard perception and planning, with safe operation around staff",
      "Charges and hands off between shifts without a dedicated operator",
    ],
  },
  {
    id: "spectr-mind",
    tab: "Spectr Mind",
    kicker: "The intelligence",
    title: "One model of your operation, shared by every unit.",
    description:
      "Spectr Mind is the world model behind the fleet. It learns the layout, the inventory, the exceptions and the habits of a specific site, then transfers what it learns to every Droid and every recommendation Spectr C2 makes.",
    bullets: [
      "Learns site-specific layout, SKUs and edge cases from day one",
      "Turns warehouse telemetry into training signal for manipulation",
      "Improves routing and slotting decisions as the operation changes",
      "Runs the same model on the floor and in the planning layer",
    ],
  },
  {
    id: "spectr-c2",
    tab: "Spectr C2",
    kicker: "The free system",
    title: "A complete AI warehouse management system, at no cost.",
    description:
      "Inbound, putaway, slotting, picking, packing, dispatch and stock accuracy — the full loop, AI-native from the ground up. We give Spectr C2 away because a well-instrumented warehouse is what makes useful robots possible.",
    bullets: [
      "Full WMS feature set with no paid tier gating the essentials",
      "Natural-language querying and reporting over live stock data",
      "Integrates with your ERP, TMS and carriers through an open API",
      "Deploys in the cloud or in your own environment",
    ],
  },
];

export const featuresSection = {
  title: "One stack, from the shelf to the hand.",
  subtitle:
    "Spectr C2 runs your warehouse today. The same intelligence drives Droid when you are ready for it.",
};

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

export const pricingSection = {
  title: "The software is free. The ambition is not small.",
  subtitle: "One plan. Everything included. Spectr C2 costs nothing — forever.",
};

export type Plan = {
  name: string;
  price: string;
  period?: string;
  description: string;
  featured?: boolean;
  badge?: string;
  cta: { label: string; href: string };
  featuresTitle: string;
  features: string[];
};

export const plans: Plan[] = [
  {
    name: "Spectr C2",
    price: "Free",
    period: "forever",
    description:
      "The complete AI warehouse management system for enterprises — migration, self-hosting, integrations, governance, and Droid pilot access included. No licence fee. No user cap.",
    featured: true,
    badge: "Everything included",
    cta: { label: "Get started free", href: "/contact" },
    featuresTitle: "Included",
    features: [
      "Unlimited users and locations",
      "Inbound, putaway, picking, packing, dispatch",
      "AI slotting, forecasting and natural-language reporting",
      "Open REST API and webhooks",
      "EU-hosted, GDPR-aligned",
      "Guided migration from your current WMS",
      "Self-hosted or private-cloud deployment",
      "Custom ERP, TMS and automation integrations",
      "SSO, audit logging and role governance",
      "Contracted SLA and named support",
      "Droid site assessment and task selection",
      "On-site Droid deployment with our engineers",
      "Direct input into the hardware roadmap",
      "Preferential terms at commercial release",
      "Joint publication rights on results",
    ],
  },
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
