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
  specifications: { label: string; value: string }[];
  equipment: { label: string; value: string }[];
  visual: "arc" | "grid" | "wave" | "dot" | "ring" | "bar" | "helix" | "prism" | "mesh" | "orbit" | "field" | "pulse";
};

export const objects: DroneProduct[] = [
  {
    slug: "spectr-attack",
    name: "Attack",
    tagline: "Long-endurance fixed-wing platform for demanding aerial operations.",
    description:
      "Attack is a modular twin-motor fixed-wing aircraft with a detachable nose for payload adaptation, V-tail configuration, and efficient cruise performance.",
    category: "Industrial Drone",
    use: "Inspection",
    year: 2026,
    flightTime: "4+ hours",
    location: "Built to order",
    price: "Contact for pricing",
    availability: "Available by request",
    stock: 100,
    range: "60-70 km/h cruise",
    highlights: ["1340mm wingspan", "1500-3000g AUW", "Eppler E205 airfoil", "4S6P 21Ah capable"],
    specifications: [
      { label: "Wingspan", value: "1340mm" },
      { label: "Length", value: "990mm" },
      { label: "Wing area", value: "26.5 dm2" },
      { label: "AUW", value: "1500-3000g" },
      { label: "Optimal cruise speed", value: "60-70 km/h" },
      { label: "Flight time", value: "Over 4 hours with 4S6P 21Ah Li-Ion" },
      { label: "Airfoil", value: "Eppler E205" },
      { label: "Center of gravity", value: "60mm from leading edge at wing root" },
      { label: "Root chord", value: "255mm" },
      { label: "MAC", value: "211mm" },
      { label: "Aspect ratio", value: "5.6" },
      { label: "Wing load", value: "55-115 g/dm2" },
    ],
    equipment: [
      { label: "Motors", value: "T-Motor F60 1750KV or T-Motor F90 1300KV" },
      { label: "Propellers", value: "7x4 / 7x5 / 7x6, one CW and one CCW" },
      { label: "Flight controller", value: "SpeedyBee F405 Wing or any Mavlink flight controller" },
      { label: "GPS", value: "Matek M10Q or similar GPS with compass" },
      { label: "Servos", value: "4x EMAX ES08 MAII Metal Gear or similar" },
      { label: "ESC", value: "2x BlHeliS 30-40A" },
      { label: "Battery", value: "4S, max 4S6P 21Ah Li-Ion; 3S also possible" },
      { label: "Receiver", value: "Matek R24-D ELRS or similar" },
      { label: "VTX", value: "Digital or analog VTX" },
    ],
    visual: "orbit",
  },
];

export function getObject(slug: string) {
  return objects.find((o) => o.slug === slug);
}

export const sectors = [...new Set(objects.map((o) => o.category))].sort() as DroneCategory[];
export const stages: DroneUse[] = ["Creator", "Enterprise", "Mapping", "Inspection", "Training"];
