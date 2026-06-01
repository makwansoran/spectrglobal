export type DroneUse = "UAV";
export type DroneCategory = "UAV";

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
  specifications: { label: string; value: string }[];
  equipment: { label: string; value: string }[];
  visual: "arc" | "grid" | "wave" | "dot" | "ring" | "bar" | "helix" | "prism" | "mesh" | "orbit" | "field" | "pulse";
};

export const objects: DroneProduct[] = [
  {
    slug: "valkyrie",
    name: "VALKYRIE",
    tagline: "Configurable reconnaissance vehicle for observation and field operations.",
    description:
      "VALKYRIE is a mission-configurable unmanned aircraft platform for teams that need persistent aerial visibility, adaptable payload options, and dependable field handling.",
    category: "UAV",
    use: "UAV",
    year: 2026,
    flightTime: "Configured per mission",
    location: "Built to order",
    price: "Contact for pricing",
    availability: "Available by request",
    stock: 100,
    range: "Configured per mission",
    highlights: ["Mission payload ready", "Field-serviceable setup", "Operator support", "Built to order"],
    specifications: [
      { label: "Platform", value: "Unmanned aerial vehicle" },
      { label: "Configuration", value: "Mission-specific airframe and payload setup" },
      { label: "Use case", value: "Observation, inspection, and field support" },
      { label: "Availability", value: "Built to order" },
    ],
    equipment: [
      { label: "Payload", value: "Configured for mission requirements" },
      { label: "Control link", value: "Specified during procurement" },
      { label: "Support", value: "Setup guidance and operator support available" },
    ],
    visual: "field",
  },
];

export function getObject(slug: string) {
  return objects.find((o) => o.slug === slug);
}

export const sectors = [...new Set(objects.map((o) => o.category))].sort() as DroneCategory[];
export const stages: DroneUse[] = ["UAV"];
