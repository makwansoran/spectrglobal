import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton } from "@/components/bevel-button";
import { routing, type Locale } from "@/i18n/routing";
import { docPages, getDocPage, pickDocField } from "@/lib/docs";

type DocDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    docPages.map((doc) => ({ locale, slug: doc.slug })),
  );
}

export async function generateMetadata({ params }: DocDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = getDocPage(slug);

  if (!doc) {
    return { title: "Documentation" };
  }

  return {
    title: pickDocField(doc.title, locale as Locale),
    description: pickDocField(doc.description, locale as Locale),
  };
}

export default async function DocDetailPage({ params }: DocDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const doc = getDocPage(slug);

  if (!doc) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Documentation" });

  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-bg text-fg">
        <section className="px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <BevelButton href="/documentation" variant="secondary" className="w-fit">
              ← {t("title")}
            </BevelButton>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl"
            >
              {pickDocField(doc.title, typedLocale)}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {pickDocField(doc.description, typedLocale)}
            </p>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl space-y-8 text-base leading-8 text-muted sm:text-lg">
            {pickDocField(doc.body, typedLocale).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
