export const models = [
  {
    name: "ArgusONE",
    body: "One open vision model. It sees a camera stream, marks what matters, and keeps the track.",
    install: "sudo apt install ArgusONE",
    image: "/argusone.jpg",
    imageAlt: "ArgusONE marking people, a bicycle, and handbags on a cobbled square",
    imageWidth: 1024,
    imageHeight: 682,
  },
  {
    name: "VisionLab",
    body: "The app for the camera. Open a stream, run ArgusONE, and keep the track on your own machine.",
    image: "/visionlab-app.jpg",
    imageAlt: "VisionLab by Spectr, with a Vision button",
    imageWidth: 1024,
    imageHeight: 646,
  },
] as const;

export const solutions = [
  {
    label: "Manufacturing",
    title: "See the line without stopping it",
    body: "Inspect parts, catch defects, and confirm PPE without a manual check at every station.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Manufacturing floor",
    tone: "dark",
  },
  {
    label: "Logistics",
    title: "Track the yard before the shift stalls",
    body: "Read docks and conveyors. Follow pallets, vehicles, and the gap that will stop the work.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Logistics yard and warehouse",
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
    imageAlt: "Port and perimeter operations",
    tone: "light",
  },
  {
    label: "Healthcare",
    title: "A second look that stays in the room",
    body: "Support imaging and monitoring workflows where the answer has to be fast and local.",
    image: "/images/industries/healthcare.jpg",
    imageAlt: "Healthcare environment",
    tone: "light",
  },
  {
    label: "Agriculture",
    title: "Count what the field is doing",
    body: "Classify and measure from aerial and ground cameras across a field or a herd.",
    image: "/images/industries/energy.jpg",
    imageAlt: "Open landscape used for field monitoring",
    tone: "dark",
  },
  {
    label: "Retail",
    title: "See the floor while the store is open",
    body: "Count shelves, queues, and what left the frame without closing an aisle to check.",
    image: "/images/industries/retail.jpg",
    imageAlt: "Retail floor",
    tone: "light",
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

export const faqs = [
  {
    question: "What is Spectr?",
    answer:
      "Spectr is a computer vision company. We publish open-source models for detection, segmentation, pose, classification, depth, and vision-language-action.",
  },
  {
    question: "Are the models open source?",
    answer:
      "Yes. Spectr models are released so you can read them, fine-tune them on your own data, and run them on your own machines.",
  },
  {
    question: "What does VLA mean here?",
    answer:
      "Vision-language-action. The model sees a scene, takes a language instruction, and proposes an action a person or a robot can carry out.",
  },
  {
    question: "Where can I run a Spectr model?",
    answer:
      "Train and infer in Python, then export to ONNX, TensorRT, OpenVINO, CoreML, TFLite, and other edge runtimes.",
  },
  {
    question: "Do you work with companies, or only publish models?",
    answer:
      "Both. The models are public. Teams that need a deployment, a fine-tune, or a support agreement can start a conversation with Spectr.",
  },
] as const;
