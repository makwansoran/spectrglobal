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
    slug: "recon-field-readiness-2026",
    category: "press-releases",
    date: "2026-03-12",
    title: {
      en: "Spectr advances RECON toward field readiness",
      no: "Spectr bringer RECON nærmere feltklarhet",
    },
    excerpt: {
      en: "RECON prototype assembled with ground testing ongoing as Spectr advances toward flight test and ICE worx demo readiness.",
      no: "RECON-prototype montert med bakketesting pågående mens Spectr jobber mot flytest og ICE worx-demo.",
    },
    body: {
      en: [
        "Spectr's RECON airframe prototype is assembled with ground testing ongoing. The platform is a VTOL fixed-wing ISR system designed for autonomous operation in GNSS-denied and comms-denied environments.",
        "Current work focuses on flight test preparation, avionics integration, and qualification toward TRL 5. Centurion v0.1 is operational with mission staging and AI chat — demo-ready.",
        "Organizations evaluating RECON can request procurement conversations through Spectr's contact channel with operational context and qualification needs.",
      ],
      no: [
        "Spectrs RECON-luftfartøyprototype er montert med bakketesting pågående. Plattformen er et VTOL fastvinge-ISR-system designet for autonom drift i GNSS-nektede og samband-nektede miljøer.",
        "Nåværende arbeid fokuserer på flytestforberedelse, avionikkintegrasjon og kvalifisering mot TRL 5. Centurion v0.1 er operativ med mission staging og AI-chat — demo-klar.",
        "Organisasjoner som vurderer RECON kan be om innkjøpssamtaler via Spectrs kontaktkanal med operasjonell kontekst og kvalifiseringsbehov.",
      ],
    },
    image: "/recon-mountain.png",
    imageAlt: {
      en: "RECON UAV in mountain terrain",
      no: "RECON UAV i fjellterreng",
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
      en: "Centurion v0.1 is operational with mission staging, AI-assisted decision support, and multi-drone coordination.",
      no: "Centurion v0.1 er operativ med mission staging, AI-assistert beslutningsstøtte og multi-drone-koordinering.",
    },
    body: {
      en: [
        "Centurion is Spectr's sovereign command platform. The operator defines goals and waypoints. Centurion plans, executes, and reports.",
        "v0.1 is demo-ready with mission staging and AI chat operational. Natural language interface lets operators query, command, and analyze live mission data. Multiple RECON units can be coordinated as one operation.",
        "Spectr is developing Centurion alongside RECON so hardware deployments and software-assisted operations evolve together from Norway.",
      ],
      no: [
        "Centurion er Spectrs suverene kommandoplattform. Operatøren definerer mål og waypoints. Centurion planlegger, utfører og rapporterer.",
        "v0.1 er demo-klar med mission staging og AI-chat operativ. Naturlig språk-grensesnitt lar operatører spørre, kommandere og analysere live oppdragsdata. Flere RECON-enheter kan koordineres som én operasjon.",
        "Spectr utvikler Centurion parallelt med RECON slik at hardware-deployeringer og programvareassisterte operasjoner utvikles sammen fra Norge.",
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
        "Our work on RECON and CENTURION reflects that belief. One platform gathers information. The other helps teams keep context while acting on it. Both are being developed and controlled from Norway.",
        "We will continue sharing milestones, product notes, and company updates through the newsroom as that work progresses.",
      ],
      no: [
        "Spectr finnes for å bygge teknologi som forblir nyttig i felt. Det krever mer enn imponerende prototyper. Det krever disiplinert ingeniørarbeid, tydelig eierskap og systemer designet rundt operatørflyt.",
        "Arbeidet vårt med RECON og CENTURION gjenspeiler det. Den ene plattformen samler informasjon. Den andre hjelper team å beholde kontekst mens de handler. Begge utvikles og kontrolleres fra Norge.",
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
        "Media coverage referenced Spectr's direction across UAV platforms and command tooling, including RECON and CENTURION.",
        "For media inquiries, contact Spectr through the official contact channel with publication details and deadline context.",
      ],
      no: [
        "Spectr har blitt omtalt for arbeidet med praktiske luftfartssystemer og operasjonell programvare utviklet fra Norge, med vekt på feltpålitelighet og nasjonal kontroll over kritisk teknologi.",
        "Mediedekningen refererte til Spectrs retning innen UAV-plattformer og kommandoverktøy, inkludert RECON og CENTURION.",
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
