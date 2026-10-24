export type Service = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};

export const servicesPage = {
  title: "Our Services",
  body: "Spectr designs and deploys computer vision for production sites — from the workstation next to the camera to the runtime that turns detections into the next move on the floor.",
  homeBody:
    "Computer vision for plants, yards, and floors — scoped to your site, delivered on hardware you own.",
  homeVideo: "/videos/argusone-demo.mp4",
  homeVideoAlt: "Computer vision marking people, a bicycle, and handbags on a cobbled square",
  productionImage: "/images/services-production.jpg",
  productionImageAlt:
    "Spectr workstation and edge hardware on site, with live camera feeds and an industrial floor beyond the window",
} as const;

export const services: Service[] = [
  {
    title: "See the production",
    body: "We start on your floor — not in a deck. We walk the lines, yards, and docks with your operators, map which cameras already exist, where the light fails, and which objects actually decide the shift. The goal is a clear picture of the work: what must be seen, what can stay ignored, and where a model would earn its place before we install anything.",
    image: "/images/industries/waste-management.jpg",
    imageAlt: "Sorting plant conveyors and trommel with workers on the floor",
  },
  {
    title: "Implement VisionLab",
    body: "Next we put VisionLab on the hardware you already run. We wire your existing cameras and workstations, keep every stream on the local network, and sit the app next to the floor so operators can open a feed without a cloud round-trip. No public package install — the deployment is scoped in a meeting and provisioned for your machines.",
    image: "/visionlab-app.jpg",
    imageAlt: "VisionLab interface with vision masks on a street scene",
  },
  {
    title: "Train on your production",
    body: "We train and fine-tune on footage from your site — hard light, dust, motion, and the classes that matter on your shift. Checkpoints stay on hardware you own until the track is honest on your scenes, not a generic demo. You review the call with us until operators trust what the model marks.",
    image: "/argusone.jpg",
    imageAlt: "Detection overlays marking people and objects in a live scene",
  },
  {
    title: "Let it go",
    body: "Then we hand the loop over: detection running on your machines, operators checking the call, and exports ready for the next system when you need them. When planning and execution should run as one, Spectr Smart System sits above the camera path so a shortage or blocked dock becomes a ranked move — not a report the next morning.",
    image: "/images/industries/manufacturing.jpg",
    imageAlt: "Production line under automated inspection once vision is running on site",
  },
  {
    title: "Custom hardware",
    body: "Not every site has the right box next to the camera. We also design and integrate custom edge hardware — gateways, antennas, and camera paths — so VisionLab and the model land on gear that fits your plant, yard, or collection loop. Integrations follow the site you already operate, not a one-size rack.",
    image: "/images/spectr-smart-system.jpg",
    imageAlt: "Spectr Smart System edge hardware with antenna",
  },
];
