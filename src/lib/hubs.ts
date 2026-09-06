import { industryPages } from "@/lib/use-cases";
import { partnerQuotes } from "@/lib/content";

export type HubCard = {
  title: string;
  body: string;
  href: string;
  image?: string;
  imageAlt?: string;
};

export type HubPage = {
  path: string;
  bannerTitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  headline: string;
  columnOne: string;
  columnTwo: string;
  cardsTitle?: string;
  cards?: HubCard[];
  quotesTitle?: string;
  capabilitiesTitle?: string;
  capabilities?: { title: string; body: string }[];
  moreTitle?: string;
  more?: { label: string; href: string }[];
};

export const productCards: HubCard[] = [
  {
    title: "Spectr OS",
    body: "The operating system for the enterprise. Fuse data, decide, and act in one runtime — on the floor, not in a slide.",
    href: "/platforms/spectr-os",
    image: "/images/offerings/spectr-os.jpg",
    imageAlt: "Spectr OS running enterprise operations",
  },
  {
    title: "Ontology",
    body: "The central system for orchestrating decisions across people, models, and software — objects that stay true as the site changes.",
    href: "/products/ontology",
    image: "/images/products/metaphysics-ui.png",
    imageAlt: "Ontology and workflow canvas",
  },
  {
    title: "Agentic runtime",
    body: "Go beyond chat. Turn models into agents and automations that propose real work — with a human still on the approval.",
    href: "/products/agents",
    image: "/images/products/aim-ui.png",
    imageAlt: "Agentic operational interface",
  },
  {
    title: "Command",
    body: "Decision advantage for operations: ranked options, evidence, and a record of why the next move was taken.",
    href: "/products/command",
    image: "/images/offerings/spectr-c2.jpg",
    imageAlt: "Operational command and decisions",
  },
  {
    title: "Deploy",
    body: "Stand the runtime up across cloud, on-prem, and the edge. Monitor it. Keep it current without a science project.",
    href: "/products/deploy",
    image: "/images/offerings/pilots.jpg",
    imageAlt: "On-site deployment of Spectr OS",
  },
];

export const developersHub: HubPage = {
  path: "/developers",
  bannerTitle: "Developers",
  description: "Build on Spectr OS — APIs, ontology, workflows, and a runtime you can run locally.",
  heroImage: "/images/products/spectr-os-ui.png",
  heroImageAlt: "Spectr OS interface",
  headline: "Start building against operational truth — not against a pile of tables.",
  columnOne:
    "Spectr OS exists so builders can put AI into applications that take real actions — on a runtime you can host. The ontology is the SDK. Workflows are how agents get tools. APIs are how the rest of your estate joins in.",
  columnTwo:
    "Request access, stand the runtime up, and customise. Documentation grows with the product. Until the full docs ship, the bootcamp is the one-video path: your data, a model, a workflow, local.",
  cardsTitle: "Build",
  cards: [
    {
      title: "Platform",
      body: "Spectr OS is API-first. REST and webhooks against the same objects operators already use.",
      href: "/platforms/spectr-os",
    },
    {
      title: "Ontology",
      body: "Anchor software in the objects of the enterprise so agents cannot freelance on a live site.",
      href: "/products/ontology",
    },
    {
      title: "Workflows",
      body: "Give models tools and guidance. Propose. Approve. Record. That is the loop.",
      href: "/products/agents",
    },
    {
      title: "SPECTR BOOTCAMP",
      body: "One video. Create your own AI, train it on your data, run it locally.",
      href: "/bootcamp",
    },
  ],
  capabilitiesTitle: "What you get",
  capabilities: [
    {
      title: "Objects, not dumps",
      body: "Integrate against units, orders, assets, and actions. Stop mapping the same CSV in every app.",
    },
    {
      title: "Human in the loop",
      body: "Automations carry history. Operators remain on the approval for anything that touches the world.",
    },
    {
      title: "Evaluate before you ship",
      body: "Workflows can be tested against the live model. Production is a promotion, not a hope.",
    },
    {
      title: "Run it here",
      body: "Develop against a local runtime. Deploy to the site that owns the data.",
    },
  ],
};

export const customersHub: HubPage = {
  path: "/customers",
  bannerTitle: "Customers",
  description: "Impact from the floor — deployments that turned insight into a shorter operational loop.",
  heroImage: "/images/industries/logistics.jpg",
  heroImageAlt: "Customer operations",
  headline: "Enterprise transformation — from insight to impact.",
  columnOne:
    "The point of the software is tangible value in a working environment: inventory that is true in the morning, a shortage closed in minutes, a line that does not wait on a weekly argument.",
  columnTwo:
    "See deployments in the language of the people who run them. Then open the industry page if you want the argument for your domain.",
  quotesTitle: "In the words of operators",
  cardsTitle: "By industry",
  cards: industryPages.map((page) => ({
    title: page.name,
    body: page.headline,
    href: page.href,
    image: page.image,
    imageAlt: page.imageAlt,
  })),
};

export const productPages = [
  {
    slug: "ontology",
    bannerTitle: "Ontology",
    listingDescription: "The central system for orchestrating decisions across people, models, and software.",
    href: "/products/ontology",
    image: "/images/products/metaphysics-ui.png",
    imageAlt: "Ontology canvas",
    headline: "A full-fidelity, dynamic representation of the business — shared by the whole organisation.",
    columnOne:
      "Spectr OS calls this the ontology: data, models, and processes as a living picture of the enterprise, on the floor. Units, locations, assets, and actions exist once. Every workflow reads that world.",
    columnTwo:
      "Chain models across teams. Simulate a change before it hits the unit. Capture the output so the next engineer inherits the last experiment. If the software does not know the object, it does not get to act.",
    capabilities: [
      { title: "Objects first", body: "Orders, beds, berths, compressors — named once, used everywhere." },
      { title: "Relationships", body: "Constraints and handoffs are data, not tribal knowledge in a shift lead’s head." },
      { title: "A language for simulation", body: "Run the change in the model. Then decide if the plant should follow." },
      { title: "Governance", body: "Who wrote the object, who approved the action. Audit is the product surface." },
    ],
  },
  {
    slug: "agents",
    bannerTitle: "Agentic runtime",
    listingDescription: "Integrate AI into operational decision-making — beyond chat, into actions that can be approved.",
    href: "/products/agents",
    image: "/images/products/aim-ui.png",
    imageAlt: "Agentic workflows",
    headline: "Go beyond chat. Enterprise autonomy with a human still in the loop.",
    columnOne:
      "Spectr OS is the argument that AI belongs in operational decision-making: agents with tools, automations with history, builders who can ship a workflow. The agentic runtime is that loop on your estate.",
    columnTwo:
      "Give the model tools and guidance. Let it propose a resolution. Let a person see the logic and approve. Iteratively evaluate before production. The chat window is optional. The action is not.",
    capabilities: [
      { title: "Tools, not essays", body: "Agents undertake real-world actions against ontology objects." },
      { title: "Proposal then approval", body: "Operators review AI-suggested resolutions. Nothing silent on a live site." },
      { title: "Workflow builder", body: "Apps, actions, and agents in one workspace — designed for people who ship." },
      { title: "Ship with evidence", body: "End-to-end evaluation so production is a promotion, not a surprise." },
    ],
  },
  {
    slug: "command",
    bannerTitle: "Command",
    listingDescription: "Ranked decisions with evidence — for operations that cannot wait on a morning report.",
    href: "/products/command",
    image: "/images/offerings/spectr-c2.jpg",
    imageAlt: "Command and decisions",
    headline: "Decision advantage is a sequence of honest choices, not a prettier common operating picture.",
    columnOne:
      "Command, on Spectr OS, is software for decision advantage: fused feeds become ranked options with provenance, so staff act on what is known and see what is not.",
    columnTwo:
      "Humans stay in command. The runtime removes the chase-down. Every consequential act is a workflow with attribution — useful tonight, and useful when someone asks why.",
    capabilities: [
      { title: "Rank the next move", body: "Not a wall of alerts. A queue of legal actions against the live model." },
      { title: "Evidence attached", body: "Why this object, why this option, which constraint forbade the others." },
      { title: "Multi-domain ops", body: "The same pattern on a DC, a plant, a terminal, or a staff cell." },
      { title: "A record", body: "Command that cannot be inspected is just speed. We ship both." },
    ],
  },
  {
    slug: "deploy",
    bannerTitle: "Deploy",
    listingDescription: "Autonomously deploy, monitor, and manage Spectr OS across cloud, on-prem, and the edge.",
    href: "/products/deploy",
    image: "/images/offerings/pilots.jpg",
    imageAlt: "Deployment on site",
    headline: "Put the runtime where the work is — and keep it current without a travelling circus.",
    columnOne:
      "Deploy, on Spectr OS, is how the runtime is stood up and managed across any environment. Factories do not pause for a region outage, and classified or sovereign estates do not send the floor to a public cloud by default.",
    columnTwo:
      "Self-host, edge, or cloud. Monitor the runtime. Push configuration, not a rebuild of the aisle. The OS should arrive as software you can operate, not as a six-month integration novel.",
    capabilities: [
      { title: "Any estate", body: "EU host, your metal, or a mix. Data residency is a setting, not a speech." },
      { title: "Edge that actually edges", body: "Local model, local objects, reconnect when you can." },
      { title: "Monitor and manage", body: "See the runtime health the way you see a line — continuously." },
      { title: "Configuration, not theatre", body: "Map the site. Cut over. Do not rebuild the warehouse to install software." },
    ],
  },
] as const;

export function getProductPage(slug: string) {
  return productPages.find((page) => page.slug === slug);
}

export function getProductSlugs() {
  return productPages.map((page) => page.slug);
}

export const customerQuotes = partnerQuotes;

export const hubPaths = [
  developersHub.path,
  customersHub.path,
  ...productPages.map((page) => page.href),
];
