import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ModelCard } from "@/components/model-card";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type ResearchPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Research" });
  return buildPageMetadata({
    title: t("title"),
    description: t("intro"),
    path: localizedPath(locale, "/research"),
    locale,
  });
}

type ResearchModel = {
  category: string;
  name: string;
  description: string;
};

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Research" });
  const models = t.raw("models") as ResearchModel[];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="px-5 pb-16 pt-40 sm:px-8 lg:pt-48">
          <div className="mx-auto max-w-4xl">
            <span className="label">{t("eyebrow")}</span>
            <h1 className="brand-font mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{t("intro")}</p>
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {models.map((model, index) => (
              <ModelCard
                key={model.name}
                category={model.category}
                name={model.name}
                description={model.description}
                image={index === 0 ? "/spectr-rts.png" : undefined}
                secondary={{ label: t("contactCta"), href: "/contact" }}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
