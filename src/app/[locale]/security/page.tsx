import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
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

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1 bg-bg">
        <section className="brand-font relative flex min-h-screen items-center bg-black px-5 py-36 text-white sm:px-8 lg:py-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-6xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-7xl lg:text-[8.5rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
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
          <div className="mx-auto max-w-6xl space-y-8">
            {securityPrinciples.map((principle) => (
              <Link
                key={principle.slug}
                href={`/security/${principle.slug}`}
                className="group block w-full text-left"
              >
                <span className="grid gap-5 py-3 sm:grid-cols-[260px_1fr] sm:items-start">
                  <span className="text-3xl font-semibold leading-none tracking-[-0.055em] text-fg">
                    {pickSecurityField(principle.title, typedLocale)}
                  </span>
                  <span className="max-w-3xl text-sm leading-7 text-muted">
                    {pickSecurityField(principle.text, typedLocale)}
                  </span>
                </span>
                <span className="mt-5 block h-px w-1/2 origin-left bg-fg transition-transform duration-500 ease-out group-hover:scale-x-0" />
              </Link>
            ))}
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
              <a
                href="https://lovdata.no/lov/2018-06-01-24/%C2%A79-3"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-3 border border-white/20 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white"
              >
                {t("lovdataCta")}
                <span aria-hidden="true">→</span>
              </a>
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
