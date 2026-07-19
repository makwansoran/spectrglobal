import { getTranslations, setRequestLocale } from "next-intl/server";
import { AutonomousEngineSection } from "@/components/autonomous-engine-section";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { HomeApplications } from "@/components/home-applications";
import { HomeCapabilityGrid } from "@/components/home-capability-grid";
import { HomeFaq } from "@/components/home-faq";
import { HomeRoadmap } from "@/components/home-roadmap";
import { Nav } from "@/components/nav";
import { ScrubPhrase } from "@/components/scrub-phrase";
import {
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

const roadmapYears = ["2026", "2027", "2028", "2030"] as const;

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
      // Add files to /public/capabilities/{key}.svg then set e.g. `/capabilities/${key}.svg`
      imageSrc: undefined as string | undefined,
    })),
  );

  const applications = featuredApplicationSlugs.map((slug) => ({
    slug,
    title: t(`applications.${slug}.title`),
    text: t(`applications.${slug}.text`),
    imageSrc: applicationCardImages[slug],
  }));

  const bigPicture = t.raw("bigPictureBody") as string[];
  const faq = t.raw("faq") as { question: string; answer: string }[];

  const phases = roadmapYears.map((year) => ({
    year,
    scale: t(`roadmap.${year}.scale`),
    autonomy: t.raw(`roadmap.${year}.autonomy`) as string[],
    command: t.raw(`roadmap.${year}.command`) as string[],
  }));

  return (
    <>
      <Nav />

      <main id="main-content" data-scroll-root className="flex-1">
        <AutonomousEngineSection
          title={t("autonomousEngineTitle")}
          cta={t("tryNow")}
          eager
        />

        <ScrubPhrase text={t("statementPhrase")} />

        <HomeCapabilityGrid rows={capabilities} />

        <HomeApplications title={t("applicationsTitle")} items={applications} />

        <section className="brand-font bg-bg px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
          <div className="mx-auto w-full max-w-[88rem]">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl lg:text-6xl">
              {t("bigPictureTitle")}
            </h2>
            <div className="mt-12 max-w-3xl space-y-6 text-base leading-8 text-muted sm:text-lg">
              {bigPicture.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <HomeRoadmap
          title={t("roadmapTitle")}
          note={t("roadmapNote")}
          learnMore={tCommon("learnMore")}
          phases={phases}
          autonomyLabel={t("roadmapAutonomy")}
          commandLabel={t("roadmapCommand")}
        />

        <HomeFaq title={t("faqTitle")} items={faq} contactLabel={tCommon("contactUs")} />

        <section className="brand-font flex min-h-[70vh] items-center bg-black px-5 py-28 text-white sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[88rem]">
            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              {t("ctaTitle")}
            </h2>
            <BevelButton href="/contact" variant="inverse-primary" size="lg" className="mt-12 w-fit">
              {tCommon("contactSpectr")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
