export const spectrEdgePage = {
  name: "Spectr Edge",
  heroTagline: "Compute for AI vision on site.",
  heroImage: "/images/products/spectr-edge.jpg",
  heroImageAlt: "Spectr Edge enclosure",
  overviewTitle: "On site. Not the cloud.",
  overviewBody:
    "Run vision models on the floor — without sending the site to the cloud. Spectr Edge is compute for AI vision on site, at a fraction of the cost of hosting large models.",
  overviewVideo: "",
  overviewVideoAlt: "Spectr Edge on site",
  design: {
    image: "/images/products/spectr-edge-board.png",
    imageAlt: "Spectr Edge AI board",
    chip: { x: 50, y: 40 },
    hailo: {
      label: "Hailo",
      title: "13 TOPS on the chip.",
      body: "A dedicated neural accelerator for AI vision on site. Object detection, segmentation, and pose — scored on the board, then handed to Spectr OS.",
      specs: [
        { label: "Inference", value: "13 TOPS" },
        { label: "Accelerator", value: "Hailo" },
        { label: "Interface", value: "PCIe Gen 3" },
        { label: "Vision", value: "Detection, segmentation, pose" },
        { label: "Ambient", value: "0–50 °C" },
        { label: "Runtime", value: "Spectr OS" },
      ],
    },
    enclosure: {
      image: "/images/products/spectr-edge-green.jpg",
      imageAlt: "Spectr Edge enclosure",
    },
  },
  performance: {
    title: "Line-side inference.",
    body: "13 TOPS on the floor. Score what is in front of the camera and hand it to Spectr OS. No round trip. No hosting bill for a foundation model you do not need.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Manufacturing line with on-site vision",
    points: [
      {
        title: "On-site inference",
        body: "Vision and sensing where the work happens.",
      },
      {
        title: "Lower hosting cost",
        body: "A fraction of the cost of hosting large models remotely.",
      },
      {
        title: "Ready for Spectr OS",
        body: "Detections land in the same operational world as the rest of the site.",
      },
    ],
  },
  technology: {
    title: "The same operational world.",
    items: [
      {
        title: "Works with Spectr OS",
        body: "Fuse edge detections into one live model — floor, warehouse, and enterprise.",
        image: "/images/products/spectr-os-ui.png",
        imageAlt: "Spectr OS receiving edge detections",
      },
      {
        title: "Local models",
        body: "Run the model you trained on your SKUs and flows — not a generic remote endpoint.",
        image: "/images/offerings/spectr-mind.jpg",
        imageAlt: "Local inference instead of remote hosting",
      },
      {
        title: "On-prem operations",
        body: "Pilots and production on your machines, next to the work.",
        image: "/images/offerings/pilots.jpg",
        imageAlt: "On-prem operations with local compute",
      },
    ],
  },
  deploy: {
    title: "Where it runs.",
    items: [
      {
        name: "Logistics",
        body: "Yard, dock, and warehouse vision without a public-cloud round trip.",
        image: "/images/industries/logistics.jpg",
        imageAlt: "Warehouse logistics and pallet operations",
      },
      {
        name: "Manufacturing",
        body: "Quality, presence, and exceptions — computed next to the station.",
        image: "/images/industries/manufacturing.jpg",
        imageAlt: "Manufacturing production line",
      },
      {
        name: "Waste management",
        body: "Materials and loads at the kerb and the plant. Spectr OS takes the next action.",
        image: "/images/industries/waste-management.jpg",
        imageAlt: "Collection and materials recovery operations",
      },
    ],
  },
  related: {
    title: "Spectr OS",
    body: "The operating system Edge reports into.",
    href: "/platforms/spectr-os",
    image: "/images/offerings/spectr-os.jpg",
    imageAlt: "Spectr OS",
  },
  ctaTitle: "Run AI vision on site.",
  ctaImage: "/images/offerings/pilots.jpg",
  ctaImageAlt: "On-site operations with Spectr Edge",
} as const;

export type SpectrEdgePage = typeof spectrEdgePage;
