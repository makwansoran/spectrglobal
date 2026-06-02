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
  gallery: { src: string; alt: string }[];
  highlights: string[];
  specifications: { label: string; value: string }[];
  equipment: { label: string; value: string }[];
  visual: "arc" | "grid" | "wave" | "dot" | "ring" | "bar" | "helix" | "prism" | "mesh" | "orbit" | "field" | "pulse";
};

export const objects: DroneProduct[] = [
  {
    slug: "valkyrie",
    name: "VALKYRIE",
    tagline: "Mission-configurable attack UAV for payload delivery and terminal mission profiles.",
    description:
      "VALKYRIE is a mission-configurable attack UAV built to deliver payloads, execute terminal strike profiles, and fulfill predefined field missions with operator-controlled deployment.",
    category: "UAV",
    use: "UAV",
    year: 2026,
    flightTime: "Configured per mission",
    location: "Built to order",
    price: "Contact for pricing",
    availability: "Available by request",
    stock: 100,
    range: "Configured per mission",
    gallery: [
      { src: "/valkyrie-front.png", alt: "VALKYRIE front view" },
      { src: "/valkyrie-top.png", alt: "VALKYRIE top view" },
      { src: "/valkyrie-mountain.png", alt: "VALKYRIE in mountain terrain" },
    ],
    highlights: ["Mission payload ready", "Field-serviceable setup", "Operator support", "Built to order"],
    specifications: [
      { label: "Platform", value: "VTOL fixed-wing UAV" },
      { label: "Layout", value: "Tricopter VTOL with front tilt motors and rear stationary motor" },
      { label: "Wingspan", value: "1340 mm" },
      { label: "Length", value: "990 mm" },
      { label: "All-up weight", value: "2000-3000 g" },
      { label: "Optimal speed", value: "60-70 km/h" },
      { label: "Use case", value: "Payload delivery, terminal strike profiles, and mission execution" },
    ],
    equipment: [
      { label: "Payload", value: "Configured for mission requirements" },
      { label: "Material", value: "LW-PLA + PETG" },
      { label: "Print bed", value: "Minimum 220 x 220 mm" },
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
