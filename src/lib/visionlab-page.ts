export const visionlabPage = {
  name: "VisionLab",
  heroBody:
    "The app for the camera. Open a stream, attach an open model, and keep the track on your own machine — licensed through a meeting with Spectr, not a public install.",
  heroImage: "/visionlab-app.jpg",
  heroImageAlt: "Street scene with vision masks on cars, people, and the road",
  modelsTitle: "Models you can run",
  modelsBody:
    "VisionLab does not ship a Spectr model. Pull the open weights you need — Ultralytics, Meta, Google, Microsoft, and more — and run them locally next to the camera.",
  modelsNote: "Detect, segment, pose, classify, OCR, depth, tracking, and multimodal — all on hardware you own.",
  modelsHosting: "Data hosted securely with AWS.",
  modelsHostingLogo: "/images/integrations/aws.svg",
  ctaTitle: "Get VisionLab through a meeting",
  ctaImage: "/images/industries/manufacturing.jpg",
} as const;

export const visionlabUseCases = [
  {
    name: "Manufacturing",
    line: "Watch the line on a workstation that stays on the floor.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit boards under an automated inspection head",
  },
  {
    name: "Logistics",
    line: "Open a dock camera, run detection, and follow the gap that stalls the yard.",
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
    line: "Attach detection to the plant stream from bin to trommel.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Sorting plant conveyors and trommel with workers on the floor",
  },
] as const;
