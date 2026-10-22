export const argusPage = {
  name: "Argus",
  heroBody:
    "An open vision model for real-time detection. It sees a camera stream, marks what matters, and keeps the track — on hardware you own.",
  heroVideo: "/videos/argusone-demo.mp4",
  heroVideoAlt: "Argus marking people, a bicycle, and handbags on a cobbled square",
  compareTitle: "How Argus stacks up",
  compareBody:
    "Rated for industrial camera work: local inference, tracking, and fine-tune on footage that never leaves the site. Not a public COCO leaderboard.",
  compareNote: "Scores reflect Spectr’s industrial deployment criteria.",
  ctaTitle: "Put Argus on your stream",
  ctaImage: "/images/industries/ports.jpg",
} as const;

/** Competitors shown in the comparison graph. */
export const argusCompareModels = [
  { id: "argus", name: "Argus", highlight: true },
  { id: "yolo", name: "YOLO", highlight: false },
  { id: "detectron2", name: "Detectron2", highlight: false },
  { id: "grounding-dino", name: "Grounding DINO", highlight: false },
  { id: "sam2", name: "SAM 2", highlight: false },
  { id: "cloud", name: "Cloud vision APIs", highlight: false },
] as const;

/**
 * Capability axes for industrial camera deployment.
 * Values are 0–100 relative scores for the chart (not published mAP).
 */
export const argusCompareMetrics = [
  {
    id: "edge",
    label: "Edge / local inference",
    scores: {
      argus: 98,
      yolo: 90,
      detectron2: 72,
      "grounding-dino": 58,
      sam2: 55,
      cloud: 18,
    },
  },
  {
    id: "track",
    label: "Multi-object tracking",
    scores: {
      argus: 96,
      yolo: 88,
      detectron2: 70,
      "grounding-dino": 48,
      sam2: 62,
      cloud: 42,
    },
  },
  {
    id: "finetune",
    label: "Fine-tune on private footage",
    scores: {
      argus: 97,
      yolo: 92,
      detectron2: 85,
      "grounding-dino": 68,
      sam2: 60,
      cloud: 28,
    },
  },
  {
    id: "camera",
    label: "Camera-to-production path",
    scores: {
      argus: 95,
      yolo: 78,
      detectron2: 55,
      "grounding-dino": 50,
      sam2: 45,
      cloud: 40,
    },
  },
  {
    id: "nocloud",
    label: "No cloud dependency",
    scores: {
      argus: 99,
      yolo: 94,
      detectron2: 90,
      "grounding-dino": 75,
      sam2: 72,
      cloud: 8,
    },
  },
] as const;

export const argusUseCases = [
  {
    name: "Manufacturing",
    href: "/use-cases/manufacturing",
    line: "Inspect parts and PPE without stopping the line.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit board under a pick-and-place head",
  },
  {
    name: "Logistics",
    href: "/use-cases/logistics",
    line: "Follow pallets, docks, and the gap that stalls the yard.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Cardboard carton on a roller conveyor",
  },
  {
    name: "Ports & perimeter",
    line: "Watch the gate on machines you control.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Container terminal and cranes at dusk",
  },
  {
    name: "Agriculture",
    line: "Count crop, herd, and equipment from the air or the ground.",
    image: "/images/industries/agriculture.jpg",
    imageAlt: "Sprayers working a green crop field",
  },
  {
    name: "Warehousing",
    line: "Know what moved on the floor before the count drifts.",
    image: "/images/industries/warehousing.jpg",
    imageAlt: "Warehouse floor",
  },
  {
    name: "Waste & materials",
    href: "/use-cases/waste-management",
    line: "Read the stream from bin to plant as one loop.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Landfill compactors on a waste pile",
  },
] as const;

export type ArgusCompareModelId = (typeof argusCompareModels)[number]["id"];
