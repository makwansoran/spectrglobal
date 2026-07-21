import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type ObjectIntelligencePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ObjectIntelligencePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SpectrObjectIntelligence" });
  return buildPageMetadata({
    title: t("title"),
    description: t("tagline"),
    path: localizedPath(locale, "/object-intelligence"),
    locale,
  });
}

export default async function ObjectIntelligencePage({
  params,
}: ObjectIntelligencePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "SpectrObjectIntelligence" });
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="px-5 pb-24 pt-40 sm:px-8 lg:pt-48">
          <div className="mx-auto max-w-3xl">
            <h1 className="brand-font text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-8 text-lg leading-8 text-muted">{t("tagline")}</p>
            <div className="mt-12 space-y-6">
              {paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-fg/85">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/contact" className="pill pill--primary">
                {t("cta")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
