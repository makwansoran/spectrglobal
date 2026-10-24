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
  productionImage: "/images/services-production.jpg",
  productionImageAlt:
    "Spectr workstation and edge hardware on site, with live camera feeds and an industrial floor beyond the window",
} as const;

export const services: Service[] = [
  {
    title: "See the production",
    body: "We come on site, walk the floor, and learn how your cameras, lines, and shifts actually run — before a single model is installed.",
  },
  {
    title: "Implement VisionLab",
    body: "Next we put VisionLab on your existing cameras and hardware. Streams stay local; the workstation sits next to the floor you already have.",
  },
  {
    title: "Train on your production",
    body: "We train and fine-tune models on your scenes — light, dust, motion, and the objects that matter on your shift — until the track is honest.",
  },
  {
    title: "Let it go",
    body: "Then we hand it over: detection running on your machines, operators checking the call, and a path into Spectr Smart System when you are ready to act.",
  },
  {
    title: "Custom hardware",
    body: "We also offer custom hardware integrations — gateways, edge boxes, and camera paths wired to the site you already operate.",
  },
];
