import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type ProductKind = "uav" | "software";

export type Product = {
  slug: string;
  kind: ProductKind;
  name: string;
  tagline: Localized;
  description: Localized;
  category: Localized;
  use: Localized;
  year: number;
  flightTime?: Localized;
  location: Localized;
  price: Localized;
  availability: Localized;
  range?: Localized;
  heroImage: string;
  heroAlt: Localized;
  gallery: { src: string; alt: Localized }[];
  highlights: Localized<string[]>;
  capabilities: { title: Localized; text: Localized }[];
  sectionTitle: Localized;
  sectionExtra?: Localized;
  specifications: { label: Localized; value: Localized }[];
  equipment: { label: Localized; value: Localized }[];
};

export const products: Product[] = [
  {
    slug: "valkyrie",
    kind: "uav",
    name: "VALKYRIE",
    tagline: {
      en: "An affordable, highly effective, long-range reconnaissance UAV for field awareness and operational intelligence.",
      no: "En rimelig, svært effektiv rekognoserings-UAV med lang rekkevidde for feltbevissthet og operasjonell etterretning.",
    },
    description: {
      en: "VALKYRIE is a mission-configurable reconnaissance UAV built for observation, field awareness, and operational intelligence. It is designed to be affordable to field, highly effective in information gathering, and capable of long-range operation when configured for the task.",
      no: "VALKYRIE er en oppdragskonfigurerbar rekognoserings-UAV bygget for observasjon, feltbevissthet og operasjonell etterretning. Den er designet for å være rimelig å ta i bruk, svært effektiv i informasjonsinnhenting og i stand til lang rekkevidde når den konfigureres for oppgaven.",
    },
    category: { en: "UAV", no: "UAV" },
    use: { en: "Reconnaissance", no: "Rekognosering" },
    year: 2026,
    flightTime: { en: "Configured per mission", no: "Konfigurert per oppdrag" },
    location: { en: "Built to order", no: "Bygges på bestilling" },
    price: { en: "Contact for pricing", no: "Kontakt for pris" },
    availability: { en: "Available by request", no: "Tilgjengelig på forespørsel" },
    range: { en: "Long-range, configured per mission", no: "Lang rekkevidde, konfigurert per oppdrag" },
    heroImage: "/valkyrie-hero.png",
    heroAlt: {
      en: "VALKYRIE UAV over mountain terrain",
      no: "VALKYRIE UAV over fjellterreng",
    },
    gallery: [
      {
        src: "/valkyrie-front.png",
        alt: { en: "VALKYRIE front view", no: "VALKYRIE frontvisning" },
      },
      {
        src: "/valkyrie-top.png",
        alt: { en: "VALKYRIE top view", no: "VALKYRIE topvisning" },
      },
      {
        src: "/valkyrie-mountain.png",
        alt: { en: "VALKYRIE in mountain terrain", no: "VALKYRIE i fjellterreng" },
      },
    ],
    highlights: {
      en: [
        "Cost-effective to field",
        "Highly effective reconnaissance",
        "Long-range operation",
        "Sensor payload ready",
        "Field-serviceable setup",
        "Operator support",
      ],
      no: [
        "Rimelig å ta i bruk",
        "Svært effektiv rekognosering",
        "Lang rekkevidde",
        "Klar for sensor-nyttelast",
        "Feltvedlikeholdbart oppsett",
        "Operatørstøtte",
      ],
    },
    capabilities: [
      {
        title: { en: "Cost-effective", no: "Rimelig" },
        text: {
          en: "Cheap to field and sustain relative to comparable mission platforms, without sacrificing operational readiness.",
          no: "Rimelig å ta i bruk og drifte sammenlignet med tilsvarende oppdragsplattformer, uten å ofre operasjonell klarhet.",
        },
      },
      {
        title: { en: "Highly effective", no: "Svært effektiv" },
        text: {
          en: "Built for reconnaissance, observation, and operator-controlled field awareness workflows.",
          no: "Bygget for rekognosering, observasjon og operatørstyrt feltbevissthet.",
        },
      },
      {
        title: { en: "Long range", no: "Lang rekkevidde" },
        text: {
          en: "Configured for long-range operation so teams can cover distance without redesigning the platform per mission.",
          no: "Konfigurert for lang rekkevidde slik at team kan dekke avstand uten å redesigne plattformen per oppdrag.",
        },
      },
    ],
    sectionTitle: {
      en: "Built for reconnaissance missions.",
      no: "Bygget for rekognoseringsoppdrag.",
    },
    sectionExtra: {
      en: "VALKYRIE is affordable to field, highly effective in reconnaissance, and built for long-range operation — aligning sensing requirements, operator workflow, and field support around each deployment.",
      no: "VALKYRIE er rimelig å ta i bruk, svært effektiv i rekognosering og bygget for lang rekkevidde — med sensorbehov, operatørflyt og feltstøtte tilpasset hver deployering.",
    },
    specifications: [
      { label: { en: "Platform", no: "Plattform" }, value: { en: "VTOL fixed-wing UAV", no: "VTOL fastvinge-UAV" } },
      {
        label: { en: "Layout", no: "Layout" },
        value: {
          en: "Tricopter VTOL with front tilt motors and rear stationary motor",
          no: "Tricopter VTOL med fremre tiltmotorer og bakre stasjonær motor",
        },
      },
      { label: { en: "Wingspan", no: "Vingespenn" }, value: { en: "1340 mm", no: "1340 mm" } },
      { label: { en: "Length", no: "Lengde" }, value: { en: "990 mm", no: "990 mm" } },
      { label: { en: "All-up weight", no: "Totalvekt" }, value: { en: "2000-3000 g", no: "2000-3000 g" } },
      { label: { en: "Optimal speed", no: "Optimal hastighet" }, value: { en: "60-70 km/h", no: "60-70 km/h" } },
      {
        label: { en: "Use case", no: "Bruksområde" },
        value: {
          en: "Reconnaissance, observation, field awareness, and operational intelligence",
          no: "Rekognosering, observasjon, feltbevissthet og operasjonell etterretning",
        },
      },
    ],
    equipment: [
      {
        label: { en: "Payload", no: "Nyttelast" },
        value: {
          en: "Configured for sensing and observation requirements",
          no: "Konfigurert for sensor- og observasjonskrav",
        },
      },
      { label: { en: "Material", no: "Materiale" }, value: { en: "LW-PLA + PETG", no: "LW-PLA + PETG" } },
      { label: { en: "Print bed", no: "Printplate" }, value: { en: "Minimum 220 x 220 mm", no: "Minimum 220 x 220 mm" } },
      {
        label: { en: "Control link", no: "Kontrolllenke" },
        value: { en: "Specified during procurement", no: "Spesifiseres ved innkjøp" },
      },
      {
        label: { en: "Support", no: "Støtte" },
        value: { en: "Setup guidance and operator support available", no: "Oppsettveiledning og operatørstøtte tilgjengelig" },
      },
    ],
  },
  {
    slug: "centurion",
    kind: "software",
    name: "CENTURION",
    tagline: {
      en: "Command dashboard for monitoring missions and coordinating field activity.",
      no: "Kommandodashbord for overvåking av oppdrag og koordinering av feltaktivitet.",
    },
    description: {
      en: "CENTURION is designed for operators who need mission context, map data, live feeds, and coordination tools to stay close together during real-world activity.",
      no: "CENTURION er designet for operatører som trenger oppdragskontekst, kartdata, live-feeds og koordineringsverktøy samlet under reell aktivitet.",
    },
    category: { en: "Software", no: "Programvare" },
    use: { en: "Command & control", no: "Kommando og kontroll" },
    year: 2026,
    location: { en: "Available by request", no: "Tilgjengelig på forespørsel" },
    price: { en: "Contact for pricing", no: "Kontakt for pris" },
    availability: { en: "Available by request", no: "Tilgjengelig på forespørsel" },
    heroImage: "/centurion-laptop-mockup.png",
    heroAlt: {
      en: "CENTURION command dashboard on laptop",
      no: "CENTURION kommandodashbord på laptop",
    },
    gallery: [
      {
        src: "/centurion-laptop-mockup.png",
        alt: { en: "CENTURION dashboard", no: "CENTURION dashbord" },
      },
      {
        src: "/operations-hq.jpg",
        alt: { en: "Spectr operations workspace", no: "Spectr operasjonsarbeidsplass" },
      },
    ],
    highlights: {
      en: ["Mission overview", "Live coordination", "Operational control"],
      no: ["Oppdragsoversikt", "Live koordinering", "Operasjonell kontroll"],
    },
    capabilities: [
      {
        title: { en: "Mission overview", no: "Oppdragsoversikt" },
        text: {
          en: "Keep map context, assets, and field activity visible in one operational view.",
          no: "Hold kartkontekst, ressurser og feltaktivitet synlig i én operasjonell visning.",
        },
      },
      {
        title: { en: "Live coordination", no: "Live koordinering" },
        text: {
          en: "Support teams with shared situational awareness across mission planning and execution.",
          no: "Støtt team med delt situasjonsforståelse gjennom planlegging og gjennomføring.",
        },
      },
      {
        title: { en: "Operational control", no: "Operasjonell kontroll" },
        text: {
          en: "Bring drone feeds, mission layers, and decision context into a focused command interface.",
          no: "Samle drone-feeds, oppdragslag og beslutningskontekst i ett fokusert kommandogrensesnitt.",
        },
      },
    ],
    sectionTitle: {
      en: "Built for field command.",
      no: "Bygget for feltkommando.",
    },
    sectionExtra: {
      en: "The interface supports aerial operations by keeping the operational picture clear, readable, and ready for teams working under time pressure.",
      no: "Grensesnittet støtter luftoperasjoner ved å holde det operasjonelle bildet klart, lesbart og klart for team under tidspress.",
    },
    specifications: [
      { label: { en: "Platform", no: "Plattform" }, value: { en: "Web command dashboard", no: "Web-basert kommandodashbord" } },
      { label: { en: "Use case", no: "Bruksområde" }, value: { en: "Mission monitoring and coordination", no: "Oppdragsovervåking og koordinering" } },
      { label: { en: "Deployment", no: "Deployering" }, value: { en: "Customer-specific rollout", no: "Kundespesifikk utrulling" } },
    ],
    equipment: [
      {
        label: { en: "Integration", no: "Integrasjon" },
        value: { en: "Configured with mission and platform requirements", no: "Konfigurert med oppdrag- og plattformkrav" },
      },
      {
        label: { en: "Support", no: "Støtte" },
        value: { en: "Onboarding and operator guidance available", no: "Onboarding og operatørveiledning tilgjengelig" },
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function pickProductField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}

// Backwards-compatible exports used by older imports
export const objects = products;
export const getObject = getProduct;
