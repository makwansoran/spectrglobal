export const visionlabPage = {
  name: "VisionLab",
  heroBody:
    "The app for the camera. Open a stream, run Argus, and keep the track on your own machine — frames never leave the site.",
  heroImage: "/visionlab-app.jpg",
  heroImageAlt: "Street scene with vision masks on cars, people, and the road",
  compareTitle: "How VisionLab stacks up",
  compareBody:
    "Built for the workstation next to the camera: live streams, local models, and a review loop that stays on hardware you own.",
  compareNote: "Scores reflect Spectr’s industrial desktop and edge criteria.",
  ctaTitle: "Open a stream in VisionLab",
  ctaImage: "/images/industries/manufacturing.jpg",
} as const;

/** Tools shown in the comparison graph. */
export const visionlabCompareTools = [
  { id: "visionlab", name: "VisionLab", highlight: true },
  { id: "roboflow", name: "Roboflow", highlight: false },
  { id: "label-studio", name: "Label Studio", highlight: false },
  { id: "cvat", name: "CVAT", highlight: false },
  { id: "opencv", name: "Custom OpenCV", highlight: false },
  { id: "cloud", name: "Cloud consoles", highlight: false },
] as const;

/**
 * Capability axes for industrial camera workstations.
 * Values are 0–100 relative scores for the chart.
 */
export const visionlabCompareMetrics = [
  {
    id: "local",
    label: "Local / on-prem app",
    scores: {
      visionlab: 98,
      roboflow: 42,
      "label-studio": 88,
      cvat: 90,
      opencv: 95,
      cloud: 12,
    },
  },
  {
    id: "live",
    label: "Live camera stream",
    scores: {
      visionlab: 97,
      roboflow: 55,
      "label-studio": 35,
      cvat: 48,
      opencv: 70,
      cloud: 40,
    },
  },
  {
    id: "model",
    label: "Attach open models",
    scores: {
      visionlab: 96,
      roboflow: 78,
      "label-studio": 62,
      cvat: 58,
      opencv: 85,
      cloud: 30,
    },
  },
  {
    id: "review",
    label: "Track & review loop",
    scores: {
      visionlab: 94,
      roboflow: 82,
      "label-studio": 90,
      cvat: 92,
      opencv: 45,
      cloud: 38,
    },
  },
  {
    id: "nocloud",
    label: "No cloud dependency",
    scores: {
      visionlab: 99,
      roboflow: 28,
      "label-studio": 92,
      cvat: 94,
      opencv: 97,
      cloud: 5,
    },
  },
] as const;

export const visionlabUseCases = [
  {
    name: "Manufacturing",
    href: "/use-cases/manufacturing",
    line: "Watch the line on a workstation that stays on the floor.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit boards under an automated inspection head",
  },
  {
    name: "Logistics",
    href: "/use-cases/logistics",
    line: "Open a dock camera, run Argus, and follow the gap that stalls the yard.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Warehouse floor with yellow roller conveyor and inventory",
  },
  {
    name: "Ports & perimeter",
    line: "Keep gate and floor tracks on machines you control.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Container terminal and cranes at dusk",
  },
  {
    name: "Agriculture",
    line: "Review aerial and ground streams before the count drifts.",
    image: "/images/industries/agriculture.jpg",
    imageAlt: "Sprayers working a green crop field",
  },
  {
    name: "Warehousing",
    line: "Replay a shift clip and confirm what moved on the floor.",
    image: "/images/industries/warehousing.jpg",
    imageAlt: "Warehouse floor",
  },
  {
    name: "Waste & materials",
    href: "/use-cases/waste-management",
    line: "Attach Argus to the plant stream from bin to trommel.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Sorting plant conveyors and trommel with workers on the floor",
  },
] as const;

export type VisionlabCompareToolId = (typeof visionlabCompareTools)[number]["id"];
