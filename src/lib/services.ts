export type Service = {
  title: string;
  body: string;
};

export const servicesPage = {
  title: "Our Services",
  body: "Spectr designs and deploys computer vision for production sites — from the workstation next to the camera to the runtime that turns detections into the next move on the floor.",
  homeBody:
    "Computer vision for plants, yards, and floors — scoped to your site, delivered on hardware you own.",
  homeVideo: "/videos/argusone-demo.mp4",
  homeVideoAlt: "Computer vision marking people, a bicycle, and handbags on a cobbled square",
} as const;

export const services: Service[] = [
  {
    title: "Vision deployment",
    body: "Camera paths, workstations, and VisionLab set up for the scenes you actually run — licensed through a meeting, not a public install.",
  },
  {
    title: "On-site detection",
    body: "Models that mark what matters on your stream and keep the track local. Fine-tuned to your floor, light, and motion.",
  },
  {
    title: "Industrial runtime",
    body: "Spectr Smart System above the camera — fuse site data with live detections so a shortage or blocked dock becomes a ranked move.",
  },
  {
    title: "Industry programs",
    body: "Manufacturing, logistics, waste, mining, and related sites. One operating model adapted to the objects and decisions of each domain.",
  },
];
