import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title") };
}

const teamKeys = ["manufacturing", "platforms", "avionics"] as const;
const milestoneKeys = ["2024", "2025", "2026"] as const;

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
                {t("builtFor")}
              </h2>
            </div>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-7xl gap-5 lg:grid-cols-3">
            {teamKeys.map((key) => (
              <article key={key} className="bg-surface p-7 sm:p-8">
                <p className="label">{t(`team.${key}.role`)}</p>
                <h3 className="mt-4 text-3xl font-semibold leading-none tracking-[-0.055em] text-fg">
                  {t(`team.${key}.name`)}
                </h3>
                <p className="mt-6 text-sm leading-7 text-muted">{t(`team.${key}.text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              {t("historyTitle")}
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {milestoneKeys.map((year) => (
                <article key={year} className="bg-surface p-7 sm:p-8">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{year}</p>
                  <h3 className="mt-6 text-3xl font-semibold tracking-[-0.055em] text-fg">
                    {t(`milestones.${year}.title`)}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-muted">{t(`milestones.${year}.text`)}</p>
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
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
            >
              {tCommon("contactUs")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
