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
  industries: string[];
  ctaTitle: string;
  ctaBody: string;
};

export const platforms: Platform[] = [
  {
    slug: "spectr-os",
    name: "Spectr OS",
    index: "/0.1",
    heroTagline: "The operating system for the physical economy",
    exploreLabel: "Explore our warehouse operating system",
    timeLabel: "Time: 3 mins to explore",
    valueProp: "Run every decision on the floor from one system",
    heroImage: "/images/offerings/spectr-os.jpg",
    heroImageAlt: "Spectr OS on an industrial floor",
    statementTitle: "Go beyond dashboards.",
    statementHighlight: "Enterprise Operations",
    statementBody:
      "Turn warehouse software into a live operating system — where AIM, Metaphysics, and Argus share one truth of the floor.",
    capabilities: [
      {
        id: "decide",
        label: "Decide",
        steps: [
          {
            title: "Surface the next action",
            body: "Spectr OS ranks exceptions, shortages, and opportunities as the shift unfolds — not in a morning report.",
          },
          {
            title: "Keep humans in the loop",
            body: "Operators approve, override, or escalate with full context on why the system proposed the move.",
          },
          {
            title: "Close the loop",
            body: "Every decision writes back into Metaphysics so the next hour is smarter than the last.",
          },
        ],
      },
      {
        id: "orchestrate",
        label: "Orchestrate",
        steps: [
          {
            title: "One model of the floor",
            body: "Locations, SKUs, labour, and equipment share a single operational map across every site.",
          },
          {
            title: "Coordinate people and systems",
            body: "WMS tasks, carrier events, and floor signals land in one queue instead of five tools.",
          },
          {
            title: "Deploy without rebuilds",
            body: "Spectr OS runs on aisles and racking as they already exist — configuration, not construction.",
          },
        ],
      },
      {
        id: "govern",
        label: "Govern",
        steps: [
          {
            title: "Audit every decision",
            body: "Who approved what, when, and on which evidence — available for supervisors and auditors alike.",
          },
          {
            title: "European data posture",
            body: "Host in the EU or on your infrastructure. Your operational data stays yours.",
          },
          {
            title: "Free for enterprises",
            body: "No licence fee, no user cap, no expiry. Advancement is the standard — not an upsell.",
          },
        ],
      },
    ],
    features: [
      {
        title: "Designed for floor operators",
        description:
          "Build and run workflows where work actually happens — docks, aisles, and packing lanes — with interfaces that survive a twelve-hour shift.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "Warehouse operators on the floor",
      },
      {
        title: "Evaluate and ship with confidence",
        description:
          "Pilot on one site, measure accuracy and cycle time, then roll out with the same ontology and the same decision logic.",
        image: "/images/offerings/spectr-c2.jpg",
        imageAlt: "Warehouse racking and operations",
      },
      {
        title: "Anchored in operational truth",
        description:
          "Metaphysics keeps software development tied to what is actually on the floor — not a stale spreadsheet of locations.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Systems and intelligence infrastructure",
      },
      {
        title: "See what the floor sees",
        description:
          "Argus feeds live object detection into Spectr OS so inventory, exceptions, and safety issues are visible as they happen.",
        image: "/spectr-detection.png",
        imageAlt: "Object detection on warehouse assets",
      },
    ],
    industries: [
      "Warehousing & Fulfilment",
      "3PL & Logistics",
      "Manufacturing & Parts",
      "Retail Distribution",
      "Cold Chain",
      "Ports & Terminals",
      "Spare Parts",
      "Pharmaceutical Distribution",
    ],
    ctaTitle: "Build now with Spectr OS",
    ctaBody:
      "Request access and start on your own data. Free for enterprise customers — permanently.",
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
    industries: [
      "Warehousing & Fulfilment",
      "3PL & Logistics",
      "Manufacturing & Parts",
      "Retail Distribution",
      "Cold Chain",
      "Ports & Terminals",
      "Spare Parts",
      "Pharmaceutical Distribution",
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
    industries: [
      "Warehousing & Fulfilment",
      "3PL & Logistics",
      "Manufacturing & Parts",
      "Retail Distribution",
      "Cold Chain",
      "Ports & Terminals",
      "Spare Parts",
      "Pharmaceutical Distribution",
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
    industries: [
      "Warehousing & Fulfilment",
      "3PL & Logistics",
      "Manufacturing & Parts",
      "Retail Distribution",
      "Cold Chain",
      "Ports & Terminals",
      "Spare Parts",
      "Pharmaceutical Distribution",
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
