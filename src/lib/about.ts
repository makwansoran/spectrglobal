export const aboutPage = {
  title: "Why We're Here",
  belief: "We believe in augmenting human operators, not replacing the judgment that keeps a floor safe.",
  heroImage: "/images/industries/warehousing.jpg",
  heroImageAlt: "Warehouse floor and racking under industrial light",
  statement:
    "With a truthful model of the site and the right software, people can still solve hard operational problems — and change how physical work gets done.",
  founding: [
    "When we looked at warehouse and industrial software, we saw systems that were too rigid for the way a real site behaves on a Tuesday afternoon, and custom projects that took too long to deploy and too many services to keep alive.",
    "We saw dashboards that described yesterday, integrations that broke on every edge case, and automation that failed when the aisle looked different from the training set.",
    "We saw a need for a different kind of technology — an operating system for the enterprise floor — and we knew it would take a different kind of company to build it. That is why we founded Spectr.",
  ],
  whatWeDoTitle: "What we do",
  whatWeDo: [
    {
      title: "We build Spectr OS for human-driven work with real-world data",
      paragraphs: [
        "Spectr is a Norwegian software company. Our product is Spectr OS — the operating system for warehouses, plants, terminals, and other environments where labour is scarce and decisions cannot wait on a morning report.",
        "We focus on a truthful, continuously updated model of the working site: where stock sits, how aisles behave, what breaks, and what a competent operator does next. On that model we layer applications for interactive, machine-assisted analysis and action.",
      ],
    },
    {
      title: "We work where the problems live",
      paragraphs: [
        "Our customers have the domain. We have the runtime, the ontology, and an engineering mindset.",
        "We put software on the floor — deploying Spectr OS, integrating live data, tightening workflows, and producing operational results in weeks, not years.",
      ],
    },
  ],
  expertiseTitle: "Our expertise",
  expertise: [
    {
      title: "Operational ontology",
      body: "Orders, beds, berths, compressors, aisles — named once and shared across people, models, and software so decisions refer to the same world.",
    },
    {
      title: "Agentic runtime",
      body: "Agents with tools, proposals with evidence, and humans in the loop. Autonomy that can be inspected before it touches a live site.",
    },
    {
      title: "Command and deploy",
      body: "Ranked decisions with provenance, and a runtime that stands up across cloud, on-prem, and edge without rebuilding the warehouse to install software.",
    },
    {
      title: "Floor-first delivery",
      body: "We build close to operators. Everyone here spends time on site with the people using what we ship.",
    },
  ],
  startedTitle: "How we started",
  started: [
    "Spectr began in Norway with a simple conviction: the bottleneck in industrial intelligence is not another chart. It is the absence of a living model of a real working environment.",
    "That model does not come from a lab. It comes from software running a real warehouse. So we built Spectr OS — the runtime that holds the model, the actions, and the record of why a decision was made.",
    "We stay small on purpose. Close to the floor. Unwilling to ship something merely interesting.",
  ],
  futureTitle: "Where we're going",
  futureLead: "Our future is automation and robotics — guided by Spectr OS, not bolted on as a black box.",
  future: [
    "Organisations already use Spectr OS to see the site truthfully and act with evidence. The next decade is about closing the loop: software that proposes, robots and automation that execute, and operators who remain in command of what matters.",
    "We are building toward a future where warehouses, plants, and logistics estates can run with fewer empty shifts and fewer silent failures — where automation and robotics are orchestrated by the same ontology that people trust, and every consequential act leaves a record.",
    "That is the company we are building: software for the work that cannot be done remotely, and a path from today's operator advantage to tomorrow's automated floor.",
  ],
} as const;
