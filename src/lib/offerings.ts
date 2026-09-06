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
