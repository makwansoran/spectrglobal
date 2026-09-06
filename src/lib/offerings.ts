export type Offering = {
  title: string;
  body: string;
  href: string;
};

export const offeringsPage = {
  title: "Offerings",
  body: "Spectr OS is used across manufacturing, logistics, and waste to help organisations implement an operating system for the hardest work on the floor.",
} as const;

export const offerings: Offering[] = [
  {
    title: "Spectr OS",
    body: "The operating system for the enterprise. Fuse data, decide, and act in one runtime.",
    href: "/platforms/spectr-os",
  },
  {
    title: "Ontology",
    body: "A full-fidelity representation of the business — shared by people, models, and software.",
    href: "/products/ontology",
  },
  {
    title: "Agentic runtime",
    body: "Go beyond chat. Agents that propose real work, with a human still on the approval.",
    href: "/products/agents",
  },
  {
    title: "Command",
    body: "Ranked decisions with evidence — for operations that cannot wait on a morning report.",
    href: "/products/command",
  },
  {
    title: "Deploy",
    body: "Stand the runtime up across cloud, on-prem, and the edge. Monitor it. Keep it current.",
    href: "/products/deploy",
  },
  {
    title: "Manufacturing",
    body: "Strategy, materials, and the shop floor as one model — at the speed of the line.",
    href: "/use-cases/manufacturing",
  },
  {
    title: "Logistics",
    body: "Planning and execution in one runtime. Inventory, yards, and disruption handled as they happen.",
    href: "/use-cases/logistics",
  },
  {
    title: "Waste Management",
    body: "Collection, plants, and materials as one loop, so a lift is an operational decision.",
    href: "/use-cases/waste-management",
  },
];
