export type PlatformCapability = {
  id: string;
  label: string;
  steps: { title: string; body: string }[];
};

export type PlatformFeature = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type PlatformIndustry = {
  name: string;
  description: string;
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
  statementTitle: string;
  statementHighlight: string;
  statementBody: string;
  capabilities: PlatformCapability[];
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
    statementTitle: "Go beyond applications.",
    statementHighlight: "One OS",
    statementBody:
      "Data fusion. Decision making. Agentic workflows. One runtime for every operation.",
    capabilities: [
      {
        id: "fuse",
        label: "Fuse",
        steps: [
          {
            title: "Unify every signal",
            body: "ERP, sensors, feeds, and people — one live model.",
          },
          {
            title: "One operational truth",
            body: "Metaphysics keeps every system coherent.",
          },
          {
            title: "See reality",
            body: "Argus binds perception to objects that matter.",
          },
        ],
      },
      {
        id: "decide",
        label: "Decide",
        steps: [
          {
            title: "Rank the next move",
            body: "Exceptions become actions — not reports.",
          },
          {
            title: "Human in the loop",
            body: "Approve, override, escalate with full context.",
          },
          {
            title: "Close the loop",
            body: "Every outcome writes back into the OS.",
          },
        ],
      },
      {
        id: "act",
        label: "Act",
        steps: [
          {
            title: "Agentic workflows",
            body: "AIM proposes and executes with guardrails.",
          },
          {
            title: "Real tools",
            body: "Agents touch systems — not just chat.",
          },
          {
            title: "Governed autonomy",
            body: "Audit every decision. Scale trust over time.",
          },
        ],
      },
    ],
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
        description: "Fuse carriers, inventory, and demand into one decision runtime.",
      },
      {
        name: "Manufacturing",
        description: "Orchestrate lines, parts, and labour as a live operational model.",
      },
      {
        name: "Energy & Industrials",
        description: "Turn plant signals into governed actions across sites.",
      },
      {
        name: "Defence & Security",
        description: "Human-in-the-loop decisions with full auditability.",
      },
      {
        name: "Healthcare Operations",
        description: "Coordinate capacity, assets, and exceptions in real time.",
      },
      {
        name: "Retail & Distribution",
        description: "Connect stores, DCs, and fulfilment into one OS.",
      },
      {
        name: "Financial Operations",
        description: "Agentic workflows over fused operational and financial truth.",
      },
      {
        name: "Government",
        description: "Deploy decision systems with European data posture.",
      },
      {
        name: "Infrastructure",
        description: "Monitor, decide, and act across critical physical systems.",
      },
      {
        name: "Ports & Terminals",
        description: "Unify yard, berth, and cargo flows into executable decisions.",
      },
      {
        name: "Aerospace",
        description: "Keep complex programmes coherent across partners and sites.",
      },
      {
        name: "Pharmaceuticals",
        description: "Trace every unit and exception through a governed runtime.",
      },
    ],
    ctaTitle: "Run your enterprise on Spectr OS",
    ctaBody: "Free for enterprise customers — permanently.",
  },
  {
    slug: "aim",
    name: "AIM",
    index: "/0.2",
    heroTagline: "Artificial Intelligence Model for every decision on the floor",
    exploreLabel: "Explore our artificial intelligence model",
    timeLabel: "Time: 3 mins to explore",
    valueProp: "Integrate AI into operational decision making",
    heroImage: "/images/offerings/spectr-mind.jpg",
    heroImageAlt: "AIM intelligence infrastructure",
    statementTitle: "Go beyond chat.",
    statementHighlight: "Operational Autonomy",
    statementBody:
      "Turn signals from the floor into ranked decisions — with tools, memory, and human approval baked into every loop.",
    capabilities: [
      {
        id: "propose",
        label: "Propose",
        steps: [
          {
            title: "Read the live state",
            body: "AIM watches Metaphysics and Argus for shortages, bottlenecks, and exceptions as they appear.",
          },
          {
            title: "Propose the next move",
            body: "Slotting changes, wave adjustments, and reassignments arrive as concrete proposals — not vague insights.",
          },
          {
            title: "Show the reasoning",
            body: "Operators see why AIM suggested the action before they approve it.",
          },
        ],
      },
      {
        id: "act",
        label: "Act",
        steps: [
          {
            title: "Give AI real tools",
            body: "AIM can draft tasks, holds, and reallocations inside Spectr OS — subject to policy and approval.",
          },
          {
            title: "Stay inside the ontology",
            body: "Actions only touch objects Metaphysics knows, so the model never invents a fake aisle.",
          },
          {
            title: "Learn from outcomes",
            body: "Accepted and rejected proposals improve the next decision cycle on that specific site.",
          },
        ],
      },
      {
        id: "supervise",
        label: "Supervise",
        steps: [
          {
            title: "Human-in-the-loop by default",
            body: "Critical moves require operator confirmation. Autonomy expands only where trust is earned.",
          },
          {
            title: "Full execution history",
            body: "Every proposal, approval, and outcome is logged for supervisors and continuous improvement.",
          },
          {
            title: "Site-specific intelligence",
            body: "AIM learns your floor — not a generic warehouse average.",
          },
        ],
      },
    ],
    features: [
      {
        title: "Designed for AI workflow builders",
        description:
          "Compose decision workflows that bind models to real warehouse objects, actions, and constraints.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "AIM workflow systems",
      },
      {
        title: "Evaluate and ship with confidence",
        description:
          "Score proposals against outcomes before widening autonomy — then iterate without rewriting the floor.",
        image: "/images/offerings/spectr-c2.jpg",
        imageAlt: "Operational evaluation on the floor",
      },
      {
        title: "Anchored in Metaphysics",
        description:
          "AIM only reasons over the ontology — the same truth Argus and Spectr OS share.",
        image: "/images/offerings/spectr-os.jpg",
        imageAlt: "Shared operational model",
      },
      {
        title: "Fed by Argus",
        description:
          "Live detection of units, pallets, and exceptions gives AIM eyes on the aisle — not yesterday’s count.",
        image: "/spectr-detection.png",
        imageAlt: "Argus detection feeding AIM",
      },
    ],
    industriesIntro: "Solving complex problems across warehouse and industrial floors in days, not years.",
    industries: [
      {
        name: "Warehousing & Fulfilment",
        description: "Live decisions from dock to dispatch — fused inventory, labour, and exceptions.",
      },
      {
        name: "3PL & Logistics",
        description: "One runtime across clients, carriers, and sites without rebuilding each warehouse.",
      },
      {
        name: "Manufacturing & Parts",
        description: "Keep lines, spare parts, and material flows coherent under one model.",
      },
      {
        name: "Retail Distribution",
        description: "Connect DC operations to store demand with agentic replenishment workflows.",
      },
      {
        name: "Cold Chain",
        description: "Govern temperature, dwell, and exceptions as first-class operational objects.",
      },
      {
        name: "Ports & Terminals",
        description: "Unify yard, berth, and cargo events into executable next actions.",
      },
      {
        name: "Spare Parts",
        description: "See every unit, locate every shortage, and close the loop in minutes.",
      },
      {
        name: "Pharmaceutical Distribution",
        description: "Traceability and exception handling with audit-ready decision history.",
      },
    ],
    ctaTitle: "Build now with AIM",
    ctaBody: "Put an AI model on your operation that proposes real actions — with humans still in command.",
  },
  {
    slug: "metaphysics",
    name: "Metaphysics",
    index: "/0.3",
    heroTagline: "Ontology layer for every object, action, and decision",
    exploreLabel: "Explore our ontology layer",
    timeLabel: "Time: 3 mins to explore",
    valueProp: "Make the floor coherent across every system",
    heroImage: "/images/offerings/spectr-c2.jpg",
    heroImageAlt: "Metaphysics ontology for warehouse operations",
    statementTitle: "Go beyond data lakes.",
    statementHighlight: "Operational Ontology",
    statementBody:
      "Map locations, SKUs, people, and processes into one semantic layer — so AIM and Argus share the same floor.",
    capabilities: [
      {
        id: "model",
        label: "Model",
        steps: [
          {
            title: "Objects that match the floor",
            body: "Bins, pallets, waves, carriers, and constraints become first-class objects — not spreadsheet rows.",
          },
          {
            title: "Actions with consequences",
            body: "Moves, holds, and approvals update the ontology immediately so nothing drifts out of sync.",
          },
          {
            title: "Relationships that matter",
            body: "Affinity, velocity, and adjacency are encoded where slotting and AI can actually use them.",
          },
        ],
      },
      {
        id: "integrate",
        label: "Integrate",
        steps: [
          {
            title: "Connect without duplication",
            body: "Bring ERP, TMS, and carrier feeds into Metaphysics without fracturing your source of truth.",
          },
          {
            title: "Keep history legible",
            body: "Every change is attributable — for audits, disputes, and continuous improvement.",
          },
          {
            title: "Multi-site by design",
            body: "One ontology language across sites, with local configuration where each floor differs.",
          },
        ],
      },
      {
        id: "enable",
        label: "Enable",
        steps: [
          {
            title: "Fuel AIM",
            body: "Decision models only work when the world model is truthful. Metaphysics is that world.",
          },
          {
            title: "Ground Argus",
            body: "Detections map onto known objects — so a seen tote becomes inventory, not a mystery blob.",
          },
          {
            title: "Power Spectr OS",
            body: "The operating system runs on Metaphysics. Without it, you are back to disconnected tools.",
          },
        ],
      },
    ],
    features: [
      {
        title: "Semantic model of the floor",
        description:
          "Encode how your warehouse actually works — including the messy exceptions that never make it into the SOP.",
        image: "/images/offerings/spectr-c2.jpg",
        imageAlt: "Warehouse ontology in practice",
      },
      {
        title: "Built for real operations",
        description:
          "Designed against mixed SKUs, partial data, and shift work — not a reference warehouse.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "Real warehouse operations",
      },
      {
        title: "API-first and open",
        description:
          "Connect systems through REST and webhooks without waiting on a roadmap for every integration.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Systems integration",
      },
      {
        title: "Free with Spectr OS",
        description:
          "Metaphysics ships as the ontology layer of Spectr OS — included for enterprise customers, permanently.",
        image: "/images/offerings/spectr-os.jpg",
        imageAlt: "Spectr OS and Metaphysics",
      },
    ],
    industriesIntro: "Solving complex problems across warehouse and industrial floors in days, not years.",
    industries: [
      {
        name: "Warehousing & Fulfilment",
        description: "Model every location, SKU, and process as one operational ontology.",
      },
      {
        name: "3PL & Logistics",
        description: "Share one semantic layer across clients and sites without duplicating truth.",
      },
      {
        name: "Manufacturing & Parts",
        description: "Encode parts, lines, and constraints where AIM and Argus can act on them.",
      },
      {
        name: "Retail Distribution",
        description: "Keep DC and store objects coherent across every system that touches inventory.",
      },
      {
        name: "Cold Chain",
        description: "Bind temperature, dwell, and compliance rules into the ontology itself.",
      },
      {
        name: "Ports & Terminals",
        description: "Map yard, berth, and cargo relationships into a single executable model.",
      },
      {
        name: "Spare Parts",
        description: "Make every unit and bin first-class — not a spreadsheet row.",
      },
      {
        name: "Pharmaceutical Distribution",
        description: "Full provenance and change history for every object that moves.",
      },
    ],
    ctaTitle: "Build now with Metaphysics",
    ctaBody: "Give every model and every operator one coherent map of the operation.",
  },
  {
    slug: "argus",
    name: "Argus",
    index: "/0.4",
    heroTagline: "Object detection model for every unit on the floor",
    exploreLabel: "Explore our object detection model",
    timeLabel: "Time: 3 mins to explore",
    valueProp: "See what is actually happening in the aisle",
    heroImage: "/spectr-detection.png",
    heroImageAlt: "Argus object detection on warehouse assets",
    statementTitle: "Go beyond generic vision.",
    statementHighlight: "Floor Perception",
    statementBody:
      "Detect units, pallets, and exceptions in real time — and bind every sighting to Metaphysics.",
    capabilities: [
      {
        id: "see",
        label: "See",
        steps: [
          {
            title: "Industrial-grade detection",
            body: "Argus is trained for warehouse reality — occlusion, mixed lighting, and dense SKUs included.",
          },
          {
            title: "Beat generic baselines",
            body: "On floor workloads, Argus outperforms general models like YOLOv11 where industrial accuracy matters.",
          },
          {
            title: "Edge-ready",
            body: "Run close to the camera so latency stays low enough for live operations.",
          },
        ],
      },
      {
        id: "bind",
        label: "Bind",
        steps: [
          {
            title: "Map detections to objects",
            body: "A seen pallet becomes a Metaphysics object with location, status, and history — not a floating box.",
          },
          {
            title: "Flag exceptions early",
            body: "Mis-slots, missing units, and unsafe conditions surface before the next pick wave fails.",
          },
          {
            title: "Feed AIM",
            body: "Live perception is what lets AIM propose actions that match the floor right now.",
          },
        ],
      },
      {
        id: "scale",
        label: "Scale",
        steps: [
          {
            title: "Site by site",
            body: "Calibrate to your racking and lighting, then expand coverage aisle by aisle.",
          },
          {
            title: "Human-readable evidence",
            body: "Supervisors can review what Argus saw when a decision was made.",
          },
          {
            title: "Part of Spectr OS",
            body: "Argus is not a bolt-on camera toy — it is a native layer of the operating system.",
          },
        ],
      },
    ],
    features: [
      {
        title: "Built for warehouse vision",
        description:
          "Optimised for totes, pallets, labels, and aisle geometry — not internet photo benchmarks alone.",
        image: "/spectr-detection.png",
        imageAlt: "Argus detection output",
      },
      {
        title: "Real-time exception sensing",
        description:
          "Catch drift between system state and physical reality before it becomes an inventory crisis.",
        image: "/images/offerings/spectr-c2.jpg",
        imageAlt: "Warehouse aisles monitored by Argus",
      },
      {
        title: "Tied to the ontology",
        description:
          "Detections only matter when they update Metaphysics. Argus writes into the same truth AIM uses.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Ontology-linked perception",
      },
      {
        title: "Proven on the floor",
        description:
          "Benchmark and pilot on your own cameras — then scale with Spectr OS governance.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "Floor deployment of Argus",
      },
    ],
    industriesIntro: "Solving complex problems across warehouse and industrial floors in days, not years.",
    industries: [
      {
        name: "Warehousing & Fulfilment",
        description: "Detect units, pallets, and aisle exceptions as work happens.",
      },
      {
        name: "3PL & Logistics",
        description: "Give every site eyes on physical reality — not yesterday’s count.",
      },
      {
        name: "Manufacturing & Parts",
        description: "Bind detections to parts and stations Metaphysics already knows.",
      },
      {
        name: "Retail Distribution",
        description: "Catch mis-slots and missing inventory before the next wave fails.",
      },
      {
        name: "Cold Chain",
        description: "Sense door, dwell, and handling exceptions in temperature-critical lanes.",
      },
      {
        name: "Ports & Terminals",
        description: "See containers and yard moves, then write them into the ontology.",
      },
      {
        name: "Spare Parts",
        description: "Find every unit on the floor and map it to the live inventory model.",
      },
      {
        name: "Pharmaceutical Distribution",
        description: "Evidence-backed sightings for every regulated movement.",
      },
    ],
    ctaTitle: "Build now with Argus",
    ctaBody: "Put industrial object detection on the floor — and connect it to every decision system you run.",
  },
];

export function getPlatform(slug: string) {
  return platforms.find((platform) => platform.slug === slug);
}

export function getPlatformSlugs() {
  return platforms.map((platform) => platform.slug);
}
