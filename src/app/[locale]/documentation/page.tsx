import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton, bevelButtonClassName } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getDocPagesBySection, pickDocField } from "@/lib/docs";
import { pickProductField, products } from "@/lib/objects";

type DocumentationPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DocumentationPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Documentation" });
  return { title: t("title") };
}

const sectionKeys = ["product", "operator", "deployment", "support"] as const;
const quickStartKeys = ["evaluate", "prepare", "updates"] as const;

const quickStartHrefs = {
  evaluate: "/products",
  prepare: "/contact",
  updates: "/newsroom",
} as const;

export default async function DocumentationPage({ params }: DocumentationPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Documentation" });

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {quickStartKeys.map((key) => (
              <Link
                key={key}
                href={quickStartHrefs[key]}
                className="group flex min-h-[280px] flex-col justify-between bg-surface p-7 transition-opacity hover:opacity-80 sm:p-8"
              >
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.055em] text-fg sm:text-4xl">
                    {t(`quickStart.${key}.title`)}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-muted">{t(`quickStart.${key}.description`)}</p>
                </div>
                <span
                  className={bevelButtonClassName({
                    variant: "primary",
                    className: "mt-10 pointer-events-none",
                  })}
                >
                  {t(`quickStart.${key}.action`)}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[320px_1fr]">
            <aside className="lg:sticky lg:top-28 lg:h-fit">
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-5xl">
                {t("browseTitle")}
              </h2>
              <p className="mt-6 text-sm leading-7 text-muted">{t("browseDescription")}</p>
            </aside>

            <div className="grid gap-4">
              {sectionKeys.map((sectionKey) => {
                const sectionDocs = getDocPagesBySection(sectionKey);

                return (
                  <article key={sectionKey} className="bg-surface p-7 sm:p-8">
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                      <div>
                        <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                          {t(`sections.${sectionKey}.title`)}
                        </h3>
                        <p className="mt-5 text-sm leading-7 text-muted">
                          {t(`sections.${sectionKey}.description`)}
                        </p>
                      </div>
                      <ul className="grid gap-3 text-sm text-fg sm:grid-cols-2">
                        {sectionDocs.map((doc) => (
                          <li key={doc.slug}>
                            <Link
                              href={`/documentation/${doc.slug}`}
                              className={bevelButtonClassName({
                                variant: "secondary",
                                className: "w-full justify-start",
                              })}
                            >
                              {pickDocField(doc.title, typedLocale)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="max-w-4xl text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              {t("platformReferences")}
            </h2>
            <div className="mt-10 grid gap-4 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.slug} className="bg-black p-7 text-white sm:p-8">
                  <h3 className="text-4xl font-semibold tracking-[-0.06em]">{product.name}</h3>
                  <p className="mt-6 text-sm leading-7 text-white/62">
                    {pickProductField(product.tagline, typedLocale)}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("needDocumentTitle")}
            </h2>
            <div className="max-w-xl lg:text-right">
              <p className="text-sm leading-7 text-muted">{t("needDocumentText")}</p>
              <BevelButton href="/contact" className="mt-8">
                {t("requestDocumentation")}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
