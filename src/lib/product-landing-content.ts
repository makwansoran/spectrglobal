import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type LandingCard = { title: string; text: string };
export type LandingStep = { title: string; text: string };
export type LandingNode = { label: string };
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
};

const reconLanding: LocalizedLanding = {
  slug: "recon",
  name: "RECON",
  heroImage: "/recon-hero.png",
  hero: {
    en: {
      headline: "Autonomous ISR for the denied battlefield.",
      subheadline: "Continuous surveillance without GPS. Without ground infrastructure. Without stopping the mission.",
      ctaPrimary: "Request Access",
      ctaSecondary: "Explore Platform",
    },
    no: {
      headline: "Autonom ISR for det nektede slagfeltet.",
      subheadline: "Kontinuerlig overvåking uten GPS. Uten bakkeinfrastruktur. Uten å stoppe oppdraget.",
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
        { label: "Sensors" },
        { label: "Edge Processing" },
        { label: "Mission Intelligence" },
        { label: "Autonomous Flight" },
        { label: "Operator Oversight" },
        { label: "ISR Delivery" },
      ],
    },
    no: {
      headline: "RECON-plattformen",
      nodes: [
        { label: "Sensorer" },
        { label: "Edge-prosessering" },
        { label: "Oppdragsintelligens" },
        { label: "Autonom flyging" },
        { label: "Operatørtilsyn" },
        { label: "ISR-leveranse" },
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

const centurionLanding: LocalizedLanding = {
  slug: "centurion",
  name: "CENTURION",
  heroImage: "/centurion-laptop-mockup.png",
  hero: {
    en: {
      headline: "Sovereign command for autonomous operations.",
      subheadline: "Transform mission intent into coordinated action with AI-assisted decision support.",
      ctaPrimary: "Request Demo",
      ctaSecondary: "Explore Platform",
    },
    no: {
      headline: "Suveren kommando for autonome operasjoner.",
      subheadline: "Gjør oppdragsintensjon til koordinert handling med AI-assistert beslutningsstøtte.",
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
        { label: "Data Ingest" },
        { label: "AI Processing" },
        { label: "Mission Intelligence" },
        { label: "Fleet Coordination" },
        { label: "Human Approval" },
        { label: "Autonomous Execution" },
      ],
    },
    no: {
      headline: "Centurion-plattformen",
      nodes: [
        { label: "Datainntak" },
        { label: "AI-prosessering" },
        { label: "Oppdragsintelligens" },
        { label: "Flåtekoordinering" },
        { label: "Menneskelig godkjenning" },
        { label: "Autonom gjennomføring" },
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
  };
}

export function getProductLandingContent(slug: string, locale: Locale): ProductLandingContent | null {
  const entry = landingBySlug[slug];
  if (!entry) return null;
  return localizeLanding(entry, locale);
}
