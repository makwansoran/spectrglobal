import { getTranslations, setRequestLocale } from "next-intl/server";
import { AutonomousEngineSection } from "@/components/autonomous-engine-section";
import { Footer } from "@/components/footer";
import { HomeApplications } from "@/components/home-applications";
import { HomeBigPicture } from "@/components/home-big-picture";
import { HomeCapabilityGrid } from "@/components/home-capability-grid";
import { HomeExclusionBanner } from "@/components/home-exclusion-banner";
import { HomeFaq } from "@/components/home-faq";
import { HomeLaunchCta } from "@/components/home-launch-cta";
import { HomeRoadmap } from "@/components/home-roadmap";
import { Nav } from "@/components/nav";
import { ScrubPhrase } from "@/components/scrub-phrase";
import {
  applicationCardHrefs,
  applicationCardImages,
  featuredApplicationSlugs,
} from "@/lib/applications";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

const capabilityRows = [
  ["agents", "command", "inspection"],
  ["ondemand", "dynamic", "deploy"],
] as const;

const capabilityKeysWithSecondary = new Set(["agents", "command", "inspection"]);

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const capabilities = capabilityRows.map((row) =>
    row.map((key) => ({
      key,
      title: t(`capabilities.${key}.title`),
      text: t(`capabilities.${key}.text`),
      secondaryTitle: capabilityKeysWithSecondary.has(key)
        ? t(`capabilities.${key}.secondaryTitle`)
        : undefined,
      secondaryText: capabilityKeysWithSecondary.has(key)
        ? t(`capabilities.${key}.secondaryText`)
        : undefined,
      imageSrc: undefined as string | undefined,
    })),
  );

  const applications = featuredApplicationSlugs.map((slug) => ({
    slug,
    title: t(`applications.${slug}.title`),
    text: t(`applications.${slug}.text`),
    imageSrc: applicationCardImages[slug],
    href: applicationCardHrefs[slug],
  }));

  const bigPictureItems = t.raw("bigPictureItems") as {
    text: string;
    emphasis: boolean;
  }[];
  const faq = t.raw("faq") as { question: string; answer: string }[];
  const milestones = t.raw("roadmapMilestones") as {
    year: string;
    scale: string;
    summary: string;
    autonomyTitle: string;
    autonomy: string[];
  }[];

  return (
    <>
      <Nav />

      <main id="main-content" data-scroll-root className="flex-1">
        <AutonomousEngineSection
          title={t("autonomousEngineTitle")}
          eager
        />

        <ScrubPhrase text={t("statementPhrase")} />

        <HomeCapabilityGrid rows={capabilities} />

        <HomeApplications title={t("applicationsTitle")} items={applications} />

        <HomeBigPicture
          title={t("bigPictureTitle")}
          imageAlt={t("bigPictureImageAlt")}
          imageSrc="/big-picture.png"
          items={bigPictureItems}
        />

        <HomeRoadmap title={t("roadmapTitle")} milestones={milestones} />

        <HomeExclusionBanner text={t("exclusionBanner")} cta={tCommon("learnMore")} />

        <HomeFaq title={t("faqTitle")} items={faq} contactLabel={t("contactUs")} />

        <HomeLaunchCta
          title={t("launchTitle")}
          contactLabel={t("contactUs")}
          joinLabel={t("joinUs")}
        />

        <Footer />
      </main>
    </>
  );
}
