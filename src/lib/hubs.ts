import { industryPages } from "@/lib/use-cases";
import { partnerQuotes } from "@/lib/content";

export type HubCard = {
  title: string;
  body: string;
  href: string;
  image?: string;
  imageAlt?: string;
};

export type HubPage = {
  path: string;
  bannerTitle: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  headline: string;
  columnOne: string;
  columnTwo: string;
  cardsTitle?: string;
  cards?: HubCard[];
  quotesTitle?: string;
  capabilitiesTitle?: string;
  capabilities?: { title: string; body: string }[];
  moreTitle?: string;
  more?: { label: string; href: string }[];
};

export const developersHub: HubPage = {
  path: "/developers",
  bannerTitle: "Developers",
  description: "Load a Spectr model, predict on your own images, and export the checkpoint you fine-tune.",
  heroImage: "/spectr-detection.png",
  heroImageAlt: "Aerial detection from a Spectr model",
  headline: "Open vision models, with a short path from install to prediction.",
  columnOne:
    "Spectr models cover detection, segmentation, pose, classification, depth, and vision-language-action. The Python API loads a checkpoint and returns boxes, masks, or the next action.",
  columnTwo:
    "Fine-tune on your own scenes and export to ONNX, TensorRT, OpenVINO, CoreML, or TFLite. The weights stay with you.",
  cardsTitle: "Start",
  cards: [
    {
      title: "Models",
      body: "Spectr Detect, Segment, Pose, Classify, Depth, and VLA — one family, open weights.",
      href: "/#models",
    },
    {
      title: "Solutions",
      body: "Manufacturing, logistics, robotics, security, healthcare, and agriculture.",
      href: "/#solutions",
    },
    {
      title: "GitHub",
      body: "Read the code, open an issue, and run the models on your own machine.",
      href: "https://github.com/makwansoran/spectrglobal",
    },
  ],
  capabilitiesTitle: "What you get",
  capabilities: [
    {
      title: "One API",
      body: "Load any Spectr checkpoint the same way. Swap the task without rewriting the call.",
    },
    {
      title: "Your data",
      body: "Fine-tune on the scenes you actually run. The dataset does not have to leave the site.",
    },
    {
      title: "Inspectable action",
      body: "Spectr VLA proposes a next move from a frame and an instruction. A person can still refuse it.",
    },
    {
      title: "Edge export",
      body: "Ship the same model to a workstation, a Jetson, or a phone.",
    },
  ],
};

export const customersHub: HubPage = {
  path: "/customers",
  bannerTitle: "Customers",
  description: "Impact from the floor — deployments that turned insight into a shorter operational loop.",
  heroImage: "/images/industries/logistics.jpg",
  heroImageAlt: "Customer operations",
  headline: "Enterprise transformation — from insight to impact.",
  columnOne:
    "The point of the software is tangible value in a working environment: inventory that is true in the morning, a shortage closed in minutes, a line that does not wait on a weekly argument.",
  columnTwo:
    "See deployments in the language of the people who run them. Then open the industry page if you want the argument for your domain.",
  quotesTitle: "In the words of operators",
  cardsTitle: "By industry",
  cards: industryPages.map((page) => ({
    title: page.name,
    body: page.headline,
    href: page.href,
    image: page.image,
    imageAlt: page.imageAlt,
  })),
};

export const customerQuotes = partnerQuotes;

export const hubPaths = [developersHub.path, customersHub.path];
