import { loadEditorialPosts, loadHiddenSlugs } from "@/lib/editorial/store";
import { industryPages } from "@/lib/use-cases";
import { partnerQuotes } from "@/lib/content";

export type HubCard = {
  title: string;
  body: string;
  href: string;
  image?: string;
  imageAlt?: string;
};

export type HubPost = {
  slug: string;
  date: string;
  title: string;
  dek: string;
  href: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
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
  postsTitle?: string;
  posts?: HubPost[];
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

export const researchEssays: HubPost[] = [
  {
    slug: "operating-system",
    date: "April 2026",
    title: "Why an operating system, not a dashboard",
    dek: "The bottleneck is not visualisation. It is a continuously updated model of a real working environment.",
    href: "/research/operating-system",
    image: "/images/industries/warehousing.jpg",
    imageAlt: "Warehouse operations",
    paragraphs: [
      "Most industrial software still behaves like a newspaper. It tells you what happened. Operators do not need a better newspaper. They need a system that holds the current state of the work — and that can be acted on.",
      "An operating system, in this sense, is not a kernel metaphor for its own sake. It is a place where objects persist: a pallet, a berth, a compressor, a case file. Tools, agents, and people read and write the same objects. That is what makes a decision cheap enough to take on a Tuesday afternoon.",
      "Dashboards fail because they sit beside the work. Spectr OS is built to sit in the work. Fusion, ontology, and workflow are how the model stays honest as the floor changes.",
    ],
  },
  {
    slug: "ontology",
    date: "May 2026",
    title: "Ontology as operational truth",
    dek: "If the software does not know what a unit is, the model will invent the world.",
    href: "/research/ontology",
    image: "/images/products/metaphysics-ui.png",
    imageAlt: "Ontology canvas",
    paragraphs: [
      "A model that is not anchored to objects will hallucinate politely. That is fine in a chat window. It is not fine on a line, a ward, or a front.",
      "Ontology here means the things the institution already acts on, named once: locations, assets, orders, people, constraints. Relationships are first-class. When an agent proposes a move, it proposes a change to those objects — not a paragraph.",
      "The research programme is simple. Keep the representation full-fidelity and shared. Then every workflow, simulation, and approval is speaking the same language. That is how you get speed without losing inspectability.",
    ],
  },
  {
    slug: "local-ai",
    date: "June 2026",
    title: "AI that runs where the data lives",
    dek: "The institutions we serve cannot wait on a public cloud round-trip, and they should not have to give the world away to get a model.",
    href: "/research/local-ai",
    image: "/images/industries/energy.jpg",
    imageAlt: "On-site industrial systems",
    paragraphs: [
      "Latency on a plant is measured in the unit, not in the marketing site. A warehouse that goes dark because a region failed is not an AI company problem. It is an operations problem.",
      "Spectr’s bet is that the valuable model is the one trained on your logs, your exceptions, your language — and that it should run on your estate. Edge and on-prem are not a compromise. They are how you keep a truthful picture when the link is thin.",
      "Local does not mean isolated. Patterns can still compound across sites. The constraint is governance: what leaves, what stays, who approved the action. That is the research we actually do.",
    ],
  },
];

export const researchHub: HubPage = {
  path: "/research",
  bannerTitle: "Research",
  description: "Spectr Explained — how we think about operating systems, ontology, and AI that runs on the floor.",
  heroImage: "/images/industries/infrastructure.jpg",
  heroImageAlt: "Infrastructure and systems",
  headline: "Spectr Explained — the ideas the product is built on.",
  columnOne:
    "This is not a lab notebook. It is the argument we make to ourselves before we ship: why an OS, why objects, why local, why a human still signs the act.",
  columnTwo:
    "Read the essays. Then look at Spectr OS. The software should be the proof. The writing is how we keep from shipping something merely interesting.",
  postsTitle: "Essays",
  posts: researchEssays,
};

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

export const blogPosts: HubPost[] = [
  {
    slug: "spectr-os-free",
    date: "March 2026",
    title: "The operating system for the whole floor",
    dek: "Spectr OS is built so shift leads, planners, and agents work from the same live model.",
    href: "/blog/spectr-os-free",
    image: "/images/news/spectr-os-free.jpg",
    imageAlt: "Enterprise floor running on Spectr OS",
    paragraphs: [
      "Seat-based pricing is how software stays a spectator sport. The people who close exceptions never get a login. The model never sees the work. We are not doing that.",
      "Spectr OS puts the runtime that fuses the floor and holds the ontology in one place — so every shift lead can work from the same model.",
      "If you want a conversation about where it fits, talk to us. The product is already the offer.",
    ],
  },
  {
    slug: "beyond-chat",
    date: "May 2026",
    title: "Beyond chat: agents that propose real work",
    dek: "A model that cannot take an action is a search box. The interesting part is the approval.",
    href: "/blog/beyond-chat",
    image: "/images/products/aim-ui.png",
    imageAlt: "Agentic interface",
    paragraphs: [
      "Chat is a fine way to ask a question. It is a poor way to run a warehouse. The work is alerts, substitutions, berth plans, staffing, KYC queues — things that change objects.",
      "On Spectr OS, an agent reviews, proposes, and waits. A human sees the logic and the history. That is slower than a demo gif and faster than a week of email. It is also legal in places chat is not.",
      "If your AI programme is still a chatbot on the intranet, you do not have an operations problem solved. You have a new UI on the old mess.",
    ],
  },
  {
    slug: "from-insight-to-impact",
    date: "June 2026",
    title: "From insight to impact",
    dek: "Insight that does not change a workflow is a cost centre with better kerning.",
    href: "/blog/from-insight-to-impact",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Logistics operations",
    paragraphs: [
      "Enterprises are full of insight. Few of them can say what was decided, on which object, by whom, after the insight arrived. That gap is where transformation decks go to die.",
      "Impact, for us, is a shorter loop: see the shortage, rank the legal moves, take one, write it down. Minutes, not a quarterly steering group.",
      "The customer stories on this site are that loop, told from the floor. They are not a promise that software is magic. They are a record that the work got cheaper to do correctly.",
    ],
  },
];

export const blogHub: HubPage = {
  path: "/blog",
  bannerTitle: "Blog",
  description: "Writing from Spectr — the OS, agents, and why the floor comes first.",
  heroImage: "/images/careers/office.png",
  heroImageAlt: "Spectr team",
  headline: "Notes from the company building Spectr OS.",
  columnOne:
    "Short pieces on the product and the ideas behind it. Not a newsroom wire. If you want announcements, see News. If you want the argument, it is here.",
  columnTwo:
    "We write the way we build: against dashboards that do not act, against models that do not know the objects, against AI that cannot run on the site that owns the data.",
  postsTitle: "Latest",
  posts: blogPosts,
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

export const companyHub: HubPage = {
  path: "/company",
  bannerTitle: "Company",
  description: "Spectr is a Norwegian software company building Spectr OS — the operating system for the enterprise.",
  heroImage: "/images/careers/office.png",
  heroImageAlt: "Spectr",
  headline: "A Norwegian team building the operating system for the work that cannot be done remotely.",
  columnOne:
    "We were founded to put software on floors, warehouses, grids, and fronts — places where labour is scarce and the systems were designed for a slower decade. Spectr OS is the product of that conviction.",
  columnTwo:
    "The company is small on purpose. Close to operators. Unwilling to ship something merely interesting. If you want the product, get started.",
  cardsTitle: "Spectr",
  cards: [
    {
      title: "About",
      body: "Why we exist, and what we believe the bottleneck in industrial intelligence actually is.",
      href: "/about",
    },
    {
      title: "Waitlist",
      body: "Be among the first to use Spectr OS.",
      href: "/waitlist",
    },
    {
      title: "News",
      body: "What we are shipping and why.",
      href: "/news",
    },
    {
      title: "SPECTR BOOTCAMP",
      body: "Learn to create your own AI and run it locally. One video.",
      href: "/bootcamp",
    },
    {
      title: "Contact",
      body: "Customers, partners, press. Start a conversation.",
      href: "/contact",
    },
  ],
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

export async function listBlogPosts() {
  const extra = await loadEditorialPosts("blog");
  const seen = new Set(blogPosts.map((post) => post.slug));
  return [...extra.filter((post) => !seen.has(post.slug)), ...blogPosts];
}

export async function listResearchEssays() {
  const extra = await loadEditorialPosts("research");
  const hidden = new Set(await loadHiddenSlugs("research"));
  const extraBySlug = new Set(extra.map((post) => post.slug));
  return [
    ...extra.filter((post) => !hidden.has(post.slug)),
    ...researchEssays.filter((post) => !hidden.has(post.slug) && !extraBySlug.has(post.slug)),
  ];
}

export async function getBlogPost(slug: string) {
  const posts = await listBlogPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getResearchEssay(slug: string) {
  const posts = await listResearchEssays();
  return posts.find((post) => post.slug === slug);
}

export const customerQuotes = partnerQuotes;

export const hubPaths = [
  researchHub.path,
  developersHub.path,
  blogHub.path,
  customersHub.path,
  companyHub.path,
  ...productPages.map((page) => page.href),
  ...blogPosts.map((post) => post.href),
  ...researchEssays.map((post) => post.href),
];
