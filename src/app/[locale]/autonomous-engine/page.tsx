import { EngineConsole } from "@/components/autonomous-engine/engine-console";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type AutonomousEnginePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AutonomousEnginePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AutonomousEngine" });
  return buildPageMetadata({
    title: t("title"),
    description: t("tagline"),
    path: localizedPath(locale, "/autonomous-engine"),
    locale,
  });
}

export default async function AutonomousEnginePage({ params }: AutonomousEnginePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "AutonomousEngine" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-5xl">
            <ScrollRevealHeading
              as="h1"
              className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl"
            >
              {t("title")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{t("heroIntro")}</p>

            <div className="mt-12">
              <EngineConsole
                flyLabel={t("flyLabel")}
                configureLabel={t("configureLabel")}
                flyTitle={t("flyTitle")}
                flyDescription={t("flyDescription")}
                configureTitle={t("configureTitle")}
                configureDescription={t("configureDescription")}
              />
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("ctaTitle")}
            </h2>
            <BevelButton href="/contact" className="w-fit">
              {tCommon("requestAccess")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
