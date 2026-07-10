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
      en: "Build autonomous drone mission workflows, command interfaces, and software that helps operators maintain context under pressure.",
      no: "Bygg autonome droneoppdragsflyt, kommandogrensesnitt og programvare som hjelper operatører å beholde kontekst under press.",
    },
    responsibilities: {
      en: [
        "Develop Centurion mission tooling and fleet coordination interfaces",
        "Work closely with operator workflow requirements",
        "Maintain secure, reliable software delivery practices",
      ],
      no: [
        "Utvikle Centurion oppdragsverktøy og flåtekoordineringsgrensesnitt",
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
