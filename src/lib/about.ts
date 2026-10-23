import { site } from "@/lib/site";

export const aboutPage = {
  title: "About us",
  belief: "Machines should see the world clearly enough to act, and people should be able to check the call.",
  heroImage: "/images/about-oslo.jpg",
  heroImageAlt: "Oslo skyline from the hillside at golden hour",
  statement:
    "Spectr is an AI lab in Oslo. We specialize in computer vision for production facilities — plants, yards, and floors where a camera has to earn its place in the shift.",
  body: [
    "Most vision stacks stop at a box on a frame. The sites we care about need the next step: what the camera saw, what it means, and what should happen on the floor.",
    "We build open models and the software around them — VisionLab on the workstation, Argus on the stream, and Spectr Smart System when planning and execution have to run as one loop.",
    "We stay close to the scenes the models have to survive: hard light, dust, motion, and operators who need to trust the call.",
  ],
  founder: {
    name: "Makwan Soran",
    role: "CEO & Founder",
    image: "/images/about-founder.jpg",
    imageAlt: "Makwan Soran, CEO and Founder of Spectr",
    email: site.email,
    phone: site.phone,
    phoneHref: site.phoneHref,
  },
  office: {
    label: "AI lab · Oslo",
    place: "Bitraf",
    address: "Brenneriveien 9, 0182 Oslo",
    mapEmbedSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=10.7495%2C59.9185%2C10.7562%2C59.9217&layer=mapnik&marker=59.9200782%2C10.7528524",
    mapLink: "https://www.openstreetmap.org/?mlat=59.9200782&mlon=10.7528524#map=18/59.9200782/10.7528524",
    mapTitle: "Map of Spectr at Bitraf, Brenneriveien 9, Oslo",
  },
} as const;
