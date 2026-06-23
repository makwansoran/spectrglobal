import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import { pickProductField, products } from "@/lib/objects";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  return buildPageMetadata({ title: t("title"), description: t("heroDescription"), path: localizedPath(locale, "/products"), locale });
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Products" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />
      <main id="main-content" className="brand-font flex-1">
        <section className="bg-black px-5 pb-16 pt-36 text-white sm:px-8 lg:pb-20 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9rem]"
            >
              {t("hero")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">{t("heroDescription")}</p>
          </div>
        </section>

        <section className="px-5 pb-20 pt-8 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
            {products.map((product) => (
              <article
                key={product.slug}
                className="group overflow-hidden border border-border bg-surface transition-colors hover:border-fg/30"
              >
                <div className="relative h-72 overflow-hidden sm:h-80">
                  <Image
                    src={product.heroImage}
                    alt={pickProductField(product.heroAlt, typedLocale)}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-7 sm:p-8">
                    <p className="label text-white/55">{pickProductField(product.category, typedLocale)}</p>
                    <h2 className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">{product.name}</h2>
                  </div>
                </div>
                <div className="flex flex-col gap-6 p-7 sm:p-8">
                  <p className="text-sm leading-7 text-muted">{pickProductField(product.tagline, typedLocale)}</p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                  >
                    {t("exploreProduct", { product: product.name })}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("heroDescription")}
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
            >
              {tCommon("requestAccess")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
