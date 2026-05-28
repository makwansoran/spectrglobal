export type DroneUse = "Creator" | "Enterprise" | "Mapping" | "Inspection" | "Training";
export type DroneCategory =
  | "Camera Drone"
  | "FPV Drone"
  | "Industrial Drone"
  | "Survey Drone"
  | "Training Drone";

export type DroneProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: DroneCategory;
  use: DroneUse;
  year: number;
  flightTime: string;
  location: string;
  price: string;
  availability: string;
  stock: number;
  range: string;
  highlights: string[];
  visual: "arc" | "grid" | "wave" | "dot" | "ring" | "bar" | "helix" | "prism" | "mesh" | "orbit" | "field" | "pulse";
};

export const objects: DroneProduct[] = [
  {
    slug: "spectr-air-pro",
    name: "Spectr Air Pro",
    tagline: "Foldable 4K drone for creators, property tours, and travel footage.",
    description:
      "A compact aerial camera system with stabilized 4K capture, obstacle sensing, and simple flight modes for smooth cinematic shots straight out of the case.",
    category: "Camera Drone",
    use: "Creator",
    year: 2026,
    flightTime: "38 min",
    location: "In stock",
    price: "$1,299",
    availability: "Ships in 2 days",
    stock: 84,
    range: "12 km",
    highlights: ["4K HDR camera", "3-axis gimbal", "Obstacle sensing", "Travel case included"],
    visual: "orbit",
  },
  {
    slug: "spectr-scout-fpv",
    name: "Spectr Scout FPV",
    tagline: "Fast, agile FPV drone built for immersive flying and training.",
    description:
      "A ready-to-fly FPV package with low-latency video, durable prop guards, and beginner flight profiles that can be unlocked as pilots gain confidence.",
    category: "FPV Drone",
    use: "Training",
    year: 2026,
    flightTime: "18 min",
    location: "In stock",
    price: "$799",
    availability: "Ships today",
    stock: 72,
    range: "6 km",
    highlights: ["FPV controller", "Low-latency feed", "Durable frame", "Beginner mode"],
    visual: "wave",
  },
  {
    slug: "spectr-map-x",
    name: "Spectr Map X",
    tagline: "High-accuracy mapping drone for survey teams and site planning.",
    description:
      "Designed for repeatable mapping missions, Map X combines automated grid flights, high-resolution capture, and field-ready batteries for construction, land, and infrastructure teams.",
    category: "Survey Drone",
    use: "Mapping",
    year: 2026,
    flightTime: "52 min",
    location: "Limited stock",
    price: "$4,899",
    availability: "Ships in 5 days",
    stock: 46,
    range: "15 km",
    highlights: ["Automated routes", "RTK-ready", "High-res imaging", "Field battery kit"],
    visual: "grid",
  },
  {
    slug: "spectr-inspect-r",
    name: "Spectr Inspect R",
    tagline: "Rugged inspection drone for roofs, towers, and industrial assets.",
    description:
      "Inspect R is built for close visual inspection in demanding environments, with a protected airframe, zoom camera support, bright safety lighting, and reliable hover stability.",
    category: "Industrial Drone",
    use: "Inspection",
    year: 2026,
    flightTime: "44 min",
    location: "Preorder",
    price: "$3,499",
    availability: "Ships in 3 weeks",
    stock: 28,
    range: "10 km",
    highlights: ["Rugged frame", "Zoom-ready payload", "Safety lights", "Stable hover"],
    visual: "mesh",
  },
  {
    slug: "spectr-enterprise-kit",
    name: "Spectr Enterprise Kit",
    tagline: "Fleet-ready drone bundle for teams that need dependable aerial operations.",
    description:
      "A complete team package with multiple aircraft, charging hub, spare batteries, training materials, and priority support for commercial drone programs.",
    category: "Industrial Drone",
    use: "Enterprise",
    year: 2026,
    flightTime: "40 min",
    location: "Built to order",
    price: "$9,900",
    availability: "Ships in 4 weeks",
    stock: 35,
    range: "12 km",
    highlights: ["Multi-drone bundle", "Charging hub", "Team training", "Priority support"],
    visual: "field",
  },
];

export function getObject(slug: string) {
  return objects.find((o) => o.slug === slug);
}

export const sectors = [...new Set(objects.map((o) => o.category))].sort() as DroneCategory[];
export const stages: DroneUse[] = ["Creator", "Enterprise", "Mapping", "Inspection", "Training"];
