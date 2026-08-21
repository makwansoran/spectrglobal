export const careersOfficeImage = {
  src: "/images/careers/office.png",
  alt: "Spectr team working together in an open office",
} as const;

export const careersNav = [
  { label: "Open Positions", href: "/careers/open-positions" },
  { label: "Getting Hired", href: "/careers/getting-hired" },
  { label: "Students and Early Talent", href: "/careers/students" },
  { label: "Life at Spectr", href: "/careers/life" },
] as const;

export const careersIntro =
  "We are a small team in Norway working on Spectr OS. We hire slowly, for people who want to stay with a hard problem for years rather than quarters.";

export const whoWeAre = [
  {
    id: "floor",
    title: "Work close to the floor",
    text: "We build for warehouses by standing in them. Everyone here spends time on site with the operators using what we ship.",
  },
  {
    id: "ship",
    title: "Ship, then learn",
    text: "A prototype in a real aisle teaches more than a quarter of planning. We favour short loops and honest post-mortems.",
  },
  {
    id: "own",
    title: "Own the whole problem",
    text: "Small team, wide scope. You will cross from model to interface to deployment more often than a job title suggests.",
  },
] as const;

export const hiringAreas = [
  {
    id: "spectr-os",
    name: "Spectr OS",
    summary: "Runtime, decision systems, and agentic workflows",
  },
  {
    id: "backend",
    name: "Backend",
    summary: "Distributed systems, real-time data",
  },
  {
    id: "product",
    name: "Product engineering",
    summary: "Full-stack Spectr OS tooling",
  },
  {
    id: "deployment",
    name: "Deployment",
    summary: "On-site integration and field engineering",
  },
] as const;

export type HiringAreaId = (typeof hiringAreas)[number]["id"];

export const hiringTracks = [
  {
    id: "spectr-os" as const,
    name: "Runtime",
    headline: "The operating system has to hold under a live warehouse.",
    body: "Spectr OS fuses data, decides, and runs agentic workflows in one runtime. This work is systems design against messy, physical truth — not another dashboard.",
  },
  {
    id: "backend" as const,
    name: "Backend",
    headline: "Real-time data, distributed systems, no theatre.",
    body: "The floor does not wait for a batch job. You will build the pipes, models, and services that keep a live operation honest.",
  },
  {
    id: "product" as const,
    name: "Product",
    headline: "Tooling operators will actually use on a Tuesday night.",
    body: "Full-stack Spectr OS work: interfaces, workflows, and the connective tissue between a decision and an action on the aisle.",
  },
  {
    id: "deployment" as const,
    name: "Field",
    headline: "Deployment is the product, not an afterthought.",
    body: "On-site integration with partner warehouses. You stand next to the people running the shift and make the system true to the building.",
  },
];

export type HiringTrackId = (typeof hiringTracks)[number]["id"];

export type CareerRole = {
  id: string;
  title: string;
  team: string;
  location: string;
  type: "Full-time" | "Internship" | "Contract";
  href: string;
};

/** Posted requisitions. Empty until we are ready to fill a role. */
export const openRoles: CareerRole[] = [];

export const hiringLocations = ["Norway", "On-site / hybrid, Nordics"] as const;

export const hiringSteps = [
  {
    index: "01",
    title: "Write to us",
    text: "We do not post roles we are not ready to fill. If your work overlaps with the areas we hire into, send a speculative application anyway — describe something you have built and why it was hard.",
  },
  {
    index: "02",
    title: "A real conversation",
    text: "Speculative applications from strong engineers get read properly. Several of our team joined that way. If there is a fit, we talk about the work, not a script.",
  },
  {
    index: "03",
    title: "A working session",
    text: "A problem close to Spectr OS — runtime, data, product, or deployment — rather than a puzzle with no residue. We want to see how you think when the floor is involved.",
  },
  {
    index: "04",
    title: "Time on site",
    text: "Later stages include time with the team and, where it helps, time in a warehouse. The work is physical. You should see it before you take it.",
  },
] as const;

export const studentTracks = [
  {
    title: "Internships",
    text: "Summer and term-time internships on Spectr OS. You ship into the same runtime as everyone else. No shadow programme.",
  },
  {
    title: "New graduates",
    text: "We hire people early when the work is a match. Title matters less than evidence — a system you built, a deployment you owned, a hard thing you finished.",
  },
  {
    title: "Apprenticeships & fellowships",
    text: "If you are coming from a non-traditional path and have the output to show it, write to us. We read for the work.",
  },
] as const;

export const lifeFacts = [
  { label: "Where", value: "Norway" },
  { label: "Team", value: "Small, on purpose" },
  { label: "Product", value: "Spectr OS" },
  { label: "Stage", value: "Pilot programme" },
] as const;

export const emptyListingsCopy = {
  headline: "No open listings right now.",
  body: "We do not post roles we are not ready to fill. If your work overlaps with the areas listed here, write to us anyway — describe something you have built and why it was hard. Speculative applications from strong engineers get read properly, and several of our team joined that way.",
  join: "Join the team, we are growing fast.",
} as const;
