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
    industriesIntro: "One OS across manufacturing, logistics, energy, and waste management.",
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
        name: "Waste Management",
        description:
          "Collection, plants, and materials in one loop. Spectr OS turns a lift into an operational decision — from kerb to offtake.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Collection and materials recovery operations",
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
