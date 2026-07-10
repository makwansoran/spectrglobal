import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type Article = {
  slug: string;
  category: string;
  date: string;
  title: Localized;
  excerpt: Localized;
  body: Localized<string[]>;
  image: string;
  imageAlt: Localized;
};

export const articles: Article[] = [
  {
    slug: "centurion-mission-dashboard",
    category: "blog",
    date: "2026-02-04",
    title: {
      en: "Designing CENTURION for mission context under pressure",
      no: "Slik designer vi CENTURION for oppdragskontekst under press",
    },
    excerpt: {
      en: "Centurion v0.1 is operational with mission staging, AI-assisted decision support, and multi-asset coordination across diverse drone fleets.",
      no: "Centurion v0.1 er operativ med mission staging, AI-assistert beslutningsstøtte og multi-enhet-koordinering på tvers av ulike droneflåter.",
    },
    body: {
      en: [
        "Centurion is Spectr's sovereign mission command platform. The operator defines goals and constraints. Centurion plans, coordinates, and reports.",
        "v0.1 is demo-ready with mission staging and AI chat operational. Natural language interface lets operators query, command, and analyze live mission data across mixed fleets.",
        "Spectr builds Centurion as platform-agnostic mission software — developed and controlled from Norway for operators who need capability without replacing existing airframes.",
      ],
      no: [
        "Centurion er Spectrs suverene oppdragskommandoplattform. Operatøren definerer mål og begrensninger. Centurion planlegger, koordinerer og rapporterer.",
        "v0.1 er demo-klar med mission staging og AI-chat operativ. Naturlig språkgrensesnitt lar operatører spørre, kommandere og analysere live oppdragsdata på tvers av blandede flåter.",
        "Spectr bygger Centurion som plattformuavhengig oppdragsprogramvare — utviklet og kontrollert fra Norge for operatører som trenger kapabilitet uten å erstatte eksisterende luftfartøy.",
      ],
    },
    image: "/centurion-laptop-mockup.png",
    imageAlt: {
      en: "CENTURION command dashboard on laptop",
      no: "CENTURION kommandodashbord på laptop",
    },
  },
  {
    slug: "norwegian-operations-update",
    category: "from-the-ceo",
    date: "2026-01-18",
    title: {
      en: "Building critical capability from Norway",
      no: "Bygger kritisk kapabilitet fra Norge",
    },
    excerpt: {
      en: "A note on Spectr's direction: national control, practical engineering, and software that holds up outside the lab.",
      no: "Et notat om Spectrs retning: nasjonal kontroll, praktisk ingeniørarbeid og programvare som tåler bruk utenfor labben.",
    },
    body: {
      en: [
        "Spectr exists to build technology that remains useful in the field. That requires more than impressive demos. It requires disciplined engineering, clear ownership, and software designed around operator workflow.",
        "Our work on Centurion reflects that belief — sovereign mission software that helps teams plan, coordinate, and act with context when conditions degrade. It is developed and controlled from Norway.",
        "We will continue sharing milestones, product notes, and company updates through the newsroom as that work progresses.",
      ],
      no: [
        "Spectr finnes for å bygge teknologi som forblir nyttig i felt. Det krever mer enn imponerende demoer. Det krever disiplinert ingeniørarbeid, tydelig eierskap og programvare designet rundt operatørflyt.",
        "Arbeidet vårt med Centurion gjenspeiler det — suveren oppdragsprogramvare som hjelper team planlegge, koordinere og handle med kontekst når forholdene degraderes. Den utvikles og kontrolleres fra Norge.",
        "Vi vil fortsette å dele milepæler, produktnotater og selskapsoppdateringer via newsroom etter hvert som arbeidet skrider frem.",
      ],
    },
    image: "/hero-fjord.png",
    imageAlt: {
      en: "Norwegian landscape",
      no: "Norsk landskap",
    },
  },
  {
    slug: "spectr-norway-coverage",
    category: "media-coverage",
    date: "2025-11-02",
    title: {
      en: "Spectr highlighted for Norwegian defense software development",
      no: "Spectr fremhevet for norsk forsvarsprogramvareutvikling",
    },
    excerpt: {
      en: "External reporting on Spectr's focus on mission-ready autonomous drone software developed in Norway.",
      no: "Ekstern dekning av Spectrs fokus på oppdragsklar autonom droneprogramvare utviklet i Norge.",
    },
    body: {
      en: [
        "Spectr has been covered for its work on practical mission software developed from Norway, with emphasis on field reliability and national control over critical technology.",
        "Media coverage referenced Spectr's direction in autonomous drone software and sovereign mission command tooling, including Centurion.",
        "For media inquiries, contact Spectr through the official contact channel with publication details and deadline context.",
      ],
      no: [
        "Spectr har blitt omtalt for arbeidet med praktisk oppdragsprogramvare utviklet fra Norge, med vekt på feltpålitelighet og nasjonal kontroll over kritisk teknologi.",
        "Mediedekningen refererte til Spectrs retning innen autonom droneprogramvare og suverent oppdragskommandoverktøy, inkludert Centurion.",
        "For mediehenvendelser, kontakt Spectr via den offisielle kontaktkanalen med publikasjonsdetaljer og frist.",
      ],
    },
    image: "/operations-hq.jpg",
    imageAlt: {
      en: "Spectr operations workspace",
      no: "Spectr operasjonsarbeidsplass",
    },
  },
];

export function getArticlesByCategory(category: string) {
  return articles
    .filter((article) => article.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getArticle(category: string, slug: string) {
  return articles.find((article) => article.category === category && article.slug === slug);
}

export function getArticleTitle(article: Article, locale: Locale) {
  return pick(article.title, locale);
}

export function getArticleExcerpt(article: Article, locale: Locale) {
  return pick(article.excerpt, locale);
}

export function getArticleBody(article: Article, locale: Locale) {
  return pick(article.body, locale);
}

export function getArticleImageAlt(article: Article, locale: Locale) {
  return pick(article.imageAlt, locale);
}
