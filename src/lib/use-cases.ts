export type UseCaseFocus = {
  id: string;
  label: string;
  statement: string;
  focus: string;
  change: string;
  image: string;
  imageAlt: string;
};

export type IndustryCard = {
  title: string;
  body: string;
};

export type IndustryPage = {
  slug: string;
  index: string;
  name: string;
  listingDescription: string;
  href: string;
  image: string;
  imageAlt: string;
  bannerTitle: string;
  headline: string;
  tagline: string;
  systemTitle: string;
  systemBody: string;
  systemVideo: string;
  overviewEyebrow: string;
  overviewTitle: string;
  overviewAccent: string;
  overviewCallout: string;
  pillars: IndustryCard[];
  objectsEyebrow: string;
  objects: string[];
  objectsImage: string;
  objectsImageAlt: string;
  scaleEyebrow: string;
  scaleTitle: string;
  scaleAccent: string;
  scale: IndustryCard[];
  ctaTitle: string;
  ctaImage: string;
};

export const industryPages: IndustryPage[] = [
  {
    slug: "manufacturing",
    index: "/0.1",
    name: "Manufacturing",
    listingDescription: "An operating system for the line: strategy, materials, and the shop floor as one model.",
    href: "/use-cases/manufacturing",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Manufacturing production line",
    bannerTitle: "Manufacturing",
    headline: "Strategy, materials, and the line as one model.",
    tagline: "The central system for orchestrating decisions across the line, the materials, and the people who run them.",
    systemTitle: "The manufacturing system",
    systemBody:
      "Spectr OS encodes the data, logic, action, and security of the plant so a shock on Tuesday afternoon is a ranked move, not a week of reconciliation.",
    systemVideo: "/videos/spectr-os-command.mp4",
    overviewEyebrow: "Overview",
    overviewTitle: "Power",
    overviewAccent: "the plant you have.",
    overviewCallout: "Spectr OS",
    pillars: [
      {
        title: "Encode the data of the plant.",
        body: "Unify MES, ERP, quality, labour, and the hour on the line into one live picture. The plan is only as good as the last station that reported.",
      },
      {
        title: "Capture the logic of the line.",
        body: "Bills of material, constraints, and substitution rules sit in the runtime. When a part slips, the next legal move is already ranked.",
      },
      {
        title: "Model the actions of the floor.",
        body: "Resequence, expedite, hold, and release are first-class. A proposed change writes back to the work order, not to a slide.",
      },
      {
        title: "Govern people and agents on site.",
        body: "Operators review AI-suggested resolutions. Nothing silent on a live line. The record is useful tonight, and useful when someone asks why.",
      },
    ],
    objectsEyebrow: "Objects",
    objects: ["ORDERS", "STATIONS", "BOMS", "DEVIATIONS", "CREWS", "MACHINES", "UNITS", "QUALITY"],
    objectsImage: "/images/industries/parts.jpg",
    objectsImageAlt: "Industrial parts and materials",
    scaleEyebrow: "Runtime",
    scaleTitle: "Orchestrate the factory",
    scaleAccent: "at the speed of the line.",
    scale: [
      {
        title: "One model of the plant.",
        body: "Lines, stations, crews, and work orders exist once. Downstream tools read the same objects the supervisor already uses.",
      },
      {
        title: "Shock as a workflow.",
        body: "When a supplier slips or a machine stops, the runtime re-ranks substitute, expedite, and resequence against cost and constraint.",
      },
      {
        title: "From site to fleet.",
        body: "Patterns that only appear across plants can flow back to the edge, without taking the line down for a cloud round-trip.",
      },
    ],
    ctaTitle: "Run the plant on Spectr OS",
    ctaImage: "/images/industries/manufacturing.jpg",
  },
  {
    slug: "logistics",
    index: "/0.2",
    name: "Logistics",
    listingDescription: "Planning and execution in one runtime. Inventory, yards, and disruption handled as they happen.",
    href: "/use-cases/logistics",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Warehouse logistics and pallet operations",
    bannerTitle: "Logistics",
    headline: "Planning and execution without the seam between them.",
    tagline: "The central system for orchestrating decisions across inventory, yards, carriers, and the network.",
    systemTitle: "The logistics system",
    systemBody:
      "Spectr OS sits on WMS, TMS, yard, and demand and turns them into one operational picture, so a disruption is closed at the dock, not in the next S&OP cycle.",
    systemVideo: "/videos/spectr-os-data-fusion.mp4",
    overviewEyebrow: "Overview",
    overviewTitle: "Power",
    overviewAccent: "the network you have.",
    overviewCallout: "Spectr OS",
    pillars: [
      {
        title: "Encode the data of the network.",
        body: "Sales, stock, labour, carriers, and outbound work share one model of the hour. The plan that cannot see the yard is already late.",
      },
      {
        title: "Capture the logic of allocation.",
        body: "Location, condition, and cost accumulate on the same SKU. Allocation is a decision on those objects, not a guess from averages.",
      },
      {
        title: "Model the actions of the dock.",
        body: "Buffer, substitute, reroute, and re-source are first-class. A failed lane proposes the next legal plan with revenue in view.",
      },
      {
        title: "Govern planners and agents together.",
        body: "A person approves the move. Partners see the objects that matter, not a dump of every table you own.",
      },
    ],
    objectsEyebrow: "Objects",
    objects: ["ORDERS", "SKUS", "LOCATIONS", "MOVES", "LANES", "CARRIERS", "YARDS", "BUFFERS"],
    objectsImage: "/images/industries/warehousing.jpg",
    objectsImageAlt: "Warehouse aisles and inventory",
    scaleEyebrow: "Runtime",
    scaleTitle: "Orchestrate the chain",
    scaleAccent: "without the morning report.",
    scale: [
      {
        title: "End-to-end objects.",
        body: "Orders, SKUs, locations, and moves are first-class. Agents and people work the same graph.",
      },
      {
        title: "Disruption as a workflow.",
        body: "When a lane fails, the runtime proposes the next legal plan and records who approved it.",
      },
      {
        title: "Cost at the item.",
        body: "Warehouse, labour, and freight can be attributed down to the unit so pricing and contracting are not averages.",
      },
    ],
    ctaTitle: "Run the network on Spectr OS",
    ctaImage: "/images/industries/logistics.jpg",
  },
  {
    slug: "waste-management",
    index: "/0.3",
    name: "Waste Management",
    listingDescription: "Collection, plants, and materials as one loop, so a lift is an operational decision.",
    href: "/use-cases/waste-management",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Collection and materials recovery operations",
    bannerTitle: "Waste Management",
    headline: "From the bin to the plant, one loop.",
    tagline: "The central system for orchestrating decisions from collection to offtake, at the speed of the round.",
    systemTitle: "The waste system",
    systemBody:
      "Spectr OS treats the lift, the vehicle, the bay, and the material stream as the same operational story. A missed street is a decision, not a complaint the next morning.",
    systemVideo: "/videos/spectr-os-ontology.mp4",
    overviewEyebrow: "Overview",
    overviewTitle: "Power",
    overviewAccent: "the loop you have.",
    overviewCallout: "Spectr OS",
    pillars: [
      {
        title: "Encode the data of the round.",
        body: "Bins, fills, vehicles, and crews update as the work runs. The plant sees inbound composition instead of a rumour.",
      },
      {
        title: "Capture the logic of the contract.",
        body: "Contamination, grade, permits, and offtake sit on the same objects, from lift to bale.",
      },
      {
        title: "Model the actions of the loop.",
        body: "Resequence, hold, and divert are first-class. A blocked street or a contaminated load re-ranks the next legal sequence.",
      },
      {
        title: "Govern dispatch and the plant together.",
        body: "A dispatcher or plant lead approves the sequence. The runtime does not drive the truck. It makes the options honest.",
      },
    ],
    objectsEyebrow: "Objects",
    objects: ["BINS", "LIFTS", "VEHICLES", "CREWS", "BAYS", "STREAMS", "CONTRACTS", "RESIDUE"],
    objectsImage: "/images/industries/energy.jpg",
    objectsImageAlt: "Treatment plant and industrial processing",
    scaleEyebrow: "Runtime",
    scaleTitle: "Orchestrate the loop",
    scaleAccent: "from kerb to residue.",
    scale: [
      {
        title: "A living round.",
        body: "Stops, fills, and vehicle work update as objects, not as a printed sheet. The next street is ranked against the current world.",
      },
      {
        title: "Handoffs with evidence.",
        body: "Each transfer carries who, when, and what was in the load. Useful for the plant, the contract, and the night shift.",
      },
      {
        title: "Network, not a depot silo.",
        body: "What happens on one round can inform the plant and the next depot without a new integration for each site.",
      },
    ],
    ctaTitle: "Run the loop on Spectr OS",
    ctaImage: "/images/industries/waste-management.jpg",
  },
];

export function getIndustryPage(slug: string) {
  return industryPages.find((page) => page.slug === slug);
}

export function getIndustrySlugs() {
  return industryPages.map((page) => page.slug);
}

export const industryListings = industryPages.map((page) => ({
  id: page.slug,
  index: page.index,
  name: page.name,
  description: page.listingDescription,
  cta: `${page.name} operations`,
  href: page.href,
  image: page.image,
  imageAlt: page.imageAlt,
}));
