import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { HalftoneBackground } from "@/components/halftone-background";
import { Nav } from "@/components/nav";
import { ModelCard, type TryNeon } from "@/components/model-card";
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

const TRY_STYLES: Array<{ neon: TryNeon; size?: "sm" | "md" }> = [
  { neon: "yellow", size: "sm" },
  { neon: "purple", size: "sm" },
  { neon: "green", size: "sm" },
];

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const models = t.raw("models") as HomeModel[];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="relative isolate overflow-hidden px-5 pb-20 pt-40 sm:px-8 lg:pb-24 lg:pt-52">
          <HalftoneBackground className="-z-10 opacity-90" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-bg/40 via-transparent to-bg"
          />
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h1 className="brand-font fade-up text-3xl font-semibold leading-[1.15] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              <span className="block">{t("heroTitleLine1")}</span>
              <span className="block">{t("heroTitleLine2")}</span>
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

        <section id="models" className="scroll-mt-24 px-5 pb-28 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 sm:gap-5 lg:grid-cols-3">
            {models.map((model, index) => {
              const tryStyle = TRY_STYLES[index] ?? { neon: "yellow" as const };
              return (
                <ModelCard
                  key={model.name}
                  category={model.category}
                  name={model.name}
                  description={model.description}
                  image={model.image}
                  primary={{ label: model.learnMore, href: "/research" }}
                  secondary={{
                    label: model.tryCta,
                    href: "/contact",
                    neon: tryStyle.neon,
                    size: tryStyle.size,
                  }}
                  priority={index === 0}
                />
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
