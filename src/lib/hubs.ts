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
      title: "Offerings",
      body: "Manufacturing, logistics, and waste — the domains where Spectr OS runs today.",
      href: "/offerings",
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

export const customerQuotes = partnerQuotes;

export const hubPaths = [developersHub.path, customersHub.path];
