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
    slug: "spectr-attack",
    name: "Spectr Attack",
    tagline: "Mission-ready drone platform for demanding aerial operations.",
    description:
      "Spectr Attack is a rugged aerial platform built for long-range observation, rapid deployment, and reliable field operation in complex environments.",
    category: "Industrial Drone",
    use: "Inspection",
    year: 2026,
    flightTime: "45 min",
    location: "Built to order",
    price: "Contact for pricing",
    availability: "Available by request",
    stock: 100,
    range: "18 km",
    highlights: ["Long-range link", "Rugged frame", "Stabilized payload", "Field support"],
    visual: "orbit",
  },
];

export function getObject(slug: string) {
  return objects.find((o) => o.slug === slug);
}

export const sectors = [...new Set(objects.map((o) => o.category))].sort() as DroneCategory[];
export const stages: DroneUse[] = ["Creator", "Enterprise", "Mapping", "Inspection", "Training"];
