export const spectrOsPage = {
  name: "Spectr OS",
  heroBody:
    "One operating system for industrial floors, warehouses, and enterprise sites.",
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
      video: "/videos/spectr-os-command.mp4",
    },
  ],
  ctaTitle: "Run your enterprise on Spectr OS",
  ctaImage: "/images/offerings/spectr-os.jpg",
  ctaImageAlt: "Industrial floor running on Spectr OS",
} as const;

export type SpectrOsFeature = (typeof spectrOsPage.features)[number];
