export type Offering = {
  title: string;
  body: string;
};

export const offeringsPage = {
  title: "Offerings",
  body: "Spectr OS is used across manufacturing, logistics, waste, and mining to help organisations implement an operating system for the hardest work on the floor.",
} as const;

export const offerings: Offering[] = [
  {
    title: "Manufacturing",
    body: "Strategy, materials, and the shop floor as one model — at the speed of the line.",
  },
  {
    title: "Logistics",
    body: "Planning and execution in one runtime. Inventory, yards, and disruption handled as they happen.",
  },
  {
    title: "Waste Management",
    body: "Collection, plants, and materials as one loop, so a lift is an operational decision.",
  },
  {
    title: "Mining",
    body: "Pit, plant, and materials as one model — fleets, grades, and recovery handled as the shift runs.",
  },
];
