import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { LazyBackgroundVideo } from "@/components/lazy-background-video";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { VideoBrandBadge } from "@/components/video-brand-badge";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type AutonomousEnginePageProps = {
  params: Promise<{ locale: string }>;
};

const featureKeys = ["execution", "denied", "integration"] as const;

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
        <section className="brand-font relative flex min-h-screen items-end overflow-hidden bg-black text-white">
          <LazyBackgroundVideo src="/autonomous-engine.mp4" />
          <VideoBrandBadge />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
          <div className="relative z-10 w-full px-5 pb-16 pt-36 sm:px-8 lg:px-16 lg:pb-24 lg:pt-44">
            <div className="mx-auto max-w-[88rem]">
              <ScrollRevealHeading
                as="h1"
                className="max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl"
              >
                {t("title")}
              </ScrollRevealHeading>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{t("heroIntro")}</p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              {t("overviewTitle")}
            </h2>
            <p className="text-base leading-8 text-muted sm:text-lg">{t("overviewText")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {featureKeys.map((key) => (
                <article key={key} className="bg-surface p-7 sm:p-8">
                  <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-muted">{t(`features.${key}.text`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
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
