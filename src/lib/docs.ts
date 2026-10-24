export type DocsBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; label?: string; content: string }
  | { type: "note"; text: string }
  | { type: "link"; href: string; label: string };

export type DocsHeading = {
  id: string;
  title: string;
  blocks: DocsBlock[];
};

export type DocsPage = {
  slug: string;
  title: string;
  description: string;
  headings: DocsHeading[];
};

export type DocsNavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const docsPages: DocsPage[] = [
  {
    slug: "overview",
    title: "Documentation",
    description: "How Spectr’s camera app and industrial system fit together.",
    headings: [
      {
        id: "what-you-get",
        title: "What you get",
        blocks: [
          {
            type: "p",
            text: "Spectr ships layers you can use alone or together: VisionLab on the machine, and Spectr Smart System as the industrial runtime that turns detections into operational decisions.",
          },
          {
            type: "ul",
            items: [
              "VisionLab — open a camera stream and run vision on hardware you control.",
              "Spectr Smart System — fuse site data and act across the floor.",
            ],
          },
        ],
      },
      {
        id: "how-to-start",
        title: "How to start",
        blocks: [
          {
            type: "p",
            text: "Most teams begin with a VisionLab meeting for the workstation next to the camera. When the site needs planning and execution in one place, Spectr Smart System sits above the camera path.",
          },
          {
            type: "note",
            text: "Weights and streams stay on machines you own. Nothing in this stack requires a cloud round-trip for inference.",
          },
        ],
      },
      {
        id: "choose-a-path",
        title: "Choose a path",
        blocks: [
          {
            type: "ul",
            items: [
              "Need a camera workstation on site → start with a VisionLab meeting.",
              "Running a plant, yard, or collection loop → start with Spectr Smart System.",
              "Need a scoped engagement for your floor → see Our Services.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "visionlab",
    title: "VisionLab",
    description: "The app for the camera. Open a stream, run vision, and keep the track on your own machine.",
    headings: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "p",
            text: "VisionLab is the desktop app for Spectr vision. It connects to a camera or file stream, runs detection locally, and shows the track without sending frames off-site. It is sold through a meeting with Spectr — not a public package install.",
          },
        ],
      },
      {
        id: "get-visionlab",
        title: "Get VisionLab",
        blocks: [
          {
            type: "p",
            text: "VisionLab is not a public download. It is licensed through a meeting with Spectr — we scope the site, the cameras, and the workstation, then deliver the app for hardware you own.",
          },
          {
            type: "ul",
            items: [
              "Book a meeting to discuss your floor, streams, and deployment.",
              "We provision VisionLab for the machines next to your cameras.",
              "Inference stays local; frames never leave the site unless you export them.",
            ],
          },
        ],
      },
      {
        id: "open-a-stream",
        title: "Open a stream",
        blocks: [
          {
            type: "p",
            text: "Once VisionLab is on your workstation, pick a camera or video source and start the session. The preview shows the live frame before you attach a model.",
          },
          {
            type: "ul",
            items: [
              "USB and IP cameras supported on the local network.",
              "File playback for offline review of recorded footage.",
              "One stream per session so the track stays tied to a single source.",
            ],
          },
        ],
      },
      {
        id: "run-detection",
        title: "Run detection",
        blocks: [
          {
            type: "p",
            text: "Attach an open model from the VisionLab catalog to the open stream — Ultralytics, Meta, and others. VisionLab loads the weights, runs inference on each frame, and draws the track in the viewer.",
          },
          {
            type: "code",
            label: "Session",
            content: "Open stream → Load model → Start track",
          },
        ],
      },
      {
        id: "keep-it-local",
        title: "Keep it local",
        blocks: [
          {
            type: "p",
            text: "Frames, checkpoints, and tracks remain on the host. Export only what you choose — a clip, a log, or a fine-tuned weight.",
          },
        ],
      },
    ],
  },
  {
    slug: "smart-system",
    title: "Spectr Smart System",
    description:
      "The industrial runtime that turns camera signal and site data into the next operational decision.",
    headings: [
      {
        id: "overview",
        title: "Overview",
        blocks: [
          {
            type: "p",
            text: "Spectr Smart System is the layer above the camera. It fuses detections with plant, yard, or collection data so a lift, a shortage, or a blocked dock becomes a ranked move — not a report the next morning.",
          },
        ],
      },
      {
        id: "what-it-runs",
        title: "What it runs",
        blocks: [
          {
            type: "ul",
            items: [
              "Data fusion across MES, WMS, TMS, and the live camera path.",
              "Decisioning on the objects of the floor — bins, pallets, stations, crews.",
              "Agentic workflows with a person still approving the move.",
            ],
          },
        ],
      },
      {
        id: "with-visionlab",
        title: "With VisionLab",
        blocks: [
          {
            type: "p",
            text: "VisionLab feeds the Smart System. The app and model stay on the edge; the runtime consumes tracks and site state to re-sequence work as the shift runs.",
          },
        ],
      },
      {
        id: "industries",
        title: "Industries",
        blocks: [
          {
            type: "p",
            text: "The same system model covers manufacturing, logistics, waste management, and related sites. Each industry page describes the objects and decisions for that domain.",
          },
          {
            type: "ul",
            items: [
              "Manufacturing — line, materials, and labour as one model.",
              "Logistics — inventory, yards, and carriers without the seam.",
              "Waste management — collection, plants, and materials as one loop.",
            ],
          },
        ],
      },
      {
        id: "spectr-os",
        title: "Spectr OS",
        blocks: [
          {
            type: "p",
            text: "Spectr OS is the product surface for Spectr Smart System — one runtime for the floor, the model, and the next decision. Open the Spectr OS page when you want the full platform walkthrough.",
          },
        ],
      },
    ],
  },
];

export const docsNav: DocsNavItem[] = [
  {
    label: "Overview",
    href: "/developers",
  },
  {
    label: "VisionLab",
    href: "/developers/visionlab",
    children: [
      { label: "Overview", href: "/developers/visionlab#overview" },
      { label: "Get VisionLab", href: "/developers/visionlab#get-visionlab" },
      { label: "Open a stream", href: "/developers/visionlab#open-a-stream" },
      { label: "Run detection", href: "/developers/visionlab#run-detection" },
      { label: "Keep it local", href: "/developers/visionlab#keep-it-local" },
    ],
  },
  {
    label: "Spectr Smart System",
    href: "/developers/smart-system",
    children: [
      { label: "Overview", href: "/developers/smart-system#overview" },
      { label: "What it runs", href: "/developers/smart-system#what-it-runs" },
      { label: "With VisionLab", href: "/developers/smart-system#with-visionlab" },
      { label: "Industries", href: "/developers/smart-system#industries" },
      { label: "Spectr OS", href: "/developers/smart-system#spectr-os" },
    ],
  },
];

export function getDocsPage(slug: string) {
  return docsPages.find((page) => page.slug === slug);
}

export function getDocsSlugs() {
  return docsPages.filter((page) => page.slug !== "overview").map((page) => page.slug);
}
