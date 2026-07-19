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

const possibilityKeys = ["denied", "fleet", "inspection", "defense"] as const;

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
  const benefits = t.raw("benefits") as string[];

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-[#f8f8f8] px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-[88rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">{t("title")}</p>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-fg sm:text-7xl lg:text-8xl"
            >
              {t("tagline")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted sm:text-lg">{t("heroIntro")}</p>
          </div>
        </section>

        <section className="brand-font bg-black px-5 py-16 text-white sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[88rem]">
            <EngineConsole
              flyLabel={t("flyLabel")}
              configureLabel={t("configureLabel")}
              flyTitle={t("flyTitle")}
              flyDescription={t("flyDescription")}
              configureTitle={t("configureTitle")}
              configureDescription={t("configureDescription")}
            />
          </div>
        </section>

        <section className="brand-font bg-white px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-[88rem]">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-fg sm:text-5xl">
              {t("possibilitiesTitle")}
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {possibilityKeys.map((key) => (
                <article key={key} className="border-t border-[#d4d4d4] pt-6">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-fg">
                    {t(`possibilities.${key}.title`)}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted">{t(`possibilities.${key}.text`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-[#f8f8f8] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl">
              {t("benefitsTitle")}
            </h2>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{t("benefitsLabel")}</p>
              <ul className="mt-6 space-y-4 text-base leading-7 text-muted">
                {benefits.map((benefit) => (
                  <li key={benefit} className="border-b border-[#d4d4d4] pb-4">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="brand-font bg-black px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">{t("ctaTitle")}</h2>
            <BevelButton href="/contact" variant="inverse-primary" className="w-fit tracking-[0.16em]">
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
