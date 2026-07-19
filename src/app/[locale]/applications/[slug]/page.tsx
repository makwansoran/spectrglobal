import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { applicationSlugs, isApplicationSlug } from "@/lib/applications";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type ApplicationPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return applicationSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ApplicationPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isApplicationSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "Applications" });
  return buildPageMetadata({
    title: t(`${slug}.title`),
    description: t(`${slug}.intro`),
    path: localizedPath(locale, `/applications/${slug}`),
    locale,
  });
}

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const { locale, slug } = await params;
  if (!isApplicationSlug(slug)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Applications" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const benefits = t.raw(`${slug}.benefits`) as string[];

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-[88rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
              {t(`${slug}.title`)}
            </p>
            <ScrollRevealHeading
              as="h1"
              className="mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl"
            >
              {t(`${slug}.headline`)}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
              {t(`${slug}.intro`)}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <BevelButton href="/contact" variant="inverse-primary" className="tracking-[0.18em]">
                {tCommon("contactSpectr")}
                <span aria-hidden="true">→</span>
              </BevelButton>
              <BevelButton href="/autonomous-engine" variant="inverse-secondary" className="tracking-[0.18em]">
                Autonomous Engine
                <span aria-hidden="true">→</span>
              </BevelButton>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">{t(`${slug}.body`)}</p>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                {tCommon("overview")}
              </p>
              <ul className="mt-6 space-y-4 text-base leading-7 text-muted">
                {benefits.map((benefit) => (
                  <li key={benefit} className="border-b border-border pb-4">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-fg sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <div className="flex flex-wrap gap-4">
              <BevelButton href="/contact" className="w-fit">
                {tCommon("contactUs")}
                <span aria-hidden="true">→</span>
              </BevelButton>
              <BevelButton href="/" variant="secondary" className="w-fit">
                {t("backHome")}
              </BevelButton>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
