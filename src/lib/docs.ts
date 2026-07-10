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
    slug: "centurion-mission-software-overview",
    section: "product",
    title: {
      en: "Centurion mission software overview",
      no: "Centurion oppdragsprogramvare — oversikt",
    },
    description: {
      en: "Overview of Centurion capabilities, fleet integration, and deployment context for autonomous drone operations.",
      no: "Oversikt over Centurion-kapabiliteter, flåteintegrasjon og deployeringskontekst for autonome droneoperasjoner.",
    },
    body: {
      en: [
        "Centurion is Spectr's sovereign mission command platform for planning, coordinating, and reporting across diverse drone fleets. Software requirements should be defined before procurement.",
        "This reference covers typical mission profiles, operating environments, and the information Spectr needs to prepare a deployment conversation.",
      ],
      no: [
        "Centurion er Spectrs suverene oppdragskommandoplattform for planlegging, koordinering og rapportering på tvers av ulike droneflåter. Programvarekrav bør defineres før innkjøp.",
        "Denne referansen dekker typiske oppdragsprofiler, operasjonsmiljøer og informasjon Spectr trenger for å forberede en deployeringssamtale.",
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
      en: "Checklist for mission authorization, environment review, and software readiness.",
      no: "Sjekkliste for oppdragsautorisasjon, miljøvurdering og programvareklarhet.",
    },
    body: {
      en: [
        "Confirm mission authorization, operating area constraints, and communication plan before execution.",
        "Review fleet configuration, datalink status, Centurion mission staging, and recovery options.",
        "Document operator assignments and post-operation review requirements.",
      ],
      no: [
        "Bekreft oppdragsautorisasjon, begrensninger i operasjonsområde og kommunikasjonsplan før gjennomføring.",
        "Gjennomgå flåteoppsett, datalenkestatus, Centurion mission staging og recovery-alternativer.",
        "Dokumenter operatørtildelinger og krav til etteranalyse.",
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
      en: "Qualification context Spectr uses when evaluating operational fit for a software deployment.",
      no: "Kvalifiseringskontekst Spectr bruker ved vurdering av operasjonell egnethet for programvaredeployering.",
    },
    body: {
      en: [
        "Define the operating environment, authorization requirements, mission objectives, fleet mix, and support model before deployment planning begins.",
        "Spectr uses this context to align software configuration, documentation, and training expectations with the customer workflow.",
      ],
      no: [
        "Definer operasjonsmiljø, autorisasjonskrav, oppdragsmål, flåtesammensetning og støttemodell før deployeringsplanlegging starter.",
        "Spectr bruker denne konteksten for å avstemme programvarekonfigurasjon, dokumentasjon og opplæringsforventninger med kundens arbeidsflyt.",
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
        "Include fleet context, operating environment, and the specific technical question when contacting Spectr.",
        "For active procurement or deployment conversations, reference your existing contact point where possible.",
      ],
      no: [
        "Inkluder flåtekontekst, operasjonsmiljø og det spesifikke tekniske spørsmålet når du kontakter Spectr.",
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
