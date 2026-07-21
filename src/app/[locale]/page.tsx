import type { Metadata } from "next";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ModelCard } from "@/components/model-card";
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
  learnMoreHref: string;
  image: string;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const models = t.raw("models") as HomeModel[];
  const d1Image = t("d1.image");
  const d1ImageExists = existsSync(path.join(process.cwd(), "public", d1Image.replace(/^\//, "")));

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="relative flex min-h-[100svh] items-center justify-center px-5 pt-16 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="brand-font fade-up text-3xl font-semibold leading-[1.15] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {t("heroTitle")}
            </h1>
            <div className="fade-up fade-up-2 mt-10 flex flex-wrap items-center justify-center gap-3">
              <a href="#models" className="pill pill--primary">
                {t("ourModels")}
              </a>
              <a href="#d1" className="pill pill--secondary">
                {t("getInTouch")}
              </a>
            </div>
          </div>
        </section>

        <section id="d1" className="relative scroll-mt-20 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-border bg-surface">
              {d1ImageExists ? (
                <Image
                  src={d1Image}
                  alt={t("d1.title")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              ) : null}
            </div>
            <div className="max-w-md">
              <h2 className="brand-font text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                {t("d1.title")}
              </h2>
              <p className="mt-6 text-base leading-8 text-muted sm:text-lg">{t("d1.text")}</p>
            </div>
          </div>
        </section>

        <section
          id="models"
          className="relative flex min-h-[100svh] scroll-mt-0 items-center px-5 py-24 sm:px-8"
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="brand-font mb-10 text-center text-3xl font-semibold tracking-[-0.04em] sm:mb-14 sm:text-4xl lg:text-5xl">
              {t("modelsHeading")}
            </h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              {models.map((model, index) => (
                <ModelCard
                  key={model.name}
                  category={model.category}
                  name={model.name}
                  description={model.description}
                  image={model.image}
                  primary={{ label: model.learnMore, href: model.learnMoreHref }}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
