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
    industriesIntro: "One OS across manufacturing, logistics, and waste management.",
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
  {
    slug: "spectr-edge",
    name: "Spectr Edge",
    index: "/0.2",
    heroTagline: "On-site compute for AI vision",
    exploreLabel: "Explore Spectr Edge",
    timeLabel: "Time: 2 mins",
    valueProp: "Run vision models on the floor — without sending the site to the cloud.",
    heroImage: "/images/products/spectr-edge.jpg",
    heroImageAlt: "Spectr Edge compute enclosure",
    featuresTitle: "Edge compute for operational AI",
    features: [
      {
        title: "On-site inference",
        description: "Vision and sensing where the work happens.",
        image: "/images/products/spectr-edge.jpg",
        imageAlt: "Spectr Edge compute on site",
      },
      {
        title: "Lower hosting cost",
        description: "A fraction of the cost of hosting large models remotely.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Local inference instead of remote hosting",
      },
      {
        title: "Works with Spectr OS",
        description: "Fuse edge detections into the same operational world.",
        image: "/images/products/spectr-os-ui.png",
        imageAlt: "Spectr OS receiving edge detections",
      },
      {
        title: "Sovereign by default",
        description: "Keep video and models on your machines.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "On-prem operations with local compute",
      },
    ],
    industriesIntro: "Edge compute for manufacturing, logistics, and waste management.",
    industries: [
      {
        name: "Logistics & Supply Chain",
        description:
          "Yard, dock, and warehouse vision without a round trip to a public cloud. Spectr Edge scores what is on the floor and hands it to Spectr OS.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Warehouse logistics and pallet operations",
      },
      {
        name: "Manufacturing",
        description:
          "Line-side vision for quality, presence, and exceptions — computed next to the station, not in another region.",
        image: "/images/industries/manufacturing.jpg",
        imageAlt: "Manufacturing production line",
      },
      {
        name: "Waste Management",
        description:
          "Identify materials and loads at the kerb and the plant. Spectr Edge keeps inference local; Spectr OS turns it into the next action.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Collection and materials recovery operations",
      },
    ],
    ctaTitle: "Run AI vision on site with Spectr Edge",
    ctaBody: "Join the waitlist to be among the first to deploy Spectr Edge.",
  },
];

export function getPlatform(slug: string) {
  return platforms.find((platform) => platform.slug === slug);
}

export function getPlatformSlugs() {
  return platforms.map((platform) => platform.slug);
}
