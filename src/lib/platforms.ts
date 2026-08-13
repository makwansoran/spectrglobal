export type PlatformFeature = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type PlatformIndustry = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type Platform = {
  slug: string;
  name: string;
  index: string;
  heroTagline: string;
  exploreLabel: string;
  timeLabel: string;
  valueProp: string;
  heroImage: string;
  heroImageAlt: string;
  featuresTitle: string;
  features: PlatformFeature[];
  industriesIntro: string;
  industries: PlatformIndustry[];
  ctaTitle: string;
  ctaBody: string;
};

export const platforms: Platform[] = [
  {
    slug: "spectr-os",
    name: "Spectr OS",
    index: "/0.1",
    heroTagline: "The operating system for the enterprise",
    exploreLabel: "Explore Spectr OS",
    timeLabel: "Time: 2 mins",
    valueProp: "Fuse data. Decide. Act.",
    heroImage: "/images/offerings/spectr-os.jpg",
    heroImageAlt: "Spectr OS running enterprise operations",
    featuresTitle: "Enterprise data fusion on Spectr OS",
    features: [
      {
        title: "Data Fusion",
        description: "Every system. One runtime.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Enterprise data fusion on Spectr OS",
      },
      {
        title: "Decision Making",
        description: "From signal to action.",
        image: "/images/offerings/spectr-c2.jpg",
        imageAlt: "Operational decision making",
      },
      {
        title: "Agentic Workflows",
        description: "Agents that operate.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "Agentic workflows in operations",
      },
      {
        title: "Enterprise Runtime",
        description: "Any domain. Any site.",
        image: "/spectr-detection.png",
        imageAlt: "Spectr OS across the enterprise",
      },
    ],
    industriesIntro: "One OS across every enterprise domain.",
    industries: [
      {
        name: "Logistics & Supply Chain",
        description:
          "Fuse carriers, inventory, yards, and demand into one decision runtime. Spectr OS ranks the next move across the network — not in a morning report.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Warehouse logistics and pallet operations",
      },
      {
        name: "Manufacturing",
        description:
          "Orchestrate lines, parts, labour, and quality as a live operational model. Exceptions become agentic workflows with humans still in command.",
        image: "/images/industries/manufacturing.jpg",
        imageAlt: "Manufacturing production line",
      },
      {
        name: "Energy & Industrials",
        description:
          "Turn plant signals, maintenance, and site events into governed actions. One runtime across facilities — with full audit of every decision.",
        image: "/images/industries/energy.jpg",
        imageAlt: "Power infrastructure and industrial energy",
      },
      {
        name: "Defence & Security",
        description:
          "Human-in-the-loop decisions with evidence, attribution, and European data posture. Fuse sensors, logistics, and command into executable workflows.",
        image: "/images/industries/defence.jpg",
        imageAlt: "Secure operations and systems coordination",
      },
      {
        name: "Healthcare Operations",
        description:
          "Coordinate capacity, assets, staff, and exceptions in real time. Spectr OS keeps clinical operations coherent without another dashboard silo.",
        image: "/images/industries/healthcare.jpg",
        imageAlt: "Hospital operations corridor",
      },
      {
        name: "Retail & Distribution",
        description:
          "Connect stores, DCs, and fulfilment into one OS. From shelf gap to dock door — fuse truth, decide fast, and close the loop.",
        image: "/images/industries/retail.jpg",
        imageAlt: "Retail store operations",
      },
      {
        name: "Financial Operations",
        description:
          "Agentic workflows over fused operational and financial truth. Propose, approve, and execute with a complete history of every action.",
        image: "/images/industries/financial.jpg",
        imageAlt: "Financial district and enterprise operations",
      },
      {
        name: "Government",
        description:
          "Deploy decision systems for public operations with auditability by default. Host in the EU or on your infrastructure — your data stays yours.",
        image: "/images/industries/government.jpg",
        imageAlt: "Government building and civic operations",
      },
      {
        name: "Infrastructure",
        description:
          "Monitor, decide, and act across critical physical systems. Spectr OS binds field reality to the ontology so AI never invents the world.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Infrastructure and construction site",
      },
      {
        name: "Ports & Terminals",
        description:
          "Unify yard, berth, and cargo flows into executable decisions. Spectr OS keeps every object and movement coherent.",
        image: "/images/industries/ports.jpg",
        imageAlt: "Shipping containers at a port terminal",
      },
      {
        name: "Aerospace",
        description:
          "Keep complex programmes coherent across partners, hangars, and sites. One operational truth for parts, people, and processes.",
        image: "/images/industries/aerospace.jpg",
        imageAlt: "Aircraft in flight",
      },
      {
        name: "Pharmaceuticals",
        description:
          "Trace every unit and exception through a governed runtime. From batch to bay — fusion, decision, and audit in one OS.",
        image: "/images/industries/pharma.jpg",
        imageAlt: "Pharmaceutical products and packaging",
      },
    ],
    ctaTitle: "Run your enterprise on Spectr OS",
    ctaBody: "Free for enterprise customers — permanently.",
  },
];

export function getPlatform(slug: string) {
  return platforms.find((platform) => platform.slug === slug);
}

export function getPlatformSlugs() {
  return platforms.map((platform) => platform.slug);
}
