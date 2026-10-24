export const models = [
  {
    name: "VisionLab",
    body: "The app for the camera. Open a stream, run detection, and keep the track on your own machine.",
    image: "/visionlab-app.jpg",
    imageAlt: "Street scene with vision masks on cars, people, and the road",
  },
] as const;

export const solutions = [
  {
    label: "Manufacturing",
    title: "See the line without stopping it",
    body: "Inspect parts, catch defects, and confirm PPE without a manual check at every station.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Circuit boards under an automated inspection head",
    tone: "dark",
  },
  {
    label: "Logistics",
    title: "Track the yard before the shift stalls",
    body: "Read docks and conveyors. Follow pallets, vehicles, and the gap that will stop the work.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Warehouse floor with yellow roller conveyor and inventory",
    tone: "light",
  },
  {
    label: "Robotics",
    title: "A scene, a sentence, a next action",
    body: "Spectr VLA turns what the camera sees and what you ask into a bounded move a machine can take.",
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Industrial infrastructure and machinery",
    tone: "light",
  },
  {
    label: "Security",
    title: "Watch the gate on hardware you own",
    body: "Detection and tracking for a perimeter, a floor, or a port stay on machines you control.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Container terminal and cranes at dusk",
    tone: "light",
  },
  {
    label: "Agriculture",
    title: "Count what the field is doing",
    body: "Classify and measure from aerial and ground cameras across a field or a herd.",
    image: "/images/industries/agriculture.jpg",
    imageAlt: "Sprayers working a green crop field",
    tone: "dark",
  },
  {
    label: "Warehousing",
    title: "Know what moved on the floor",
    body: "Follow totes, aisles, and docks so the count matches what the camera actually saw.",
    image: "/images/industries/warehousing.jpg",
    imageAlt: "Warehouse floor",
    tone: "dark",
  },
] as const;
