import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import type { Locale } from "@/i18n/routing";
import { pickLegalField, termsSections } from "@/lib/legal";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return buildPageMetadata({
    title: t("termsTitle"),
    description: t("lastUpdated"),
    path: localizedPath(locale, "/terms"),
    locale,
  });
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Legal" });

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("termsTitle")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/58">{t("lastUpdated")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl space-y-4">
            {termsSections.map((section) => (
              <article key={pickLegalField(section.title, typedLocale)} className="bg-surface p-7 sm:p-8">
                <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                  {pickLegalField(section.title, typedLocale)}
                </h2>
                <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
                  {pickLegalField(section.text, typedLocale)}
                </p>
              </article>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
