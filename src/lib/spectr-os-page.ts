export const spectrOsPage = {
  name: "Spectr OS",
  heroBody:
    "One operating system for industrial floors, warehouses, and enterprise sites. Free for enterprise customers — permanently.",
  heroImage: "/images/products/spectr-os-ui.png",
  heroImageAlt: "Spectr OS interface",
  introVideo: "/videos/spectr-os.mp4",
  featuresTitle: "What you can do on Spectr OS",
  features: [
    {
      id: "own-model",
      title: "Create your own model",
      body: "Train on your SKUs, flows, and decisions — not a generic foundation model.",
      image: "/images/bootcamp/step-2-train.png",
      imageAlt: "Training a model on operational data in Spectr OS",
      video: "/videos/spectr-os-own-model.mp4",
    },
    {
      id: "ontology",
      title: "Ontology & agentic workflows",
      body: "One semantic layer. Agents propose and execute against the live model.",
      image: "/images/products/metaphysics-ui.png",
      imageAlt: "Ontology and agentic workflows in Spectr OS",
      video: "/videos/spectr-os-ontology.mp4",
    },
    {
      id: "data-hosting",
      title: "Data hosting",
      body: "Host in the EU or on your own infrastructure.",
      image: "/images/products/spectr-os-files.png",
      imageAlt: "Spectr OS files on this PC — local hosting for operational data",
    },
    {
      id: "data-fusion",
      title: "Data and sensor fusion",
      body: "WMS, ERP, sensors, and cameras in one live runtime.",
      image: "/images/bootcamp/step-1-data.png",
      imageAlt: "Data and sensor fusion across systems in Spectr OS",
      video: "/videos/spectr-os-data-fusion.mp4",
    },
    {
      id: "command",
      title: "Command & decisions",
      body: "Next decision, with context and a clear recommend path.",
      image: "/images/products/spectr-os-ui.png",
      imageAlt: "Spectr OS command surface with live decisions",
    },
    {
      id: "deploy",
      title: "Deploy your way",
      body: "Self-host, edge, or cloud — configuration on your aisle.",
      image: "/images/products/spectr-edge.jpg",
      imageAlt: "On-site and edge deployment of Spectr OS",
    },
  ],
  ctaTitle: "Run your enterprise on Spectr OS",
  ctaBody: "No licence fee, no user cap, no expiry date. Map where Spectr OS fits — in days, not quarters.",
  ctaImage: "/images/offerings/spectr-os.jpg",
  ctaImageAlt: "Industrial floor running on Spectr OS",
} as const;

export type SpectrOsFeature = (typeof spectrOsPage.features)[number];
