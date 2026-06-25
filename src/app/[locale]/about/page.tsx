import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

const sectionKeys = [
  "overview",
  "mission",
  "whatWeBuild",
  "whyNorway",
  "technology",
  "security",
  "leadership",
] as const;

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return buildPageMetadata({
    title: t("title"),
    description: t("heroIntro"),
    path: localizedPath(locale, "/about"),
    locale,
  });
}

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
          <div className="mx-auto max-w-4xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
            <p className="mt-10 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">{t("heroIntro")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl space-y-20">
            {sectionKeys.map((key) => (
              <article key={key}>
                <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg sm:text-4xl">
                  {t(`sections.${key}.title`)}
                </h2>
                <div className="mt-6 space-y-5 text-base leading-8 text-muted sm:text-lg">
                  {t.raw(`sections.${key}.paragraphs`).map((paragraph: string, index: number) => (
                    <p key={paragraph}>
                      {paragraph}
                      {key === "security" && index === 2 ? (
                        <>
                          {" "}
                          <Link href="/security" className="text-fg underline underline-offset-4 hover:opacity-70">
                            {t("securityLink")}
                          </Link>
                          .
                        </>
                      ) : null}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-5xl">
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
