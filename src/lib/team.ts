export const teamIntro =
  "Three founders in Norway, working next to the operators Spectr OS is built for.";

export const team = [
  {
    name: "Makwan Soran Ismail",
    role: "Founder & Chief Executive Officer",
    location: "Norway",
    bio: "Founded Spectr to put an operating system on warehouse and industrial floors — not another dashboard. Sets product direction around a truthful, continuously updated model of a live site.",
    experience: [
      { label: "Software", value: "Five years building software, including ethical hacking, penetration testing, HackerOne, and automation systems" },
      { label: "Role", value: "Founder, CEO, and board chair of Spectr AS" },
      { label: "Practice", value: "Builds from Norway, on the floor with the people running the shift" },
    ],
  },
  {
    name: "Phillip Peter",
    role: "Co-founder",
    location: "Norway",
    bio: "Makes the physical side of the problem real: machines, tooling, and the shop floor. Spectr OS has to run in a building that already has conveyors, racks, and wear — he knows how those things are built.",
    experience: [
      { label: "Machines", value: "CNC, 3D printers, and building production kit from the ground up" },
      { label: "Floor", value: "Technician at Ryde; Assembly Technician / Mechatronics at Magtrack, a defence contractor" },
      { label: "Focus", value: "Physical systems that the software has to be true to" },
    ],
  },
  {
    name: "Aleksander Soboh Byfuglien",
    role: "Co-founder",
    location: "Norway",
    bio: "Brings electronics into the operating system: sensors, boards, and the hardware layer between a model of the site and the machines that move stock.",
    experience: [
      { label: "Electronics", value: "Soldering, PCB design, and building boards as both craft and product" },
      { label: "Systems", value: "Hardware that has to hold up next to the software, not in a lab" },
      { label: "Focus", value: "The physical interface between Spectr OS and the floor" },
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
