import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type LandingCard = { title: string; text: string };
export type LandingStep = { title: string; text: string };
export type LandingNode = { label: string; description: string; image: string };
export type LandingAgent = { title: string; text: string };
export type LandingTech = { title: string; text: string };
export type LandingApp = { title: string; image: string };
export type LandingStat = { label: string; value: number; suffix: string };

export type ProductLandingContent = {
  slug: string;
  name: string;
  heroImage: string;
  hero: { headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string };
  problem: { headline: string; cards: LandingCard[] };
  platform: { headline: string; nodes: LandingNode[] };
  workflow: { headline: string; steps: LandingStep[] };
  commandCenter: { headline: string; status: string; telemetry: string[]; threats: string[] };
  agents: { headline: string; items: LandingAgent[] };
  trust: { headline: string; items: string[] };
  applications: { headline: string; items: LandingApp[] };
  technology: { headline: string; items: LandingTech[] };
  stats: { items: LandingStat[] };
  cta: { headline: string; primary: string; secondary: string };
  specSheet?: { label: string; href: string };
};

type LocalizedLanding = {
  slug: string;
  name: string;
  heroImage: string;
  hero: Localized<{ headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string }>;
  problem: Localized<{ headline: string; cards: LandingCard[] }>;
  platform: Localized<{ headline: string; nodes: LandingNode[] }>;
  workflow: Localized<{ headline: string; steps: LandingStep[] }>;
  commandCenter: Localized<{ headline: string; status: string; telemetry: string[]; threats: string[] }>;
  agents: Localized<{ headline: string; items: LandingAgent[] }>;
  trust: Localized<{ headline: string; items: string[] }>;
  applications: Localized<{ headline: string; items: LandingApp[] }>;
  technology: Localized<{ headline: string; items: LandingTech[] }>;
  stats: Localized<{ items: LandingStat[] }>;
  cta: Localized<{ headline: string; primary: string; secondary: string }>;
  specSheet?: Localized<{ label: string; href: string }>;
};

const reconLanding: LocalizedLanding = {
  slug: "recon",
  name: "RECON",
  heroImage: "/recon-hero.png",
  hero: {
    en: {
      headline: "Autonomous ISR for the denied battlefield — continuous surveillance without GPS, infrastructure, or stopping the mission.",
      subheadline: "",
      ctaPrimary: "Request Access",
      ctaSecondary: "Explore Platform",
    },
    no: {
      headline: "Autonom ISR for det nektede slagfeltet — kontinuerlig overvåking uten GPS, infrastruktur eller avbrudd i oppdraget.",
      subheadline: "",
      ctaPrimary: "Be om tilgang",
      ctaSecondary: "Utforsk plattformen",
    },
  },
  problem: {
    en: {
      headline: "Modern conflict disables the systems operators depend on.",
      cards: [
        { title: "Intelligence", text: "GPS denied. Comms jammed. Data without context." },
        { title: "Mission Planning", text: "Manual workflows break under pressure." },
        { title: "Operational Response", text: "Assets stall when links fail." },
      ],
    },
    no: {
      headline: "Moderne konflikt slår ut systemene operatører er avhengige av.",
      cards: [
        { title: "Etterretning", text: "GPS nektet. Samband jammet. Data uten kontekst." },
        { title: "Oppdragsplanlegging", text: "Manuelle arbeidsflyter bryter sammen under press." },
        { title: "Operativ respons", text: "Enheter stopper når lenker svikter." },
      ],
    },
  },
  platform: {
    en: {
      headline: "The RECON platform",
      nodes: [
        {
          label: "Edge Processing",
          description:
            "Onboard compute fuses sensor feeds at the aircraft — cutting latency and keeping ISR useful when datalinks degrade.",
          image: "/recon-sensors.png",
        },
        {
          label: "Mission Intelligence",
          description:
            "Centurion-defined objectives shape flight paths, loiter points, and observation priorities before and during the mission.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Autonomous Flight",
          description:
            "VTOL launch, wing-borne cruise, and GNSS-denied navigation — the platform flies the mission without continuous operator input.",
          image: "/recon-autonomous-flight.png",
        },
        {
          label: "Operator Oversight",
          description:
            "Human-in-the-loop control through Centurion. Operators approve plans, monitor live feeds, and intervene when required.",
          image: "/recon-operator-oversight.png",
        },
        {
          label: "ISR Delivery",
          description:
            "Imagery and telemetry returned to command — sustained surveillance across a 50–100 km operating radius.",
          image: "/recon-isr-delivery.png",
        },
      ],
    },
    no: {
      headline: "RECON-plattformen",
      nodes: [
        {
          label: "Edge-prosessering",
          description:
            "Ombord-beregning fusjonerer sensorfeeds på luftfartøyet — reduserer forsinkelse og holder ISR nyttig når datalenker degraderes.",
          image: "/recon-sensors.png",
        },
        {
          label: "Oppdragsintelligens",
          description:
            "Centurion-definerte mål former flybaner, loiter-punkter og observasjonsprioriteter før og under oppdraget.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Autonom flyging",
          description:
            "VTOL-start, vingebåren cruise og GNSS-nektet navigasjon — plattformen flyr oppdraget uten kontinuerlig operatørinput.",
          image: "/recon-autonomous-flight.png",
        },
        {
          label: "Operatørtilsyn",
          description:
            "Menneske-i-løkken-kontroll via Centurion. Operatører godkjenner planer, overvåker live feeds og griper inn ved behov.",
          image: "/recon-operator-oversight.png",
        },
        {
          label: "ISR-leveranse",
          description:
            "Bilder og telemetri returnert til kommando — vedvarende overvåking over en operasjonsradius på 50–100 km.",
          image: "/recon-isr-delivery.png",
        },
      ],
    },
  },
  workflow: {
    en: {
      headline: "Beyond traditional drone operations",
      steps: [
        { title: "Mission defined in Centurion", text: "Operator sets objectives and area of interest." },
        { title: "VTOL launch", text: "Vertical takeoff. No runway required." },
        { title: "Wing-borne cruise", text: "Efficient transit to operating area." },
        { title: "Autonomous ISR", text: "Continuous surveillance in denied environments." },
        { title: "Return and report", text: "Autonomous recovery. Mission data delivered." },
      ],
    },
    no: {
      headline: "Utover tradisjonell droneoperasjon",
      steps: [
        { title: "Oppdrag definert i Centurion", text: "Operatør setter mål og interesseområde." },
        { title: "VTOL-start", text: "Vertikal start. Ingen rullebane nødvendig." },
        { title: "Vingebåren cruise", text: "Effektiv transitt til operasjonsområde." },
        { title: "Autonom ISR", text: "Kontinuerlig overvåking i nektede miljøer." },
        { title: "Retur og rapport", text: "Autonom landing. Oppdragsdata levert." },
      ],
    },
  },
  commandCenter: {
    en: {
      headline: "Mission command interface",
      status: "ACTIVE — 2 RECON units staged",
      telemetry: ["ALT 1,240 m", "SPD 72 km/h", "BAT 68%", "LINK MESH"],
      threats: ["GNSS DENIED", "COMMS DEGRADED", "MISSION CONTINUES"],
    },
    no: {
      headline: "Oppdragskommandogrensesnitt",
      status: "AKTIV — 2 RECON-enheter staged",
      telemetry: ["HØY 1 240 m", "FART 72 km/t", "BAT 68%", "LENKE MESH"],
      threats: ["GNSS NEKTET", "SAMBAND DEGRADERT", "OPPdrag FORTSETTER"],
    },
  },
  agents: {
    en: {
      headline: "Mission capabilities",
      items: [
        { title: "Area Surveillance", text: "Continuous EO/IR coverage over large operating areas." },
        { title: "Denied Navigation", text: "VIO, terrain reference, and INS fallback." },
        { title: "Resilient Comms", text: "Frequency-hopping encrypted mesh radio." },
        { title: "Autonomous Recovery", text: "Return on link loss or mission completion." },
      ],
    },
    no: {
      headline: "Oppdragskapabiliteter",
      items: [
        { title: "Områdeovervåking", text: "Kontinuerlig EO/IR-dekning over store operasjonsområder." },
        { title: "Nektet navigasjon", text: "VIO, terrengreferanse og INS-fallback." },
        { title: "Robust samband", text: "Frekvenshoppende kryptert mesh-radio." },
        { title: "Autonom retur", text: "Retur ved lenketap eller fullført oppdrag." },
      ],
    },
  },
  trust: {
    en: {
      headline: "Built for sovereign defense operations",
      items: [
        "Produced in Norway",
        "GDPR compliant",
        "Export control ready",
        "EW-resilient communications",
        "Human-in-the-loop control",
      ],
    },
    no: {
      headline: "Bygget for suverene forsvarsoperasjoner",
      items: [
        "Produsert i Norge",
        "GDPR-kompatibel",
        "Eksportkontroll-klar",
        "EW-motstandsdyktig kommunikasjon",
        "Menneske-i-løkken-kontroll",
      ],
    },
  },
  applications: {
    en: {
      headline: "Operational domains",
      items: [
        { title: "Military ISR", image: "/recon-mountain.png" },
        { title: "Border Security", image: "/recon-front.png" },
        { title: "Critical Infrastructure", image: "/operations-hq.jpg" },
        { title: "Maritime Surveillance", image: "/recon-top.png" },
        { title: "Search & Rescue", image: "/recon-hero.png" },
      ],
    },
    no: {
      headline: "Operasjonelle domener",
      items: [
        { title: "Militær ISR", image: "/recon-mountain.png" },
        { title: "Grensesikkerhet", image: "/recon-front.png" },
        { title: "Kritisk infrastruktur", image: "/operations-hq.jpg" },
        { title: "Maritim overvåking", image: "/recon-top.png" },
        { title: "Søk og redning", image: "/recon-hero.png" },
      ],
    },
  },
  technology: {
    en: {
      headline: "Technology stack",
      items: [
        { title: "VTOL Fixed-Wing", text: "Vertical launch. Efficient cruise." },
        { title: "GNSS-Denied Nav", text: "Multi-layer positioning without GPS." },
        { title: "Carbon Composite", text: "Vacuum-formed airframe in Norway." },
        { title: "EO/IR Payload", text: "1–1.5 kg gimbal sensor package." },
        { title: "Edge Autonomy", text: "Onboard mission execution." },
      ],
    },
    no: {
      headline: "Teknologistack",
      items: [
        { title: "VTOL fastvinge", text: "Vertikal start. Effektiv cruise." },
        { title: "GNSS-nektet navigasjon", text: "Flerlags posisjonering uten GPS." },
        { title: "Karbonkompositt", text: "Vakuumformet luftfartøy i Norge." },
        { title: "EO/IR-nyttelast", text: "1–1,5 kg gimbal-sensorpakke." },
        { title: "Edge-autonomi", text: "Ombord oppdragsgjennomføring." },
      ],
    },
  },
  stats: {
    en: {
      items: [
        { label: "Operating radius", value: 100, suffix: " km" },
        { label: "Cruise endurance", value: 4, suffix: " hr" },
        { label: "Wingspan", value: 1.55, suffix: " m" },
        { label: "MTOW", value: 8, suffix: " kg" },
      ],
    },
    no: {
      items: [
        { label: "Operasjonsradius", value: 100, suffix: " km" },
        { label: "Cruise utholdenhet", value: 4, suffix: " hr" },
        { label: "Vingespenn", value: 1.55, suffix: " m" },
        { label: "MTOW", value: 8, suffix: " kg" },
      ],
    },
  },
  cta: {
    en: {
      headline: "ISR that operates when everything else fails.",
      primary: "Request Access",
      secondary: "Contact Spectr",
    },
    no: {
      headline: "ISR som opererer når alt annet svikter.",
      primary: "Be om tilgang",
      secondary: "Kontakt Spectr",
    },
  },
};

const interceptorLanding: LocalizedLanding = {
  slug: "interceptor",
  name: "INTERCEPTOR",
  heroImage: "/interceptor-hero-hq.jpg",
  hero: {
    en: {
      headline:
        "Affordable autonomous intercept — Eclipse is faster than the threat, built to defeat saturation attacks at sovereign scale.",
      subheadline: "",
      ctaPrimary: "Request Access",
      ctaSecondary: "Explore Platform",
    },
    no: {
      headline:
        "Rimelig autonom intercept — Eclipse er raskere enn trusselen, bygget for å beseire metningsangrep i suveren skala.",
      subheadline: "",
      ctaPrimary: "Be om tilgang",
      ctaSecondary: "Utforsk plattformen",
    },
  },
  problem: {
    en: {
      headline: "Cheap attack drones scale faster than traditional air defense can respond.",
      cards: [
        { title: "Threat Volume", text: "Shahed-class saturation overwhelms expensive interceptors." },
        { title: "Cost Asymmetry", text: "One missile per drone is not economically sustainable." },
        { title: "Response Time", text: "Manual engagement loops lag behind autonomous threats." },
      ],
    },
    no: {
      headline: "Billige angrepsdroner skalerer raskere enn tradisjonelt luftvern kan svare.",
      cards: [
        { title: "Trusselvolum", text: "Shahed-klasse metning overvelder kostbare interceptorer." },
        { title: "Kostnadsasymmetri", text: "Én missil per drone er ikke økonomisk bærekraftig." },
        { title: "Responstid", text: "Manuelle engasjementsløkker henger etter autonome trusler." },
      ],
    },
  },
  platform: {
    en: {
      headline: "The Eclipse interceptor platform",
      nodes: [
        {
          label: "Threat Detection",
          description:
            "RECON and Centurion fuse sensor feeds to identify incoming low-cost attack drones before they reach critical infrastructure.",
          image: "/recon-isr-delivery.png",
        },
        {
          label: "Eclipse Airframe",
          description:
            "Compact quadcopter interceptor — small, light, and fast. Designed for rapid launch and pursuit in urban and infrastructure defense.",
          image: "/interceptor-hero.png",
        },
        {
          label: "Autonomous Pursuit",
          description:
            "Onboard autonomy closes the intercept loop without operator micromanagement — faster than the threat, mission-driven from Centurion.",
          image: "/recon-autonomous-flight.png",
        },
        {
          label: "Edge Compute",
          description:
            "Raspberry Pi Zero 2 W and Pi Camera Module 3 provide onboard tracking and decision support at the edge of the engagement.",
          image: "/recon-sensors.png",
        },
        {
          label: "Scalable Defense",
          description:
            "Deploy many Eclipse units against saturation attacks — affordable interceptors that protect cities and critical sites across Norway.",
          image: "/operations-hq.jpg",
        },
      ],
    },
    no: {
      headline: "Eclipse-interceptorplattformen",
      nodes: [
        {
          label: "Trusseldeteksjon",
          description:
            "RECON og Centurion fusjonerer sensorfeeds for å identifisere innkommende lavkostnads angrepsdroner før de når kritisk infrastruktur.",
          image: "/recon-isr-delivery.png",
        },
        {
          label: "Eclipse-luftfartøy",
          description:
            "Kompakt kvadrokopter-interceptor — liten, lett og rask. Designet for rask utskyting og forfølgelse i urban og infrastrukturforsvar.",
          image: "/interceptor-hero.png",
        },
        {
          label: "Autonom forfølgelse",
          description:
            "Ombord-autonomi lukker intercept-løkken uten operatørmikrostyring — raskere enn trusselen, oppdragsdrevet fra Centurion.",
          image: "/recon-autonomous-flight.png",
        },
        {
          label: "Edge-beregning",
          description:
            "Raspberry Pi Zero 2 W og Pi Camera Module 3 gir ombord-sporing og beslutningsstøtte ved kanten av engasjementet.",
          image: "/recon-sensors.png",
        },
        {
          label: "Skalerbart forsvar",
          description:
            "Deployer mange Eclipse-enheter mot metningsangrep — rimelige interceptorer som beskytter byer og kritiske steder i Norge.",
          image: "/operations-hq.jpg",
        },
      ],
    },
  },
  workflow: {
    en: {
      headline: "From threat detection to kinetic intercept",
      steps: [
        { title: "Threat identified", text: "RECON or ground sensors cue Centurion to an incoming attack profile." },
        { title: "Interceptor staged", text: "Eclipse units armed and cleared for autonomous engagement." },
        { title: "Autonomous launch", text: "Rapid vertical launch — no runway, minimal footprint." },
        { title: "Pursuit and intercept", text: "Onboard compute tracks and closes on the threat faster than manual loops." },
        { title: "Report to command", text: "Outcome and telemetry returned to Centurion for after-action review." },
      ],
    },
    no: {
      headline: "Fra trusseldeteksjon til kinetisk intercept",
      steps: [
        { title: "Trussel identifisert", text: "RECON eller bakkesensorer peker Centurion mot innkommende angrepsprofil." },
        { title: "Interceptor staged", text: "Eclipse-enheter bevæpnet og klarert for autonomt engasjement." },
        { title: "Autonom utskyting", text: "Rask vertikal start — ingen rullebane, minimalt fotavtrykk." },
        { title: "Forfølgelse og intercept", text: "Ombord-beregning sporer og lukker på trusselen raskere enn manuelle løkker." },
        { title: "Rapport til kommando", text: "Resultat og telemetri returnert til Centurion for etteranalyse." },
      ],
    },
  },
  commandCenter: {
    en: {
      headline: "Intercept command interface",
      status: "ACTIVE — 4 Eclipse units armed",
      telemetry: ["RNG 1.2 km", "SPD 94 km/h", "TRK LOCK", "LINK CENTURION"],
      threats: ["INBOUND DRONE", "SATURATION RISK", "INTERCEPT AUTHORIZED"],
    },
    no: {
      headline: "Intercept-kommandogrensesnitt",
      status: "AKTIV — 4 Eclipse-enheter bevæpnet",
      telemetry: ["AVST 1,2 km", "FART 94 km/t", "SPOR LÅST", "LENKE CENTURION"],
      threats: ["INNKOMMENDE DRONE", "METNINGSRISIKO", "INTERCEPT AUTORISERT"],
    },
  },
  agents: {
    en: {
      headline: "Intercept capabilities",
      items: [
        { title: "C-UAS Defense", text: "Purpose-built to defeat cheap attack drones and Shahed-class threats." },
        { title: "Autonomous Engagement", text: "Centurion-driven pursuit without continuous operator input." },
        { title: "Compact Footprint", text: "Small quadcopter form factor for rapid staging near cities and infrastructure." },
        { title: "Norwegian Production", text: "Designed and produced in-house in Norway." },
      ],
    },
    no: {
      headline: "Intercept-kapabiliteter",
      items: [
        { title: "C-UAS-forsvar", text: "Bygget for å beseire billige angrepsdroner og Shahed-klasse trusler." },
        { title: "Autonomt engasjement", text: "Centurion-drevet forfølgelse uten kontinuerlig operatørinput." },
        { title: "Kompakt fotavtrykk", text: "Liten kvadrokopter-form for rask staging nær byer og infrastruktur." },
        { title: "Norsk produksjon", text: "Designet og produsert internt i Norge." },
      ],
    },
  },
  trust: {
    en: {
      headline: "Built for sovereign air defense",
      items: [
        "Produced in Norway",
        "Affordable vs. missile interceptors",
        "Centurion mission integration",
        "Scalable against saturation attacks",
        "Human-in-the-loop authorization",
      ],
    },
    no: {
      headline: "Bygget for suverent luftvern",
      items: [
        "Produsert i Norge",
        "Rimelig vs. missil-interceptorer",
        "Centurion oppdragsintegrasjon",
        "Skalerbart mot metningsangrep",
        "Menneske-i-løkken-autorisasjon",
      ],
    },
  },
  applications: {
    en: {
      headline: "Defense domains",
      items: [
        { title: "Critical Infrastructure", image: "/operations-hq.jpg" },
        { title: "Urban Air Defense", image: "/interceptor-hero-hq.jpg" },
        { title: "C-UAS Layer", image: "/interceptor-hero.png" },
        { title: "Border Protection", image: "/recon-mountain.png" },
        { title: "Integrated with RECON", image: "/recon-hero.png" },
      ],
    },
    no: {
      headline: "Forsvarsdomener",
      items: [
        { title: "Kritisk infrastruktur", image: "/operations-hq.jpg" },
        { title: "Urban luftvern", image: "/interceptor-hero-hq.jpg" },
        { title: "C-UAS-lag", image: "/interceptor-hero.png" },
        { title: "Grensebeskyttelse", image: "/recon-mountain.png" },
        { title: "Integrert med RECON", image: "/recon-hero.png" },
      ],
    },
  },
  technology: {
    en: {
      headline: "Technology stack",
      items: [
        { title: "Eclipse Quadcopter", text: "Compact interceptor airframe — 4× 1800kv motors." },
        { title: "SpeedyBee FC", text: "Flight controller tuned for aggressive pursuit profiles." },
        { title: "Pi Zero 2 W", text: "Onboard compute for tracking and mission logic." },
        { title: "Pi Camera Module 3", text: "Visual tracking and threat acquisition." },
        { title: "Centurion AI", text: "Mission reasoning and fleet coordination from Spectr command." },
      ],
    },
    no: {
      headline: "Teknologistack",
      items: [
        { title: "Eclipse-kvadrokopter", text: "Kompakt interceptor-luftfartøy — 4× 1800kv motorer." },
        { title: "SpeedyBee FC", text: "Flykontroller tunet for aggressive forfølgelsesprofiler." },
        { title: "Pi Zero 2 W", text: "Ombord-beregning for sporing og oppdragslogikk." },
        { title: "Pi Camera Module 3", text: "Visuell sporing og trusseloppdagelse." },
        { title: "Centurion AI", text: "Oppdragsresonnering og flåtekoordinering fra Spectr-kommando." },
      ],
    },
  },
  stats: {
    en: {
      items: [
        { label: "Intercept range", value: 2, suffix: " km" },
        { label: "Quad motors", value: 4, suffix: "× 1800kv" },
        { label: "Deployable units", value: 10, suffix: "+" },
        { label: "Onboard compute", value: 2, suffix: " W" },
      ],
    },
    no: {
      items: [
        { label: "Intercept-rekkevidde", value: 2, suffix: " km" },
        { label: "Kvadromotorer", value: 4, suffix: "× 1800kv" },
        { label: "Deployerbare enheter", value: 10, suffix: "+" },
        { label: "Ombord-beregning", value: 2, suffix: " W" },
      ],
    },
  },
  cta: {
    en: {
      headline: "Intercept that scales when missiles cannot.",
      primary: "Request Access",
      secondary: "Contact Spectr",
    },
    no: {
      headline: "Intercept som skalerer når missiler ikke kan.",
      primary: "Be om tilgang",
      secondary: "Kontakt Spectr",
    },
  },
  specSheet: {
    en: { label: "Download Specification Sheet", href: "/interceptor-spec-sheet.pdf" },
    no: { label: "Last ned spesifikasjonsark", href: "/interceptor-spec-sheet.pdf" },
  },
};

const centurionLanding: LocalizedLanding = {
  slug: "centurion",
  name: "CENTURION",
  heroImage: "/centurion-hq.jpg",
  hero: {
    en: {
      headline: "Sovereign, AI-assisted command from mission intent to coordinated action.",
      subheadline: "",
      ctaPrimary: "Request Demo",
      ctaSecondary: "Explore Platform",
    },
    no: {
      headline: "Suveren, AI-assistert kommando fra oppdragsintensjon til koordinert handling.",
      subheadline: "",
      ctaPrimary: "Be om demo",
      ctaSecondary: "Utforsk plattformen",
    },
  },
  problem: {
    en: {
      headline: "Operators face more data than they can process in real time.",
      cards: [
        { title: "Intelligence", text: "Feeds multiply. Context disappears." },
        { title: "Mission Planning", text: "Manual coordination across assets." },
        { title: "Operational Response", text: "Decisions lag behind the battlefield." },
      ],
    },
    no: {
      headline: "Operatører møter mer data enn de kan behandle i sanntid.",
      cards: [
        { title: "Etterretning", text: "Feeder multipliseres. Kontekst forsvinner." },
        { title: "Oppdragsplanlegging", text: "Manuell koordinering på tvers av enheter." },
        { title: "Operativ respons", text: "Beslutninger henger etter slagfeltet." },
      ],
    },
  },
  platform: {
    en: {
      headline: "The Centurion platform",
      nodes: [
        {
          label: "Data Ingest",
          description:
            "Live feeds from RECON sensors, telemetry, and operator inputs fused into a single operational picture.",
          image: "/recon-isr-delivery.png",
        },
        {
          label: "AI Processing",
          description:
            "Natural language interface and AI-assisted analysis turn raw data into mission-ready intelligence.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Mission Intelligence",
          description:
            "Goals and constraints become staged mission plans — routes, timelines, and asset assignments for operator review.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Fleet Coordination",
          description:
            "Multiple RECON units synchronized as one operation — robust when individual assets or links are lost.",
          image: "/centurion-fleet-coordination.png",
        },
        {
          label: "Human Approval",
          description:
            "Every critical decision requires operator sign-off. Centurion recommends; the human commands.",
          image: "/recon-operator-oversight.png",
        },
        {
          label: "Autonomous Execution",
          description:
            "Approved plans dispatched to the fleet. RECON executes autonomously and reports back in real time.",
          image: "/recon-isr-delivery.png",
        },
      ],
    },
    no: {
      headline: "Centurion-plattformen",
      nodes: [
        {
          label: "Datainntak",
          description:
            "Live feeds fra RECON-sensorer, telemetri og operatørinndata fusert til ett operasjonelt bilde.",
          image: "/recon-isr-delivery.png",
        },
        {
          label: "AI-prosessering",
          description:
            "Naturlig språkgrensesnitt og AI-assistert analyse gjør rådata om til oppdragsklar etterretning.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Oppdragsintelligens",
          description:
            "Mål og begrensninger blir staged oppdragsplaner — ruter, tidslinjer og enhetstildelinger for operatørgjennomgang.",
          image: "/centurion-laptop-mockup.png",
        },
        {
          label: "Flåtekoordinering",
          description:
            "Flere RECON-enheter synkronisert som én operasjon — robust når enkelt-enheter eller lenker går tapt.",
          image: "/centurion-fleet-coordination.png",
        },
        {
          label: "Menneskelig godkjenning",
          description:
            "Hver kritisk beslutning krever operatørens godkjenning. Centurion anbefaler; mennesket kommandrerer.",
          image: "/recon-operator-oversight.png",
        },
        {
          label: "Autonom gjennomføring",
          description:
            "Godkjente planer sendt til flåten. RECON utfører autonomt og rapporterer tilbake i sanntid.",
          image: "/recon-isr-delivery.png",
        },
      ],
    },
  },
  workflow: {
    en: {
      headline: "From intent to execution",
      steps: [
        { title: "Define the mission", text: "Goals, waypoints, and rules of engagement." },
        { title: "AI analyzes context", text: "Live data fused into actionable intelligence." },
        { title: "Options generated", text: "Mission plans staged for operator review." },
        { title: "Operator approves", text: "Human-in-the-loop control at every decision." },
        { title: "Fleet executes", text: "RECON units coordinated as one operation." },
      ],
    },
    no: {
      headline: "Fra intensjon til gjennomføring",
      steps: [
        { title: "Definer oppdraget", text: "Mål, waypoints og engasjementsregler." },
        { title: "AI analyserer kontekst", text: "Live data fusert til handlingsbar etterretning." },
        { title: "Alternativer generert", text: "Oppdragsplaner staged for operatørgjennomgang." },
        { title: "Operatør godkjenner", text: "Menneske-i-løkken-kontroll ved hver beslutning." },
        { title: "Flåten utfører", text: "RECON-enheter koordinert som én operasjon." },
      ],
    },
  },
  commandCenter: {
    en: {
      headline: "Digital twin command center",
      status: "CENTURION v0.1 — MISSION STAGING ACTIVE",
      telemetry: ["3 ASSETS ONLINE", "AI CHAT READY", "STAGING COMPLETE", "AWAITING APPROVAL"],
      threats: ["MULTI-DRONE SYNC", "NATURAL LANGUAGE", "LIVE ANALYSIS"],
    },
    no: {
      headline: "Digital twin kommandosenter",
      status: "CENTURION v0.1 — MISSION STAGING AKTIV",
      telemetry: ["3 ENHETER ONLINE", "AI-CHAT KLAR", "STAGING FULLFØRT", "VENTER GODKJENNING"],
      threats: ["MULTI-DRONE SYNC", "NATURLIG SPRÅK", "LIVE ANALYSE"],
    },
  },
  agents: {
    en: {
      headline: "Mission agents",
      items: [
        { title: "Planning Agent", text: "Generates mission options from operator intent." },
        { title: "Analysis Agent", text: "Fuses live feeds into actionable intelligence." },
        { title: "Coordination Agent", text: "Synchronizes multiple RECON assets." },
        { title: "Reporting Agent", text: "Delivers mission status and after-action data." },
      ],
    },
    no: {
      headline: "Oppdragsagenter",
      items: [
        { title: "Planleggingsagent", text: "Genererer oppdragsalternativer fra operatørintensjon." },
        { title: "Analyseagent", text: "Fuserer live feeds til handlingsbar etterretning." },
        { title: "Koordineringsagent", text: "Synkroniserer flere RECON-enheter." },
        { title: "Rapporteringsagent", text: "Leverer oppdragsstatus og etteraksjonsdata." },
      ],
    },
  },
  trust: {
    en: {
      headline: "Built for sovereign defense operations",
      items: [
        "Developed in Norway",
        "GDPR compliant",
        "Export control ready",
        "Secure communications",
        "Human-in-the-loop control",
      ],
    },
    no: {
      headline: "Bygget for suverene forsvarsoperasjoner",
      items: [
        "Utviklet i Norge",
        "GDPR-kompatibel",
        "Eksportkontroll-klar",
        "Sikker kommunikasjon",
        "Menneske-i-løkken-kontroll",
      ],
    },
  },
  applications: {
    en: {
      headline: "Operational domains",
      items: [
        { title: "Military Command", image: "/operations-hq.jpg" },
        { title: "Border Operations", image: "/recon-mountain.png" },
        { title: "Infrastructure", image: "/centurion-laptop-mockup.png" },
        { title: "Maritime Ops", image: "/recon-top.png" },
        { title: "Crisis Response", image: "/recon-hero.png" },
      ],
    },
    no: {
      headline: "Operasjonelle domener",
      items: [
        { title: "Militær kommando", image: "/operations-hq.jpg" },
        { title: "Grenseoperasjoner", image: "/recon-mountain.png" },
        { title: "Infrastruktur", image: "/centurion-laptop-mockup.png" },
        { title: "Maritime operasjoner", image: "/recon-top.png" },
        { title: "Krisehåndtering", image: "/recon-hero.png" },
      ],
    },
  },
  technology: {
    en: {
      headline: "Technology stack",
      items: [
        { title: "AI Engine", text: "Natural language mission interface." },
        { title: "Mission Staging", text: "Multi-asset coordination layer." },
        { title: "Live Analysis", text: "Real-time operational intelligence." },
        { title: "Fleet Control", text: "RECON integration and command." },
        { title: "Sovereign Stack", text: "Norwegian-developed. No third-party cloud." },
      ],
    },
    no: {
      headline: "Teknologistack",
      items: [
        { title: "AI-motor", text: "Naturlig språk oppdragsgrensesnitt." },
        { title: "Mission staging", text: "Multi-enhet koordineringslag." },
        { title: "Live analyse", text: "Operasjonell etterretning i sanntid." },
        { title: "Flåtekontroll", text: "RECON-integrasjon og kommando." },
        { title: "Suveren stack", text: "Norskutviklet. Ingen tredjepartssky." },
      ],
    },
  },
  stats: {
    en: {
      items: [
        { label: "Version", value: 0.1, suffix: "" },
        { label: "Assets coordinated", value: 10, suffix: "+" },
        { label: "Mission staging", value: 100, suffix: "%" },
        { label: "Response latency", value: 2, suffix: " s" },
      ],
    },
    no: {
      items: [
        { label: "Versjon", value: 0.1, suffix: "" },
        { label: "Koordinerte enheter", value: 10, suffix: "+" },
        { label: "Mission staging", value: 100, suffix: "%" },
        { label: "Responsforsinkelse", value: 2, suffix: " s" },
      ],
    },
  },
  cta: {
    en: {
      headline: "The future of sovereign mission command starts here.",
      primary: "Request Demo",
      secondary: "Contact Spectr",
    },
    no: {
      headline: "Fremtiden for suveren oppdragskommando starter her.",
      primary: "Be om demo",
      secondary: "Kontakt Spectr",
    },
  },
};

const landingBySlug: Record<string, LocalizedLanding> = {
  recon: reconLanding,
  interceptor: interceptorLanding,
  centurion: centurionLanding,
};

function localizeLanding(entry: LocalizedLanding, locale: Locale): ProductLandingContent {
  return {
    slug: entry.slug,
    name: entry.name,
    heroImage: entry.heroImage,
    hero: pick(entry.hero, locale),
    problem: pick(entry.problem, locale),
    platform: pick(entry.platform, locale),
    workflow: pick(entry.workflow, locale),
    commandCenter: pick(entry.commandCenter, locale),
    agents: pick(entry.agents, locale),
    trust: pick(entry.trust, locale),
    applications: pick(entry.applications, locale),
    technology: pick(entry.technology, locale),
    stats: pick(entry.stats, locale),
    cta: pick(entry.cta, locale),
    specSheet: entry.specSheet ? pick(entry.specSheet, locale) : undefined,
  };
}

export function getProductLandingContent(slug: string, locale: Locale): ProductLandingContent | null {
  const entry = landingBySlug[slug];
  if (!entry) return null;
  return localizeLanding(entry, locale);
}
