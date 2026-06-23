import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type DocPage = {
  slug: string;
  section: string;
  title: Localized;
  description: Localized;
  body: Localized<string[]>;
};

export const docPages: DocPage[] = [
  {
    slug: "recon-sensing-configuration",
    section: "product",
    title: {
      en: "RECON sensing and observation configuration",
      no: "RECON sensor- og observasjonskonfigurasjon",
    },
    description: {
      en: "Overview of sensing options, payload planning, and observation workflows for RECON.",
      no: "Oversikt over sensoralternativer, nyttelastplanlegging og observasjonsflyt for RECON.",
    },
    body: {
      en: [
        "RECON is configured per mission for ISR surveillance with an EO/IR gimbal payload of 1–1.5 kg (FLIR Boson + Sony block, 300–500 g gimbal). Sensing requirements should be defined before procurement.",
        "This reference covers typical observation profiles, environmental considerations, and the information Spectr needs to prepare a deployment conversation.",
      ],
      no: [
        "RECON konfigureres per oppdrag for ISR-overvåking med EO/IR-gimbal-nyttelast på 1–1,5 kg (FLIR Boson + Sony block, 300–500 g gimbal). Sensorbehov bør defineres før innkjøp.",
        "Denne referansen dekker typiske observasjonsprofiler, miljøhensyn og informasjon Spectr trenger for å forberede en deployeringssamtale.",
      ],
    },
  },
  {
    slug: "pre-mission-planning-checklist",
    section: "operator",
    title: {
      en: "Pre-mission planning checklist",
      no: "Sjekkliste for planlegging før oppdrag",
    },
    description: {
      en: "Field checklist for mission authorization, weather review, and equipment readiness.",
      no: "Feltsjekkliste for oppdragsautorisasjon, værvurdering og utstyrsklarhet.",
    },
    body: {
      en: [
        "Confirm mission authorization, operating area constraints, and communication plan before launch.",
        "Review platform configuration, battery state, control link status, and recovery options.",
        "Document operator assignments and post-operation inspection requirements.",
      ],
      no: [
        "Bekreft oppdragsautorisasjon, begrensninger i operasjonsområde og kommunikasjonsplan før start.",
        "Gjennomgå plattformkonfigurasjon, batteristatus, kontrolllenke og landingalternativer.",
        "Dokumenter operatørtildelinger og krav til inspeksjon etter oppdrag.",
      ],
    },
  },
  {
    slug: "use-case-qualification",
    section: "deployment",
    title: {
      en: "Use-case qualification requirements",
      no: "Kvalifiseringskrav for bruksområde",
    },
    description: {
      en: "Qualification context Spectr uses when evaluating operational fit for a deployment.",
      no: "Kvalifiseringskontekst Spectr bruker ved vurdering av operasjonell egnethet for deployering.",
    },
    body: {
      en: [
        "Define the operating environment, authorization requirements, sensing objectives, and support model before deployment planning begins.",
        "Spectr uses this context to align platform configuration, documentation, and training expectations with the customer workflow.",
      ],
      no: [
        "Definer operasjonsmiljø, autorisasjonskrav, sensorformål og støttemodell før deployeringsplanlegging starter.",
        "Spectr bruker denne konteksten for å avstemme plattformkonfigurasjon, dokumentasjon og opplæringsforventninger med kundens arbeidsflyt.",
      ],
    },
  },
  {
    slug: "request-technical-clarification",
    section: "support",
    title: {
      en: "Request technical clarification",
      no: "Be om teknisk avklaring",
    },
    description: {
      en: "How teams already coordinating with Spectr can request technical clarification.",
      no: "Hvordan team som allerede koordinerer med Spectr kan be om teknisk avklaring.",
    },
    body: {
      en: [
        "Include platform, operating environment, and the specific technical question when contacting Spectr.",
        "For active procurement or deployment conversations, reference your existing contact point where possible.",
      ],
      no: [
        "Inkluder plattform, operasjonsmiljø og det spesifikke tekniske spørsmålet når du kontakter Spectr.",
        "For pågående innkjøps- eller deployeringssamtaler, referer til eksisterende kontaktpunkt der det er mulig.",
      ],
    },
  },
];

export function getDocPage(slug: string) {
  return docPages.find((doc) => doc.slug === slug);
}

export function getDocPagesBySection(section: string) {
  return docPages.filter((doc) => doc.section === section);
}

export function pickDocField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}
