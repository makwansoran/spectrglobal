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
    slug: "shipping",
    index: "/0.3",
    name: "Shipping",
    listingDescription: "Fleet, cargo, berth, and route as one picture — so a vessel move is an operational decision.",
    href: "/use-cases/shipping",
    image: "/images/industries/ports.jpg",
    imageAlt: "Shipping containers at a port terminal",
    bannerTitle: "Spectr for Shipping",
    headline: "Cargo, vessels, and terminals in one runtime — from the berth plan to the last mile on land.",
    columnOne:
      "Shipping is a chain of handoffs that still live in separate systems: fleet, terminal, customs, inland. Spectr OS treats the container, the vessel, the slot, and the truck as the same operational story, so a delay is visible as a decision — not a status email.",
    columnTwo:
      "Track movements as they happen. Re-sequence yards and berths against what actually arrived. Keep partners on a shared picture without waiting for a daily report. The work is coherence across water and land, at the speed of the terminal.",
    focuses: [
      {
        id: "cargo",
        label: "Cargo that can be found",
        statement: "If the box is a rumour, the schedule is a hope.",
        focus: "Shipments and containers",
        change: "Bookings, units, and milestones update in one model so operations can replan while the vessel is still moving.",
        image: "/images/industries/ports.jpg",
        imageAlt: "Shipping containers at a port terminal",
      },
      {
        id: "terminal",
        label: "Berth, yard, gate",
        statement: "The terminal only works when every object agrees on where it is.",
        focus: "Ports and terminals",
        change: "Yard positions, crane work, and gate moves sit with the vessel plan, so exceptions become a sequence — not a radio pile-up.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Port and infrastructure operations",
      },
      {
        id: "fleet",
        label: "Fleet and inland",
        statement: "The sea leg is wasted if the land leg cannot take the cargo.",
        focus: "Routes and assets",
        change: "Telematics, schedules, and inland capacity feed the same runtime, so reroutes are chosen with dwell and cost in view.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Inland logistics connecting to shipping",
      },
    ],
    capabilities: [
      {
        title: "A living schedule",
        body: "ETA, berth, and yard work update as objects, not as slides. The next move is always ranked against the current world.",
      },
      {
        title: "Handoffs with evidence",
        body: "Each transfer carries who, when, and why — useful for partners, customs, and your own night shift.",
      },
      {
        title: "Network, not a port silo",
        body: "What happens at one terminal can inform the next port of call without rebuilding a new integration for each site.",
      },
      {
        title: "People still in command",
        body: "Proposed sequences are workflows with approval. The runtime does not sail the ship. It makes the options honest.",
      },
    ],
  },
  {
    slug: "energy",
    index: "/0.4",
    name: "Energy",
    listingDescription: "Assets, production, and markets in one model — so a plant decision is simulated before it is made.",
    href: "/use-cases/energy",
    image: "/images/industries/energy.jpg",
    imageAlt: "Power infrastructure and industrial energy",
    bannerTitle: "Spectr for Energy",
    headline: "Solve today’s plant while compounding advantage across the value chain.",
    columnOne:
      "Energy work spans wells, plants, grids, and markets — with models that usually cannot talk to the people who run the asset. Spectr OS turns data, simulations, and procedures into a shared representation of the facility so engineers and operators use the same language.",
    columnTwo:
      "See performance at the component, not in a monthly pack. Chain models to test a change before it hits the unit. Capture every simulation so the next decision is better than the last. Immediate results, then compounding value as the model learns the site.",
    focuses: [
      {
        id: "asset",
        label: "Operate the asset as it is",
        statement: "A plant is not a dashboard. It is a set of objects under physics and a permit.",
        focus: "Operations management",
        change: "Sensors, work orders, and constraints live together so allocation and maintenance are decisions on the real unit.",
        image: "/images/industries/energy.jpg",
        imageAlt: "Power infrastructure and industrial energy",
      },
      {
        id: "simulate",
        label: "Simulate before you touch it",
        statement: "Raise suction on a compressor in software first — then decide if the plant should follow.",
        focus: "Engineering",
        change: "Multiple models and site logic sit behind one view of the facility. Outputs are stored so tomorrow’s engineer inherits today’s experiment.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Energy infrastructure and facilities",
      },
      {
        id: "market",
        label: "Demand that will not wait",
        statement: "Volatile markets punish slow extraction of the truth.",
        focus: "Planning and markets",
        change: "Disparate datasets become a decision support picture — consistent enough to respond when the market moves, not after it has moved.",
        image: "/images/industries/financial.jpg",
        imageAlt: "Energy markets and enterprise operations",
      },
    ],
    capabilities: [
      {
        title: "A dynamic plant model",
        body: "Digital assets — data, models, processes — become something operators can act on, not a data-science side project.",
      },
      {
        title: "Granular performance",
        body: "Near real-time views of equipment without a manual integration project every time a historian changes.",
      },
      {
        title: "From hydrocarbons to renewables",
        body: "The same runtime pattern applies to a compressor train or a solar fleet: reduce downtime, keep production honest.",
      },
      {
        title: "Governed AI on the site",
        body: "Recommendations are tied to objects and audit. The model does not get to freelance on a live plant.",
      },
    ],
  },
  {
    slug: "defense",
    index: "/0.5",
    name: "Defense",
    listingDescription: "Decision advantage at the edge — intelligence, logistics, and command in one governed runtime.",
    href: "/use-cases/defense",
    image: "/images/industries/defence.jpg",
    imageAlt: "Secure operations and systems coordination",
    bannerTitle: "Spectr for Defense",
    headline: "Software that confers advantage — from the tactical edge to the headquarters that must stay honest.",
    columnOne:
      "Defense problems are not dashboard problems. They are multi-domain, time-compressed, and intolerant of a system that only works on a good network. Spectr OS is built for decision-making with evidence: sensors, logistics, and command as objects a human can still overrule.",
    columnTwo:
      "Engineer from the edge inward. Support distributed operations when the link is thin. Configure the runtime to the service and the mission — not a generic war room. The point is deterrence and endurance: better decisions, with a record of why they were taken.",
    focuses: [
      {
        id: "decide",
        label: "Decision-making under pressure",
        statement: "Dominance is a sequence of honest choices, not a prettier common operating picture.",
        focus: "Command",
        change: "Fused feeds become ranked options with provenance, so staff act on what is known — and see what is not.",
        image: "/images/industries/defence.jpg",
        imageAlt: "Secure operations and systems coordination",
      },
      {
        id: "edge",
        label: "The tactical edge",
        statement: "If the software only works in the rear, it is not operational software.",
        focus: "Distributed operations",
        change: "Local runtime, local models, reconnect when you can. The site keeps a truthful picture without waiting on a distant cloud.",
        image: "/images/industries/aerospace.jpg",
        imageAlt: "Air and space operations",
      },
      {
        id: "readiness",
        label: "Readiness as an object",
        statement: "People, platforms, and parts are one problem — treated as three, they become a surprise.",
        focus: "Force and sustainment",
        change: "Asset, personnel, and supply sit in the same model so a mission is planned against what can actually move.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Defense logistics and infrastructure",
      },
    ],
    capabilities: [
      {
        title: "Human in the loop",
        body: "Every consequential action is a workflow with attribution. Spectr does not replace command. It makes command faster and inspectable.",
      },
      {
        title: "Configurable to the service",
        body: "Land, air, sea, and joint staffs need different objects. The runtime is shaped to the mission, not the other way around.",
      },
      {
        title: "Secure by posture",
        body: "Deploy on your infrastructure, in allied environments, with data that stays yours. European hosting is a default we take seriously.",
      },
      {
        title: "Logistics is the fight",
        body: "The same OS that fuses intelligence can move parts and fuel. Sustainment is not a back-office afterthought.",
      },
    ],
  },
  {
    slug: "government",
    index: "/0.6",
    name: "Government",
    listingDescription: "Public operations with audit by default — finance, services, and cross-agency work in one governed system.",
    href: "/use-cases/government",
    image: "/images/industries/government.jpg",
    imageAlt: "Government building and civic operations",
    bannerTitle: "Spectr for Government",
    headline: "Public institutions that must be inspectable — and still fast enough to serve.",
    columnOne:
      "Government is asked to move like an enterprise while remaining more accountable than one. Spectr OS is for that tension: fuse the ledgers, case files, and operational systems you already run, and put decisions in workflows that auditors, ministers, and operators can all read.",
    columnTwo:
      "Financial management, procurement, and service delivery stop being separate programmes. Cross-agency work shares objects without a lowest-common-denominator data lake. Host in the EU or on sovereign infrastructure. The data stays the state’s.",
    focuses: [
      {
        id: "finance",
        label: "Public financial management",
        statement: "A budget is a plan until spend, commitment, and delivery disagree.",
        focus: "Money and mandate",
        change: "Appropriations, contracts, and outcomes sit together so officials see what was promised against what was done — in time to correct course.",
        image: "/images/industries/government.jpg",
        imageAlt: "Government building and civic operations",
      },
      {
        id: "services",
        label: "Services as operations",
        statement: "Citizens experience handoffs. Institutions experience systems.",
        focus: "Delivery",
        change: "Cases, eligibility, and capacity become one runtime so a delay is an operational object, not a call-centre mystery.",
        image: "/images/industries/healthcare.jpg",
        imageAlt: "Public service operations",
      },
      {
        id: "procurement",
        label: "Procurement you can defend",
        statement: "Buying is easy. Buying that survives scrutiny is the work.",
        focus: "Contracts and suppliers",
        change: "Need, tender, award, and performance share a trail. Exceptions are explicit, not buried in email.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Public infrastructure and procurement",
      },
    ],
    capabilities: [
      {
        title: "Audit by construction",
        body: "Who decided, on what evidence, under which rule. That is the product, not a report written afterwards.",
      },
      {
        title: "Sovereign deployment",
        body: "Run on your estate. Keep residency and access where policy requires them. We do not need the data to leave.",
      },
      {
        title: "Agencies without a mash-up",
        body: "Share the objects that must be shared. Keep the rest. Coordination does not require a single megadatabase.",
      },
      {
        title: "Speed that still looks like government",
        body: "Workflows can be fast without being informal. Approvals remain visible. That is how trust is kept.",
      },
    ],
  },
  {
    slug: "healthcare",
    index: "/0.7",
    name: "Healthcare",
    listingDescription: "An operating system for the hospital — capacity, staffing, and the bedside in one runtime.",
    href: "/use-cases/healthcare",
    image: "/images/industries/healthcare.jpg",
    imageAlt: "Hospital operations corridor",
    bannerTitle: "Spectr for Healthcare",
    headline: "AI that earns its place from the back office to the bedside.",
    columnOne:
      "Hospitals are operational systems under clinical constraint. Capacity swings. Staffing is a puzzle with licences and fatigue. Revenue follows documentation. Spectr OS infuses those workflows with automation that still belongs to the people who hold the licence — not a model improvising on a ward.",
    columnTwo:
      "One source of truth for patient flow. Staffing that encodes how the hospital actually works. A revenue cycle that closes the loop from note to claim. The front line gets speed. The institution gets a record of what the system did.",
    focuses: [
      {
        id: "capacity",
        label: "Capacity management",
        statement: "Beds, PACU, and the ED are one problem wearing three names.",
        focus: "Patient flow",
        change: "Flow data becomes a connected picture so transfers, holds, and discharges are managed in one place as demand moves.",
        image: "/images/industries/healthcare.jpg",
        imageAlt: "Hospital operations corridor",
      },
      {
        id: "staffing",
        label: "Staffing and scheduling",
        statement: "A roster that ignores real skill mix is a safety incident waiting for a date.",
        focus: "People",
        change: "Units, theatres, and facilities share a model of need versus competence, so scheduling is proactive instead of a nightly scramble.",
        image: "/images/industries/pharma.jpg",
        imageAlt: "Clinical and care operations",
      },
      {
        id: "revenue",
        label: "Revenue cycle",
        statement: "The clinical work already happened. The paperwork should not be a second hospital.",
        focus: "Documentation and reimbursement",
        change: "Notes and the record feed workflows that find missed charge, draft the appeal, and return the human to the exception — not the boilerplate.",
        image: "/images/industries/financial.jpg",
        imageAlt: "Healthcare administration and operations",
      },
    ],
    capabilities: [
      {
        title: "An OS, not another silo",
        body: "Clinical and operational objects share a runtime. The point is coherence, not a new dashboard next to the EHR.",
      },
      {
        title: "Automation with a licence",
        body: "Workflows can draft, rank, and route. They do not discharge a patient or write a drug without the people accountable for that act.",
      },
      {
        title: "From ED to home",
        body: "Eligibility, boarding, and discharge lounge are the same flow. Treat them as one and the hospital starts to breathe.",
      },
      {
        title: "Evidence for the board",
        body: "What changed, for whom, under which protocol. Useful for quality, legal, and the next night shift.",
      },
    ],
  },
  {
    slug: "finance",
    index: "/0.8",
    name: "Finance",
    listingDescription: "From visualisation to outcomes — customer, risk, and operations connected in a governed runtime.",
    href: "/use-cases/finance",
    image: "/images/industries/financial.jpg",
    imageAlt: "Financial district and enterprise operations",
    bannerTitle: "Spectr for Finance",
    headline: "Help institutions meet the customers, regulators, and markets they will have tomorrow.",
    columnOne:
      "Financial work is already regulated, already watched, and still full of seams. Analysts and engineers spend their time stitching systems instead of deciding. Spectr OS is for that environment: security and governance as the way you get speed — not the tax you pay after a demo.",
    columnTwo:
      "Move past charts that do not change a process. Connect data to the outcome: a customer file that is true, a KYC review that is consistent, a book that can be marked against the market without a nine-day ritual. Transformation is the workflow, not the slide.",
    focuses: [
      {
        id: "customer",
        label: "A single customer truth",
        statement: "Inconsistent files are not a data-quality issue. They are an operating model.",
        focus: "Client lifecycle",
        change: "Onboarding, service, and advice run on one interface over the same objects — so a change in one place is a change everywhere it must be.",
        image: "/images/industries/financial.jpg",
        imageAlt: "Financial district and enterprise operations",
      },
      {
        id: "kyc",
        label: "KYC and review",
        statement: "The scarce resource is the analyst’s attention. Spend it on the high-risk file.",
        focus: "Compliance",
        change: "The full KYC process in one place: suggestions that keep reviews consistent, scores that rank the queue, a trail the regulator can read.",
        image: "/images/industries/government.jpg",
        imageAlt: "Regulated financial operations",
      },
      {
        id: "book",
        label: "The book, continuously",
        statement: "A 360 view that is only true at month-end is not a view. It is a lag.",
        focus: "Portfolio and markets",
        change: "Positions, transactions, and external marks sit in one workflow: allocate, flag a breach, resolve — without exporting the truth to a side system.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Market and operational infrastructure",
      },
    ],
    capabilities: [
      {
        title: "Outcomes, not pictures",
        body: "If a workflow cannot open an account, clear a review, or flag a breach, it is decoration. Spectr is built for the act.",
      },
      {
        title: "Regulated by default",
        body: "Access, lineage, and approval are the product surface. That is how you move fast in a watched industry.",
      },
      {
        title: "Agentic where it is legal",
        body: "Automate the boilerplate. Keep humans on the judgement. The runtime records both.",
      },
      {
        title: "One interface, many uses",
        body: "The same customer graph can serve service, marketing, and risk — configured, not copied into three warehouses.",
      },
    ],
  },
  {
    slug: "operations",
    index: "/0.9",
    name: "Operations",
    listingDescription:
      "Sites, assets, and crews in one runtime — so the work on the floor is the same object as the plan.",
    href: "/use-cases/operations",
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Industrial site operations",
    bannerTitle: "Spectr for Operations",
    headline: "Run the site as it is — not as last week’s plan said it would be.",
    columnOne:
      "Operations fail in the gap between the CMMS, the roster, and the radio. Spectr OS treats the asset, the work order, the crew, and the constraint as one live model, so a breakdown is a decision on the floor — not a ticket that waits for morning.",
    columnTwo:
      "See utilisation at the unit, not in a monthly pack. Rank the next legal job against parts, permits, and people who are actually on shift. Multi-site patterns flow back to the edge without taking the site down for a cloud round-trip.",
    focuses: [
      {
        id: "site",
        label: "The site as one object",
        statement: "A facility is not a dashboard. It is assets, crews, and constraints under a permit.",
        focus: "Facilities and plants",
        change: "Work orders, sensors, and access sit together so supervisors act on the site they have — not last night’s schedule.",
        image: "/images/industries/infrastructure.jpg",
        imageAlt: "Industrial site operations",
      },
      {
        id: "maintain",
        label: "Maintenance that can move",
        statement: "A job without parts is a delay wearing a work-order number.",
        focus: "Assets and upkeep",
        change: "Spares, skills, and downtime cost share one model, so expedite, defer, or substitute happens with the plant in view.",
        image: "/images/industries/spare-parts.jpg",
        imageAlt: "Spare parts and maintenance stores",
      },
      {
        id: "crew",
        label: "Crews against the work",
        statement: "A roster that cannot see the backlog is already late.",
        focus: "People and shift",
        change: "Competences, fatigue, and open jobs sit in the same runtime so the next assignment is a ranked choice, not a radio pile-up.",
        image: "/images/industries/manufacturing.jpg",
        imageAlt: "Crews and production operations",
      },
    ],
    capabilities: [
      {
        title: "One model of the estate",
        body: "Sites, assets, and crews exist once. Downstream tools read the same objects the supervisor already uses.",
      },
      {
        title: "Exception as a workflow",
        body: "When a unit stops, the runtime re-ranks the next legal jobs and records who approved the change.",
      },
      {
        title: "Governed action",
        body: "Proposed work carries evidence and an audit trail. People stay in command; the system does not invent the floor.",
      },
      {
        title: "From site to fleet",
        body: "What only appears across facilities can flow back to the edge — without a weekly reconciliation meeting.",
      },
    ],
  },
  {
    slug: "waste-management",
    index: "/0.10",
    name: "Waste Management",
    listingDescription:
      "Collection, plants, and materials as one loop — so a lift is an operational decision, not a route afterthought.",
    href: "/use-cases/waste-management",
    image: "/images/industries/logistics.jpg",
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
