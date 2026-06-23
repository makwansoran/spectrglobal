import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type JobListing = {
  slug: string;
  title: Localized;
  location: Localized;
  type: Localized;
  summary: Localized;
  responsibilities: Localized<string[]>;
};

export const jobListings: JobListing[] = [
  {
    slug: "aerospace-systems-engineer",
    title: {
      en: "Aerospace Systems Engineer",
      no: "Luftfartssystemingeniør",
    },
    location: {
      en: "Norway",
      no: "Norge",
    },
    type: {
      en: "Full-time",
      no: "Heltid",
    },
    summary: {
      en: "Work on UAV platforms, airframe integration, and field-ready hardware for demanding operational environments.",
      no: "Arbeid med UAV-plattformer, airframe-integrasjon og feltklart hardware for krevende operasjonelle miljøer.",
    },
    responsibilities: {
      en: [
        "Develop and test UAV platform configurations",
        "Support sensing integration and deployment constraints",
        "Collaborate on documentation and field readiness",
      ],
      no: [
        "Utvikle og teste UAV-plattformkonfigurasjoner",
        "Støtte sensorintegrasjon og deployeringsbegrensninger",
        "Samarbeide om dokumentasjon og feltklarhet",
      ],
    },
  },
  {
    slug: "operational-software-engineer",
    title: {
      en: "Operational Software Engineer",
      no: "Operasjonell programvareingeniør",
    },
    location: {
      en: "Norway",
      no: "Norge",
    },
    type: {
      en: "Full-time",
      no: "Heltid",
    },
    summary: {
      en: "Build mission workflows, command interfaces, and software that helps operators maintain context under pressure.",
      no: "Bygg oppdragsflyt, kommandogrensesnitt og programvare som hjelper operatører å beholde kontekst under press.",
    },
    responsibilities: {
      en: [
        "Develop CENTURION mission tooling and interfaces",
        "Work closely with operator workflow requirements",
        "Maintain secure, reliable software delivery practices",
      ],
      no: [
        "Utvikle CENTURION oppdragsverktøy og grensesnitt",
        "Jobbe tett med operatørflyt-krav",
        "Opprettholde sikker og pålitelig programvareleveranse",
      ],
    },
  },
];

export function getJob(slug: string) {
  return jobListings.find((job) => job.slug === slug);
}

export function pickJobField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}
