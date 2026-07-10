import type { Locale } from "@/i18n/routing";
import { pick, type Localized } from "@/lib/locale";

export type NewsroomCard = {
  slug: string;
  image: string;
  alt: Localized;
  title: Localized;
  action: Localized;
  description: Localized;
};

export const newsroomCards: NewsroomCard[] = [
  {
    slug: "media-coverage",
    image: "/operations-hq.jpg",
    alt: {
      en: "Spectr operator workspace for media coverage",
      no: "Spectr operatørarbeidsplass for mediedekning",
    },
    title: { en: "Media Coverage", no: "Mediedekning" },
    action: { en: "Read the Latest", no: "Les det siste" },
    description: {
      en: "Coverage, mentions, and external reporting on Spectr.",
      no: "Dekning, omtaler og ekstern rapportering om Spectr.",
    },
  },
  {
    slug: "press-releases",
    image: "/newsroom-press-releases.png",
    alt: {
      en: "Oslo waterfront and opera house",
      no: "Oslo havnefront og operahus",
    },
    title: { en: "Press Releases", no: "Pressemeldinger" },
    action: { en: "Browse Press Releases", no: "Se pressemeldinger" },
    description: {
      en: "Official company announcements and operating milestones.",
      no: "Offisielle selskapskunngjøringer og operative milepæler.",
    },
  },
  {
    slug: "blog",
    image: "/newsroom-blog.png",
    alt: {
      en: "Spectr blog visual mark on black background",
      no: "Spectr blogg-visuelt merke på svart bakgrunn",
    },
    title: { en: "Blog", no: "Blogg" },
    action: { en: "Read More", no: "Les mer" },
    description: {
      en: "Software release notes, deployment updates, and company stories.",
      no: "Programvareversjonsnotater, deployeringsoppdateringer og selskapshistorier.",
    },
  },
  {
    slug: "from-the-ceo",
    image: "/hero-fjord.png",
    alt: {
      en: "Norwegian landscape behind Spectr company updates",
      no: "Norsk landskap bak Spectr selskapsoppdateringer",
    },
    title: { en: "From The CEO", no: "Fra CEO" },
    action: { en: "Read More", no: "Les mer" },
    description: {
      en: "Founder notes and leadership updates from Spectr.",
      no: "Grunnleggernotater og ledelsesoppdateringer fra Spectr.",
    },
  },
];

export function getNewsroomCard(slug: string) {
  return newsroomCards.find((card) => card.slug === slug);
}

export function getNewsroomCardField<T>(value: Localized<T>, locale: Locale): T {
  return pick(value, locale);
}

export function newsroomHref(slug: string) {
  return `/newsroom/${slug}`;
}
