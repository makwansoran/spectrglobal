export const teamIntro =
  "We are a small team in Norway, working next to the operators Spectr OS is built for. The people here stay with a hard problem for years, not quarters.";

export const team = [
  {
    name: "Makwan Soran Ismail",
    role: "Founder & Chief Executive Officer",
    location: "Norway",
    bio: "Founded Spectr to put an operating system on warehouse and industrial floors — not another dashboard. Sets product direction around a truthful, continuously updated model of a live site: where stock is, how aisles behave, and what a competent operator does when Tuesday afternoon goes wrong.",
    experience: [
      { label: "Role", value: "Founder, CEO, and board chair of Spectr AS" },
      { label: "Focus", value: "Spectr OS — given to enterprises without a licence fee, user cap, or expiry date" },
      { label: "Practice", value: "Builds from Norway, on the floor with the people running the shift" },
    ],
  },
] as const;

export const teamExperience = [
  {
    id: "floor",
    title: "Work close to the floor",
    text: "We build for warehouses by standing in them. Everyone here spends time on site with the operators using what we ship.",
  },
  {
    id: "model",
    title: "A model of a real site",
    text: "The hard part is not visualisation. It is a continuously updated picture of stock, aisles, exceptions, and the decisions that close them.",
  },
  {
    id: "own",
    title: "Own the whole problem",
    text: "Small team, wide scope — from ontology to interface to a runtime that has to be true on a Tuesday afternoon.",
  },
] as const;
