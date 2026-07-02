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
    slug: "recon",
    kind: "uav",
    name: "RECON",
    tagline: {
      en: "Long-range, autonomous ISR platform for continuous surveillance without ground infrastructure or GPS dependency.",
      no: "Langtrekkende, autonom ISR-plattform for kontinuerlig overvåking uten bakkeinfrastruktur og uten GPS-avhengighet.",
    },
    description: {
      en: "RECON is a VTOL fixed-wing ISR platform designed for continuous surveillance over large areas without ground infrastructure and without GPS dependency. The operator defines the mission in Centurion. RECON takes off vertically, transitions to efficient wing-borne cruise, executes the mission autonomously, and returns — even when GPS and communications are down.",
      no: "RECON er en VTOL fastvinge-ISR-plattform designet for kontinuerlig overvåking over store områder, uten infrastruktur på bakken og uten avhengighet av GPS. Operatøren definerer oppdraget i Centurion. RECON tar av vertikalt, går over i effektiv vingebåren cruise, utfører oppdraget autonomt og returnerer — selv når GPS og samband er nede.",
    },
    category: { en: "ISR", no: "ISR" },
    use: { en: "Intelligence, surveillance & reconnaissance", no: "Etterretning, overvåking og rekognosering" },
    year: 2026,
    flightTime: { en: "2–4 hours cruise endurance (target)", no: "2–4 timer cruise utholdenhet (mål)" },
    location: { en: "Produced in Norway", no: "Produsert i Norge" },
    price: { en: "From ~50k NOK", no: "Fra ca. 50k NOK" },
    availability: { en: "Prototype — ground testing ongoing", no: "Prototype — bakketesting pågår" },
    range: { en: "50–100 km operating radius (target)", no: "50–100 km operasjonsradius (mål)" },
    heroImage: "/recon-hero.png",
    heroAlt: {
      en: "RECON UAV over mountain terrain",
      no: "RECON UAV over fjellterreng",
    },
    gallery: [
      {
        src: "/recon-front.png",
        alt: { en: "RECON front view", no: "RECON frontvisning" },
      },
      {
        src: "/recon-top.png",
        alt: { en: "RECON top view", no: "RECON topvisning" },
      },
      {
        src: "/recon-mountain.png",
        alt: { en: "RECON in mountain terrain", no: "RECON i fjellterreng" },
      },
    ],
    highlights: {
      en: [
        "Autonomous ISR",
        "GNSS-denied navigation",
        "EW-resilient communications",
        "VTOL fixed-wing platform",
        "50–100 km operating radius",
        "Produced in Norway",
      ],
      no: [
        "Autonom ISR",
        "GNSS-nektet navigasjon",
        "EW-motstandsdyktig kommunikasjon",
        "VTOL fastvinge-plattform",
        "50–100 km operasjonsradius",
        "Produsert i Norge",
      ],
    },
    capabilities: [
      {
        title: { en: "Multi-layer positioning", no: "Flerlagsbasert posisjonering" },
        text: {
          en: "Visual-Inertial Odometry, terrain-referenced navigation, and tactical-grade INS provide continuous position without external signals.",
          no: "Visual-Inertial Odometry, terrengreferert navigasjon og taktisk-grad INS gir kontinuerlig posisjon uten eksterne signaler.",
        },
      },
      {
        title: { en: "Resilient communications", no: "Resiliente samband" },
        text: {
          en: "Frequency-hopping encrypted radio with mesh redundancy. On link loss, the mission continues or the platform returns autonomously.",
          no: "Frekvenshoppende, kryptert radio med mesh-redundans. Ved taps av samband fortsetter oppdraget eller returnerer plattformen autonomt.",
        },
      },
      {
        title: { en: "Autonomous ISR", no: "Autonom ISR" },
        text: {
          en: "VTOL takeoff, wing-borne cruise, and autonomous mission execution defined and monitored through Centurion.",
          no: "VTOL-start, vingebåren cruise og autonom oppdragsgjennomføring definert og overvåket via Centurion.",
        },
      },
    ],
    sectionTitle: {
      en: "Built for the comms-denied battlefield.",
      no: "Bygget for et samband-nektet slagfelt.",
    },
    sectionExtra: {
      en: "The first thing an adversary does in modern conflict is disable GPS and jam communications. RECON is designed from first principles to continue the mission when everything else fails.",
      no: "Det første motstanderen gjør i moderne konflikt er å slå ut GPS og jamme kommunikasjon. RECON er designet fra første prinsipper for å fortsette oppdraget når alt annet faller ut.",
    },
    specifications: [
      { label: { en: "Platform", no: "Plattform" }, value: { en: "VTOL fixed-wing ISR platform", no: "VTOL fastvinge-ISR-plattform" } },
      { label: { en: "Wingspan", no: "Vingespenn" }, value: { en: "1.55 m", no: "1.55 m" } },
      { label: { en: "MTOW", no: "MTOW" }, value: { en: "5–8 kg", no: "5–8 kg" } },
      {
        label: { en: "Material", no: "Materiale" },
        value: { en: "Vacuum-formed carbon fiber composite", no: "Vakuumformet karbonfiber-kompositt" },
      },
      {
        label: { en: "Cruise endurance", no: "Cruise utholdenhet" },
        value: { en: "2–4 hours (target)", no: "2–4 timer (mål)" },
      },
      {
        label: { en: "Operating radius", no: "Operasjonsradius" },
        value: { en: "50–100 km (target)", no: "50–100 km (mål)" },
      },
      {
        label: { en: "Cruise speed", no: "Cruise hastighet" },
        value: { en: "60–90 km/h (target)", no: "60–90 km/t (mål)" },
      },
      {
        label: { en: "Max altitude", no: "Maksimal høyde" },
        value: { en: "3,000 m (target)", no: "3 000 m (mål)" },
      },
      {
        label: { en: "Use case", no: "Bruksområde" },
        value: {
          en: "Continuous ISR surveillance in GNSS-denied and comms-denied environments",
          no: "Kontinuerlig ISR-overvåking i GNSS-nektede og samband-nektede miljøer",
        },
      },
    ],
    equipment: [
      {
        label: { en: "Payload", no: "Nyttelast" },
        value: {
          en: "EO/IR gimbal, 1–1.5 kg total (FLIR Boson + Sony block, 300–500 g gimbal)",
          no: "EO/IR-gimbal, 1–1,5 kg totalt (FLIR Boson + Sony block, 300–500 g gimbal)",
        },
      },
      {
        label: { en: "Control link", no: "Kontrolllenke" },
        value: {
          en: "Frequency-hopping encrypted radio with mesh redundancy",
          no: "Frekvenshoppende, kryptert radio med mesh-redundans",
        },
      },
    ],
  },
  {
    slug: "interceptor",
    kind: "uav",
    name: "INTERCEPTOR",
    tagline: {
      en: "Affordable autonomous C-UAS interceptor — Eclipse is faster than cheap attack drones, built to defeat saturation at sovereign scale.",
      no: "Rimelig autonom C-UAS-interceptor — Eclipse er raskere enn billige angrepsdroner, bygget for å beseire metning i suveren skala.",
    },
    description: {
      en: "INTERCEPTOR is Spectr's Eclipse quadcopter — an affordable, autonomous counter-UAS platform designed to defeat cheap attack drones and Shahed-class saturation threats. Built on the RECON foundation and coordinated through Centurion, Eclipse intercepts faster than manual engagement loops while remaining economical at scale. Designed and produced in-house in Norway.",
      no: "INTERCEPTOR er Spectrs Eclipse-kvadrokopter — en rimelig, autonom C-UAS-plattform designet for å beseire billige angrepsdroner og Shahed-klasse metningstrusler. Bygget på RECON-fundamentet og koordinert via Centurion, intercept-er Eclipse raskere enn manuelle engasjementsløkker og forblir økonomisk i skala. Designet og produsert internt i Norge.",
    },
    category: { en: "C-UAS", no: "C-UAS" },
    use: { en: "Counter-UAS interception", no: "C-UAS-intercept" },
    year: 2026,
    flightTime: { en: "Short-duration pursuit profile", no: "Kortvarig forfølgelsesprofil" },
    location: { en: "Produced in Norway", no: "Produsert i Norge" },
    price: { en: "Affordable interceptor economics", no: "Rimelig interceptor-økonomi" },
    availability: { en: "In development — Eclipse prototype", no: "Under utvikling — Eclipse-prototype" },
    range: { en: "2 km intercept range", no: "2 km intercept-rekkevidde" },
    heroImage: "/interceptor-hero-hq.jpg",
    heroAlt: {
      en: "INTERCEPTOR Eclipse quadcopter over operations terrain",
      no: "INTERCEPTOR Eclipse-kvadrokopter over operasjonsterreng",
    },
    gallery: [
      {
        src: "/interceptor-hero.png",
        alt: { en: "Eclipse interceptor front view", no: "Eclipse interceptor frontvisning" },
      },
      {
        src: "/interceptor-hero-hq.jpg",
        alt: { en: "Eclipse interceptor in operations environment", no: "Eclipse interceptor i operasjonsmiljø" },
      },
      {
        src: "/operations-hq.jpg",
        alt: { en: "Spectr operations workspace", no: "Spectr operasjonsarbeidsplass" },
      },
    ],
    highlights: {
      en: [
        "Autonomous C-UAS intercept",
        "Eclipse quadcopter airframe",
        "Centurion mission integration",
        "2 km intercept range",
        "Scalable vs. saturation attacks",
        "Produced in Norway",
      ],
      no: [
        "Autonom C-UAS-intercept",
        "Eclipse-kvadrokopter-luftfartøy",
        "Centurion oppdragsintegrasjon",
        "2 km intercept-rekkevidde",
        "Skalerbart mot metningsangrep",
        "Produsert i Norge",
      ],
    },
    capabilities: [
      {
        title: { en: "Threat pursuit", no: "Trusselforfølgelse" },
        text: {
          en: "Autonomous pursuit profile closes on low-cost attack drones faster than operator-driven engagement loops.",
          no: "Autonom forfølgelsesprofil lukker på lavkostnads angrepsdroner raskere enn operatørdrevne engasjementsløkker.",
        },
      },
      {
        title: { en: "Centurion coordination", no: "Centurion-koordinering" },
        text: {
          en: "Mission reasoning, authorization, and fleet staging through Spectr's sovereign command platform.",
          no: "Oppdragsresonnering, autorisasjon og flåtestaging via Spectrs suverene kommandoplattform.",
        },
      },
      {
        title: { en: "Scalable defense", no: "Skalerbart forsvar" },
        text: {
          en: "Deploy many affordable Eclipse units to protect cities and critical infrastructure against saturation attacks.",
          no: "Deployer mange rimelige Eclipse-enheter for å beskytte byer og kritisk infrastruktur mot metningsangrep.",
        },
      },
    ],
    sectionTitle: {
      en: "Built to defeat saturation attacks.",
      no: "Bygget for å beseire metningsangrep.",
    },
    sectionExtra: {
      en: "When adversaries flood airspace with cheap drones, one missile per target is not sustainable. Eclipse delivers autonomous intercept at a fraction of the cost — produced in Norway, coordinated through Centurion.",
      no: "Når motstandere flommer luftrommet med billige droner, er én missil per mål ikke bærekraftig. Eclipse leverer autonom intercept til en brøkdel av kostnaden — produsert i Norge, koordinert via Centurion.",
    },
    specifications: [
      { label: { en: "Platform", no: "Plattform" }, value: { en: "Eclipse quadcopter interceptor (C-UAS)", no: "Eclipse-kvadrokopter-interceptor (C-UAS)" } },
      { label: { en: "Motors", no: "Motorer" }, value: { en: "4× 1800kv", no: "4× 1800kv" } },
      { label: { en: "Flight controller", no: "Flykontroller" }, value: { en: "SpeedyBee FC", no: "SpeedyBee FC" } },
      { label: { en: "Compute", no: "Beregning" }, value: { en: "Raspberry Pi Zero 2 W", no: "Raspberry Pi Zero 2 W" } },
      { label: { en: "Camera", no: "Kamera" }, value: { en: "Pi Camera Module 3", no: "Pi Camera Module 3" } },
      { label: { en: "Intercept range", no: "Intercept-rekkevidde" }, value: { en: "2 km", no: "2 km" } },
      {
        label: { en: "Use case", no: "Bruksområde" },
        value: {
          en: "Autonomous counter-UAS against cheap attack drones and saturation threats",
          no: "Autonom C-UAS mot billige angrepsdroner og metningstrusler",
        },
      },
    ],
    equipment: [
      {
        label: { en: "Command integration", no: "Kommandointegrasjon" },
        value: {
          en: "Centurion mission staging, authorization, and after-action reporting",
          no: "Centurion mission staging, autorisasjon og etteranalyse-rapportering",
        },
      },
      {
        label: { en: "Specification sheet", no: "Spesifikasjonsark" },
        value: {
          en: "Spectr Eclipse market declaration (PDF)",
          no: "Spectr Eclipse markedsavklaring (PDF)",
        },
      },
    ],
  },
  {
    slug: "centurion",
    kind: "software",
    name: "CENTURION",
    tagline: {
      en: "One sovereign command platform for AI-assisted mission planning, multi-drone coordination, and live operational analysis.",
      no: "Én suveren kommandoplattform for AI-assistert oppdragsplanlegging, multi-drone-koordinering og live operasjonell analyse.",
    },
    description: {
      en: "Centurion is Spectr's sovereign command platform. The operator defines goals and waypoints. Centurion plans, executes, and reports — with AI-assisted decision support, natural language interaction, and mission staging across multiple RECON units.",
      no: "Centurion er Spectrs suverene kommandoplattform. Operatøren definerer mål og waypoints. Centurion planlegger, utfører og rapporterer — med AI-assistert beslutningsstøtte, naturlig språk-grensesnitt og mission staging på tvers av flere RECON-enheter.",
    },
    category: { en: "Software", no: "Programvare" },
    use: { en: "Mission command & control", no: "Oppdragskommando og kontroll" },
    year: 2026,
    location: { en: "Developed in Norway", no: "Utviklet i Norge" },
    price: { en: "Recurring license", no: "Tilbakevendende lisens" },
    availability: { en: "v0.1 — demo-ready", no: "v0.1 — demo-klar" },
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
      en: ["AI-assisted decision support", "Multi-drone coordination", "Mission staging", "Natural language interface"],
      no: ["AI-assistert beslutningsstøtte", "Multi-drone-koordinering", "Mission staging", "Naturlig språk-grensesnitt"],
    },
    capabilities: [
      {
        title: { en: "Mission staging", no: "Mission staging" },
        text: {
          en: "Coordinate multiple RECON units as one operation, robust against loss of individual assets.",
          no: "Koordiner flere RECON-enheter som én operasjon, robust mot tap av enkelt-enheter.",
        },
      },
      {
        title: { en: "AI-assisted decision support", no: "AI-assistert beslutningsstøtte" },
        text: {
          en: "Natural language interface to query, command, and analyze live mission data.",
          no: "Naturlig språk-grensesnitt for å spørre, kommandere og analysere live data.",
        },
      },
      {
        title: { en: "Mission execution", no: "Oppdragsgjennomføring" },
        text: {
          en: "The operator defines goals and waypoints. Centurion plans, executes, and reports.",
          no: "Operatøren definerer mål og waypoints. Centurion planlegger, utfører og rapporterer.",
        },
      },
    ],
    sectionTitle: {
      en: "One sovereign command platform.",
      no: "Én suveren kommandoplattform.",
    },
    sectionExtra: {
      en: "Centurion gives continuous capability improvements without new hardware. Operators define the mission; the platform handles planning, coordination, and reporting.",
      no: "Centurion gir kontinuerlige kapabilitetsforbedringer uten ny maskinvare. Operatører definerer oppdraget; plattformen håndterer planlegging, koordinering og rapportering.",
    },
    specifications: [
      { label: { en: "Platform", no: "Plattform" }, value: { en: "Sovereign command platform", no: "Suveren kommandoplattform" } },
      {
        label: { en: "Capabilities", no: "Kapabiliteter" },
        value: {
          en: "Mission staging, multi-drone coordination, AI-assisted decision support",
          no: "Mission staging, multi-drone-koordinering, AI-assistert beslutningsstøtte",
        },
      },
      { label: { en: "Version", no: "Versjon" }, value: { en: "v0.1 — mission staging and AI chat operational", no: "v0.1 — mission staging og AI-chat operativ" } },
    ],
    equipment: [
      {
        label: { en: "Integration", no: "Integrasjon" },
        value: { en: "RECON fleet command and mission control", no: "RECON-flåtekommando og oppdragskontroll" },
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
