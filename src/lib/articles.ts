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
    slug: "valkyrie-field-readiness-2026",
    category: "press-releases",
    date: "2026-03-12",
    title: {
      en: "Spectr advances VALKYRIE toward field readiness",
      no: "Spectr bringer VALKYRIE nærmere feltklarhet",
    },
    excerpt: {
      en: "Spectr continues qualification work on VALKYRIE as teams refine sensing configuration, operator workflow, and deployment support.",
      no: "Spectr fortsetter kvalifiseringsarbeid på VALKYRIE mens teamene finjusterer sensoroppsett, operatørflyt og deployeringsstøtte.",
    },
    body: {
      en: [
        "Spectr is continuing structured qualification work on VALKYRIE, its mission-configurable reconnaissance UAV platform. The focus is on practical field readiness: sensing configuration, operator workflow, and the support model required for real deployments.",
        "Recent work has centered on refining pre-mission planning, launch and recovery procedures, and the documentation operators need before taking a platform into the field. Spectr is building around the realities of deployment rather than demo conditions.",
        "Organizations evaluating VALKYRIE can request procurement conversations through Spectr's contact channel with operational context, sensing requirements, and qualification needs.",
      ],
      no: [
        "Spectr fortsetter strukturert kvalifiseringsarbeid på VALKYRIE, selskapets oppdragskonfigurerbare rekognoserings-UAV. Fokus er praktisk feltklarhet: sensoroppsett, operatørflyt og støttemodellen som kreves for reelle deployeringer.",
        "Nylig arbeid har handlet om å finjustere planlegging før oppdrag, start- og landingsprosedyrer, og dokumentasjon operatører trenger før plattformen tas i bruk i felt.",
        "Organisasjoner som vurderer VALKYRIE kan be om innkjøpssamtaler via Spectrs kontaktkanal med operasjonell kontekst, sensorbehov og kvalifiseringskrav.",
      ],
    },
    image: "/valkyrie-mountain.png",
    imageAlt: {
      en: "VALKYRIE UAV in mountain terrain",
      no: "VALKYRIE UAV i fjellterreng",
    },
  },
  {
    slug: "centurion-mission-dashboard",
    category: "blog",
    date: "2026-02-04",
    title: {
      en: "Designing CENTURION for mission context under pressure",
      no: "Slik designer vi CENTURION for oppdragskontekst under press",
    },
    excerpt: {
      en: "CENTURION keeps map context, assets, and coordination tools in one command interface built for operators working under time pressure.",
      no: "CENTURION samler kartkontekst, ressurser og koordineringsverktøy i ett kommandogrensesnitt for operatører under tidspress.",
    },
    body: {
      en: [
        "CENTURION is Spectr's command dashboard for monitoring missions and coordinating field activity. The product direction is straightforward: keep the operational picture readable when decisions need to happen quickly.",
        "That means map context, mission layers, live feeds, and coordination tools should stay close together instead of forcing operators to reconstruct context across disconnected screens.",
        "Spectr is developing CENTURION alongside VALKYRIE so hardware deployments and software-assisted operations can evolve together from Norway.",
      ],
      no: [
        "CENTURION er Spectrs kommandodashbord for overvåking av oppdrag og koordinering av feltaktivitet. Produktretningen er enkel: hold det operasjonelle bildet lesbart når beslutninger må tas raskt.",
        "Det betyr at kartkontekst, oppdragslag, live-feeds og koordineringsverktøy skal holdes samlet i stedet for at operatører må rekonstruere kontekst på tvers av frakoblede skjermer.",
        "Spectr utvikler CENTURION parallelt med VALKYRIE slik at hardware-deployeringer og programvareassisterte operasjoner kan utvikles sammen fra Norge.",
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
      en: "A note on Spectr's direction: national control, practical engineering, and systems that hold up outside the lab.",
      no: "Et notat om Spectrs retning: nasjonal kontroll, praktisk ingeniørarbeid og systemer som tåler bruk utenfor labben.",
    },
    body: {
      en: [
        "Spectr exists to build technology that remains useful in the field. That requires more than impressive prototypes. It requires disciplined engineering, clear ownership, and systems designed around operator workflow.",
        "Our work on VALKYRIE and CENTURION reflects that belief. One platform gathers information. The other helps teams keep context while acting on it. Both are being developed and controlled from Norway.",
        "We will continue sharing milestones, product notes, and company updates through the newsroom as that work progresses.",
      ],
      no: [
        "Spectr finnes for å bygge teknologi som forblir nyttig i felt. Det krever mer enn imponerende prototyper. Det krever disiplinert ingeniørarbeid, tydelig eierskap og systemer designet rundt operatørflyt.",
        "Arbeidet vårt med VALKYRIE og CENTURION gjenspeiler det. Den ene plattformen samler informasjon. Den andre hjelper team å beholde kontekst mens de handler. Begge utvikles og kontrolleres fra Norge.",
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
      en: "Spectr highlighted for Norwegian aerospace development",
      no: "Spectr fremhevet for norsk luftfartsutvikling",
    },
    excerpt: {
      en: "External reporting on Spectr's focus on mission-ready aerial systems and operational software developed in Norway.",
      no: "Ekstern dekning av Spectrs fokus på oppdragsklare luftfartssystemer og operasjonell programvare utviklet i Norge.",
    },
    body: {
      en: [
        "Spectr has been covered for its work on practical aerial systems and operational software developed from Norway, with emphasis on field reliability and national control over critical technology.",
        "Media coverage referenced Spectr's direction across UAV platforms and command tooling, including VALKYRIE and CENTURION.",
        "For media inquiries, contact Spectr through the official contact channel with publication details and deadline context.",
      ],
      no: [
        "Spectr har blitt omtalt for arbeidet med praktiske luftfartssystemer og operasjonell programvare utviklet fra Norge, med vekt på feltpålitelighet og nasjonal kontroll over kritisk teknologi.",
        "Mediedekningen refererte til Spectrs retning innen UAV-plattformer og kommandoverktøy, inkludert VALKYRIE og CENTURION.",
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
