import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cookieSections, pickLegalField, privacySections } from "@/lib/legal";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal" });
  return buildPageMetadata({
    title: t("privacyTitle"),
    description: t("lastUpdated"),
    path: localizedPath(locale, "/privacy"),
    locale,
  });
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Legal" });

  return (
    <>
      <Nav />
      <ScrollProgress />
      <main id="main-content" className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("privacyTitle")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/58">{t("lastUpdated")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl space-y-4">
            {privacySections.map((section) => (
              <article key={pickLegalField(section.title, typedLocale)} className="bg-surface p-7 sm:p-8">
                <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                  {pickLegalField(section.title, typedLocale)}
                </h2>
                <p className="mt-5 text-sm leading-7 text-muted sm:text-base">
                  {pickLegalField(section.text, typedLocale)}
                </p>
                {section.bullets ? (
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-7 text-muted sm:text-base">
                    {pickLegalField(section.bullets, typedLocale).map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.hasContactLink ? (
                  <Link
                    href="/contact"
                    className="mt-7 inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                  >
                    {t("contactCta")}
                    <span aria-hidden="true">→</span>
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-black px-5 py-20 text-white sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">{t("cookieTitle")}</h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">{t("cookieIntro")}</p>
            <div className="mt-10 space-y-4">
              {cookieSections.map((section) => (
                <article key={pickLegalField(section.title, typedLocale)} className="border border-white/10 bg-white/[0.04] p-7 sm:p-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.05em] text-white">
                    {pickLegalField(section.title, typedLocale)}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">
                    {pickLegalField(section.text, typedLocale)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
