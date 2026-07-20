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

type HomeModel = {
  category: string;
  name: string;
  description: string;
  learnMore: string;
  tryCta: string;
  image: string;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const models = t.raw("models") as HomeModel[];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="relative px-5 pb-16 pt-40 sm:px-8 lg:pb-20 lg:pt-52">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="brand-font fade-up text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl lg:text-[5.5rem]">
              {t("heroTitle")}
            </h1>
            <div className="fade-up fade-up-2 mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#models" className="pill pill--primary">
                {t("ourModels")}
              </a>
              <Link href="/contact" className="pill pill--secondary">
                {t("getInTouch")}
              </Link>
            </div>
          </div>
        </section>

        {/* Models */}
        <section id="models" className="scroll-mt-24 px-5 pb-28 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 lg:grid-cols-3">
            {models.map((model, index) => (
              <ModelCard
                key={model.name}
                category={model.category}
                name={model.name}
                description={model.description}
                image={model.image}
                primary={{ label: model.learnMore, href: "/research" }}
                secondary={{ label: model.tryCta, href: "/contact" }}
                priority={index === 0}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
