import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { HeroBrandLockup } from "@/components/hero-brand-lockup";
import { Nav } from "@/components/nav";
import { SecurityPrinciplesList } from "@/components/security-principles-list";
import { BevelButton } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";
import { pickSecurityField, securityPrinciples } from "@/lib/security-principles";

type SecurityPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SecurityPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Security" });
  return buildPageMetadata({ title: t("title"), description: t("description"), path: localizedPath(locale, "/security"), locale });
}

export default async function SecurityPage({ params }: SecurityPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Security" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const securityTitle = t("title");
  const brandLockupDelay = securityTitle.replace(/\s/g, "").length * 14 + 80;
  const principles = securityPrinciples.map((principle) => ({
    slug: principle.slug,
    title: pickSecurityField(principle.title, typedLocale),
    text: pickSecurityField(principle.text, typedLocale),
    paragraphs: pickSecurityField(principle.paragraphs, typedLocale),
  }));

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 bg-bg">
        <section className="brand-font relative flex min-h-screen items-center justify-center bg-black px-5 py-36 text-center text-white sm:px-8 lg:py-44">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
            <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="mx-auto max-w-6xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[8.5rem]"
              >
                {securityTitle}
              </ScrollRevealHeading>
              <HeroBrandLockup brand={tNav("brand")} revealDelay={brandLockupDelay} />
            </div>
          </div>
          <a
            href="#security-principles"
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45 transition-colors hover:text-white sm:bottom-12"
          >
            <span>{t("scrollToVerify")}</span>
            <span className="security-scroll-icon" aria-hidden="true">
              <span />
            </span>
          </a>
        </section>

        <section id="security-principles" className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-14 max-w-4xl text-3xl font-semibold leading-[1.02] tracking-[-0.05em] text-fg sm:mb-20 sm:text-5xl lg:text-6xl">
              {t("principlesHeadline")}
            </h2>
            <SecurityPrinciplesList principles={principles} />
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-10 border border-border bg-black p-7 text-white sm:p-10 lg:grid-cols-[0.8fr_1.2fr] lg:p-12">
            <h2 className="max-w-2xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
              {t("criticalLocal")}
            </h2>
            <div>
              <h3 className="text-3xl font-semibold tracking-[-0.05em] text-white">{t("legalCompliance")}</h3>
              <p className="mt-6 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">{t("legalText1")}</p>
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">{t("legalText2")}</p>
              <BevelButton
                href="https://lovdata.no/lov/2018-06-01-24/%C2%A79-3"
                external
                variant="inverse-secondary"
                className="mt-8 w-fit"
              >
                {t("lovdataCta")}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto flex max-w-7xl justify-center text-center">
            <h2 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("nationalControl")}
            </h2>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
