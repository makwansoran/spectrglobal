import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ModelCard } from "@/components/model-card";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return buildPageMetadata({
    title: t("siteName"),
    description: t("description"),
    path: localizedPath(locale, ""),
    locale,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative px-5 pb-24 pt-40 sm:px-8 lg:pb-32 lg:pt-52">
          <div className="mx-auto max-w-4xl text-center">
            <span className="label fade-up inline-block">{t("eyebrow")}</span>
            <h1 className="brand-font fade-up fade-up-2 mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]">
              {t("heroTitle")}
            </h1>
            <p className="fade-up fade-up-3 mx-auto mt-8 max-w-2xl text-lg leading-8 text-muted">
              {t("heroSubtitle")}
            </p>
            <div className="fade-up fade-up-4 mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#models" className="pill pill--primary">
                {t("ourModels")}
              </a>
              <Link href="/contact" className="pill pill--secondary">
                {t("getInTouch")}
              </Link>
            </div>
          </div>
        </section>

        {/* The model we offer */}
        <section id="models" className="scroll-mt-24 px-5 pb-28 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-3">
              <span className="label">{t("modelsLabel")}</span>
              <h2 className="brand-font max-w-2xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {t("modelsTitle")}
              </h2>
            </div>
            <ModelCard
              category={t("model.category")}
              name={t("model.name")}
              description={t("model.description")}
              image="/spectr-rts.png"
              primary={{ label: t("model.learnMore"), href: "/research" }}
              secondary={{ label: t("model.tryCta"), href: "/contact" }}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
