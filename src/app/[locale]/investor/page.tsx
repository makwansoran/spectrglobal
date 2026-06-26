import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";

type InvestorPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: InvestorPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Investor" });
  return { title: t("title") };
}

export default async function InvestorPage({ params }: InvestorPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Investor" });
  const common = await getTranslations({ locale, namespace: "Common" });

  const focusAreas = ["updates", "milestones", "roadmap"] as const;

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
            <p className="mt-10 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">{t("intro")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">{t("headline")}</h2>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-3">
              {focusAreas.map((key) => (
                <article key={key} className="bg-surface p-7 sm:p-8">
                  <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">{t(`focus.${key}.title`)}</h3>
                  <p className="mt-5 text-sm leading-7 text-muted">{t(`focus.${key}.text`)}</p>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-20 max-w-4xl text-center">
              <ScrollRevealHeading
                as="h2"
                revealOnMount
                className="text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl"
              >
                {t("quote")}
              </ScrollRevealHeading>
              <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">{t("quoteAttribution")}</p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("ctaTitle")}
            </h2>
            <BevelButton href="/contact" className="w-fit">
              {common("contactSpectr")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
