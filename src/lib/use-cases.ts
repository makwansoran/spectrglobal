export type UseCaseFocus = {
  id: string;
  label: string;
  statement: string;
  focus: string;
  change: string;
  image: string;
  imageAlt: string;
};

export type UseCaseCapability = {
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
  columnOne: string;
  columnTwo: string;
  focuses: UseCaseFocus[];
  capabilities: UseCaseCapability[];
};

export const industryPages: IndustryPage[] = [
  {
    slug: "manufacturing",
    index: "/0.1",
    name: "Manufacturing",
    listingDescription: "An operating system for the line — strategy, materials, and the shop floor as one model.",
    href: "/use-cases/manufacturing",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Manufacturing production line",
    bannerTitle: "Spectr for Manufacturing",
    headline: "An operating system that flexes with the factory — not a system the factory has to flex around.",
    columnOne:
      "Plants do not fail for lack of dashboards. They fail when planning, materials, quality, and the line live in different truths. Spectr OS binds those objects into one live model so a shock on Tuesday afternoon is something the floor can answer, not a week of reconciliation.",
    columnTwo:
      "Connect strategy to operations. Follow the digital thread when it frays. Replan materials against what is actually in the bay. The work is to measure how fast you can adapt to reality — and to make that loop shorter every shift.",
    focuses: [
      {
        id: "line",
        label: "Connecting strategy with the line",
        statement: "The plan is only as good as the last hour on the floor.",
        focus: "Live production",
        change: "Orders, labour, machines, and exceptions sit in one runtime so supervisors act on the line they have — not last night’s schedule.",
        image: "/images/industries/manufacturing.jpg",
        imageAlt: "Manufacturing production line",
      },
      {
        id: "materials",
        label: "Material resource planning",
        statement: "Shortage is a decision problem, not a spreadsheet problem.",
        focus: "Parts and inventory",
        change: "Bills of material, receipts, and work orders stay coherent, so substitution and expedite happen with the cost in view.",
        image: "/images/industries/parts.jpg",
        imageAlt: "Industrial parts and materials",
      },
      {
        id: "thread",
        label: "The digital thread",
        statement: "Every fray in the thread should be cheap to find and faster to close.",
        focus: "Quality and traceability",
        change: "From drawing to unit, deviations are objects you can correct in the workflow — not a hunt across systems after the fact.",
        image: "/images/industries/spare-parts.jpg",
        imageAlt: "Spare parts and production records",
      },
    ],
    capabilities: [
      {
        title: "One model of the plant",
        body: "Lines, stations, crews, and work orders exist once. Downstream tools read the same objects the operator already uses.",
      },
      {
        title: "Shock response",
        body: "When a supplier slips or a machine stops, the runtime re-ranks the next legal moves instead of waiting for a morning meeting.",
      },
      {
        title: "Governed action",
        body: "Proposed changes carry evidence and an audit trail. People stay in command; the system does not invent the floor.",
      },
      {
        title: "From site to fleet",
        body: "Patterns that only appear across plants can flow back to the edge — without taking the line down for a cloud round-trip.",
      },
    ],
  },
  {
    slug: "logistics",
    index: "/0.2",
    name: "Logistics",
    listingDescription: "Planning and execution in one runtime — inventory, yards, and disruption handled as they happen.",
    href: "/use-cases/logistics",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Warehouse logistics and pallet operations",
    bannerTitle: "Spectr for Logistics",
    headline: "Strategy, planning, and execution across the chain — without the seam that usually sits between them.",
    columnOne:
      "Critical networks still run on siloed plans and delayed execution. Spectr OS sits on the systems you already paid for and turns inventory, labour, carriers, and demand into one operational picture — so a disruption is resolved in the same place it is seen.",
    columnTwo:
      "Build resilience for economic and geopolitical noise by ranking shortages, reroutes, and buffers against value at risk. The aim is not another control tower slide. It is a shorter loop from signal to the dock.",
    focuses: [
      {
        id: "plan-execute",
        label: "Close planning and execution",
        statement: "The plan that cannot see the yard is already late.",
        focus: "Network operations",
        change: "Sales, inventory, and outbound work share one model, so exceptions resolve in near real time instead of in the next S&OP cycle.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Warehouse logistics and pallet operations",
      },
      {
        id: "inventory",
        label: "Inventory that tells the truth",
        statement: "You cannot protect margin on a position you cannot trust.",
        focus: "Stock and cost",
        change: "Location, condition, and cost accumulate on the same objects, from inbound to pick — so allocation is a decision, not a guess.",
        image: "/images/industries/warehousing.jpg",
        imageAlt: "Warehouse aisles and inventory",
      },
      {
        id: "risk",
        label: "Supply risk, ranked",
        statement: "Every shortage has a price. Most teams cannot see it in time.",
        focus: "Resilience",
        change: "Purchase orders, bills of material, and downstream demand sit together so mitigation — buffer, substitute, or re-source — is chosen with revenue in view.",
        image: "/images/industries/3pl.jpg",
        imageAlt: "Third-party logistics operations",
      },
    ],
    capabilities: [
      {
        title: "End-to-end objects",
        body: "Orders, SKUs, locations, and moves are first-class. Agents and people work the same graph.",
      },
      {
        title: "Disruption as a workflow",
        body: "When a lane fails, the runtime proposes the next legal plan and records who approved it.",
      },
      {
        title: "Cost at the item",
        body: "Warehouse, labour, and freight can be attributed down to the unit so pricing and contracting are not averages.",
      },
      {
        title: "Partner visibility without a data lake project",
        body: "Share the objects that matter with 3PLs and sites — not a dump of every table you own.",
      },
    ],
  },
  {
    slug: "waste-management",
    index: "/0.3",
    name: "Waste Management",
    listingDescription:
      "Collection, plants, and materials as one loop — so a lift is an operational decision, not a route afterthought.",
    href: "/use-cases/waste-management",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Collection and materials recovery operations",
    bannerTitle: "Spectr for Waste Management",
    headline: "From the bin to the plant — one runtime for a loop that still lives in separate systems.",
    columnOne:
      "Waste is a chain of handoffs: collection, transfer, sorting, treatment, and the market for what comes out the other side. Spectr OS treats the lift, the vehicle, the bay, and the material stream as the same operational story, so a missed street is a decision — not a complaint the next morning.",
    columnTwo:
      "Re-sequence rounds against what actually filled. Keep plants honest about inbound composition. Rank contamination, downtime, and offtake against the contract, not a weekly average. The work is coherence from kerb to residue, at the speed of the round.",
    focuses: [
      {
        id: "collect",
        label: "Collection that can replan",
        statement: "A round that cannot see the fill is already late.",
        focus: "Routes and lifts",
        change: "Bins, vehicles, and crews share one model so exceptions — a blocked street, a missed lift, a spill — become a sequence, not a radio pile-up.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Collection and route operations",
      },
      {
        id: "plant",
        label: "The plant as it is",
        statement: "Throughput is a decision problem when inbound is a rumour.",
        focus: "Treatment and recovery",
        change: "Bays, lines, and residue sit with the inbound picture, so substitution, hold, or divert happens with cost and permit in view.",
        image: "/images/industries/energy.jpg",
        imageAlt: "Treatment plant and industrial processing",
      },
      {
        id: "material",
        label: "Materials that tell the truth",
        statement: "You cannot sell a stream you cannot trust.",
        focus: "Quality and offtake",
        change: "Contamination, grade, and contracts accumulate on the same objects — from lift to bale — so offtake is a decision, not a guess.",
        image: "/images/industries/3pl.jpg",
        imageAlt: "Materials handling and recovery",
      },
    ],
    capabilities: [
      {
        title: "A living round",
        body: "Stops, fills, and vehicle work update as objects, not as a printed sheet. The next street is always ranked against the current world.",
      },
      {
        title: "Handoffs with evidence",
        body: "Each transfer carries who, when, and what was in the load — useful for the plant, the contract, and the night shift.",
      },
      {
        title: "Network, not a depot silo",
        body: "What happens on one round can inform the plant and the next depot without a new integration for each site.",
      },
      {
        title: "People still in command",
        body: "Proposed sequences are workflows with approval. The runtime does not drive the truck. It makes the options honest.",
      },
    ],
  },
];

export function getIndustryPage(slug: string) {
  return industryPages.find((page) => page.slug === slug);
}

export function getIndustrySlugs() {
  return industryPages.map((page) => page.slug);
}

const removedUseCaseSlugs = new Set([
  "defense",
  "government",
  "healthcare",
  "finance",
  "shipping",
  "mining",
  "operations",
  "energy",
]);

export const industryListings = industryPages
  .filter((page) => !removedUseCaseSlugs.has(page.slug))
  .map((page) => ({
  id: page.slug,
  index: page.index,
  name: page.name,
  description: page.listingDescription,
  cta: `${page.name} operations`,
  href: page.href,
  image: page.image,
  imageAlt: page.imageAlt,
}));
