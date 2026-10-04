export const formats = ["PyTorch", "ONNX", "TensorRT", "OpenVINO", "CoreML", "TFLite", "Edge"] as const;

export const models = [
  {
    name: "ArgusONE",
    task: "Models",
    body: "One open vision model. It sees a camera stream, marks what matters, and keeps the track.",
  },
] as const;

export const tasks = [
  {
    title: "Computer vision",
    body: "Detection, segmentation, pose, classification, and depth on images and video.",
  },
  {
    title: "AI vision",
    body: "Models that explain what they see, so an operator can check the call before acting on it.",
  },
  {
    title: "VLA",
    body: "Vision-language-action models that connect a camera, a command, and a move.",
  },
] as const;

export const solutions = [
  {
    title: "Manufacturing",
    body: "Inspect parts, catch defects, and confirm PPE without stopping the line for a manual check.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Manufacturing floor",
  },
  {
    title: "Logistics",
    body: "Read yards, docks, and conveyors. Track pallets, vehicles, and the gap that will stop a shift.",
    image: "/images/industries/logistics.jpg",
    imageAlt: "Logistics yard and warehouse",
  },
  {
    title: "Robotics",
    body: "Give a machine a scene and a sentence. Spectr VLA turns both into a bounded next action.",
    image: "/images/industries/infrastructure.jpg",
    imageAlt: "Industrial infrastructure and machinery",
  },
  {
    title: "Security",
    body: "Watch a perimeter, a gate, or a floor. Detection and tracking stay on hardware you control.",
    image: "/images/industries/ports.jpg",
    imageAlt: "Port and perimeter operations",
  },
  {
    title: "Healthcare",
    body: "Support imaging and monitoring workflows where a second look has to be fast and local.",
    image: "/images/industries/healthcare.jpg",
    imageAlt: "Healthcare environment",
  },
  {
    title: "Agriculture",
    body: "Count, classify, and measure from aerial and ground cameras across a field or a herd.",
    image: "/images/industries/energy.jpg",
    imageAlt: "Open landscape used for field monitoring",
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
