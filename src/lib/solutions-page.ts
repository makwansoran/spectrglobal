export type SolutionStep = {
  index: string;
  title: string;
  body: string;
};

export type SolutionHelp = {
  title: string;
  body: string;
};

export type SolutionIndustry = {
  slug: string;
  index: string;
  name: string;
  href: string;
  image: string;
  imageAlt: string;
  headline: string;
  broken: string;
  help: string;
  map: SolutionHelp[];
};

export const solutionsPage = {
  path: "/solutions",
  bannerTitle: "Solutions",
  description:
    "How Spectr helps manufacturing, logistics, and waste management: one operating loop, applied to the objects of each floor.",
  heroImage: "/images/industries/manufacturing.jpg",
  heroImageAlt: "Industrial operations on a live floor",
  headline: "We help the same way on every floor. The objects change. The loop does not.",
  columnOne:
    "Plants, warehouses, and waste networks fail in the same place. Planning lives in one system. Execution lives in another. The people who run the site reconcile the difference by hand, after the hour that mattered.",
  columnTwo:
    "Spectr OS is one runtime, shaped to the objects of each domain. We fuse what you already run, hold a live model of the work, and turn a shock into a ranked action a person can approve. The industry pages are that method applied.",
  methodTitle: "How we help",
  methodLead:
    "Four steps. They do not change when the domain changes. That is the point. Software that reinvents itself for every floor never becomes an operating system.",
  loop: [
    { index: "01", title: "See" },
    { index: "02", title: "Name" },
    { index: "03", title: "Rank" },
    { index: "04", title: "Act" },
  ],
  steps: [
    {
      index: "01",
      title: "See the site as it is",
      body: "Fuse ERP, WMS, sensors, routes, and the shift into one live picture. We sit on the systems you already paid for. The work is not another integration novel. It is one model that stays current.",
    },
    {
      index: "02",
      title: "Name the objects once",
      body: "A work order, a pallet, a bin, a vehicle, a material stream. People, models, and software read the same world. If the runtime does not know the object, it does not get to act.",
    },
    {
      index: "03",
      title: "Rank the next legal move",
      body: "When a supplier slips or a lane fails, the runtime proposes what can be done now: substitute, resequence, hold, divert. Cost, constraint, and evidence sit on the same action.",
    },
    {
      index: "04",
      title: "Act with a person on the approval",
      body: "An operator reviews the proposal. The decision is written back to the object. The next shift inherits the truth, not a rumour from the morning meeting.",
    },
  ] satisfies SolutionStep[],
  industriesTitle: "The method on three floors",
  industriesLead:
    "Each offering is the same loop. What changes is what the institution already acts on. Open an industry when you want the argument for your domain.",
  industries: [
    {
      slug: "manufacturing",
      index: "01",
      name: "Manufacturing",
      href: "/use-cases/manufacturing",
      image: "/images/industries/manufacturing.jpg",
      imageAlt: "Manufacturing production line",
      headline: "Strategy, materials, and the line as one model.",
      broken:
        "Plants do not fail for lack of dashboards. They fail when planning, materials, quality, and the line live in different truths. A shock on Tuesday afternoon becomes a week of reconciliation.",
      help: "Spectr OS binds orders, labour, machines, bills of material, and deviations into one live plant. The measure is how fast the floor can adapt to the plant it actually has.",
      map: [
        {
          title: "See",
          body: "MES, ERP, quality, and the crew share one picture of the hour on the line, not last night’s schedule.",
        },
        {
          title: "Name",
          body: "Work orders, stations, parts, and deviations exist once. Downstream tools read the objects the supervisor already uses.",
        },
        {
          title: "Rank",
          body: "A slip or a stop re-ranks substitute, expedite, and resequence against cost and constraint.",
        },
        {
          title: "Act",
          body: "A person approves the move. The unit record updates. The digital thread stays cheap to follow when it frays.",
        },
      ],
    },
    {
      slug: "logistics",
      index: "02",
      name: "Logistics",
      href: "/use-cases/logistics",
      image: "/images/industries/logistics.jpg",
      imageAlt: "Warehouse logistics and pallet operations",
      headline: "Planning and execution without the seam between them.",
      broken:
        "Critical networks still run on siloed plans and delayed execution. Inventory is a guess by the time it matters. A disruption waits for the next S&OP cycle instead of being closed at the dock.",
      help: "Spectr OS sits on WMS, TMS, yard, and demand and turns them into one operational picture. Resilience is a ranked choice against value at risk, not a control tower slide.",
      map: [
        {
          title: "See",
          body: "Sales, stock, labour, carriers, and outbound work share one model of the network as it stands this hour.",
        },
        {
          title: "Name",
          body: "Orders, SKUs, locations, and moves are first-class. Allocation is a decision on those objects, not a guess from averages.",
        },
        {
          title: "Rank",
          body: "A failed lane or a shortage proposes buffer, substitute, reroute, or re-source with revenue in view.",
        },
        {
          title: "Act",
          body: "A planner approves the next legal plan. The record is useful tonight, and useful when someone asks why.",
        },
      ],
    },
    {
      slug: "waste-management",
      index: "03",
      name: "Waste Management",
      href: "/use-cases/waste-management",
      image: "/images/industries/waste-management.jpg",
      imageAlt: "Collection and materials recovery operations",
      headline: "From the bin to the plant, one loop.",
      broken:
        "Waste is a chain of handoffs that still lives in separate systems: collection, transfer, sorting, treatment, and the market for what comes out. A missed street is a complaint the next morning.",
      help: "Spectr OS treats the lift, the vehicle, the bay, and the material stream as the same operational story. Coherence from kerb to residue, at the speed of the round.",
      map: [
        {
          title: "See",
          body: "Bins, fills, vehicles, and crews update as the round runs. The plant sees inbound composition instead of a rumour.",
        },
        {
          title: "Name",
          body: "Stops, loads, bays, residue, and offtake contracts accumulate on the same objects, from lift to bale.",
        },
        {
          title: "Rank",
          body: "A blocked street or a contaminated load re-ranks resequence, hold, or divert against the contract and the permit.",
        },
        {
          title: "Act",
          body: "A dispatcher or plant lead approves the sequence. The runtime does not drive the truck. It makes the options honest.",
        },
      ],
    },
  ] satisfies SolutionIndustry[],
  outcomesTitle: "What you get in every domain",
  outcomes: [
    {
      title: "One model of the work",
      body: "Lines, docks, rounds, and the objects on them exist once. Agents and people work the same graph. Downstream tools stop inventing a second world.",
    },
    {
      title: "Shock as a workflow",
      body: "A slip is a ranked set of legal moves with evidence attached, not a wall of alerts and a morning meeting.",
    },
    {
      title: "People stay in command",
      body: "Proposed changes carry history and an approval. The system does not invent the floor, the yard, or the round.",
    },
    {
      title: "From site to fleet",
      body: "Patterns that only appear across plants or depots can flow back to the edge, without taking the site down for a cloud round-trip.",
    },
  ] satisfies SolutionHelp[],
  softwareTitle: "The software behind the method",
  software: [
    {
      title: "Spectr OS",
      body: "The operating system that holds the model and the action. Fuse, decide, and act in one runtime.",
      href: "/platforms/spectr-os",
    },
    {
      title: "Spectr Edge",
      body: "Vision and sensing on the floor, computed next to the work, then handed to the same objects.",
      href: "/platforms/spectr-edge",
    },
  ],
  ctaTitle: "Get started with Spectr OS",
  ctaBody: "Map the work in days, not a transformation programme.",
} as const;
