import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductGallery } from "@/components/product-gallery";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, pickProductField, products } from "@/lib/objects";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: pickProductField(product.tagline, locale as Locale),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Products" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  const galleryImages = product.gallery.map((image) => ({
    src: image.src,
    alt: pickProductField(image.alt, typedLocale),
  }));

  const overviewItems = [
    { label: t("category"), value: pickProductField(product.category, typedLocale) },
    { label: t("use"), value: pickProductField(product.use, typedLocale) },
    ...(product.flightTime
      ? [{ label: t("flight"), value: pickProductField(product.flightTime, typedLocale) }]
      : []),
    ...(product.range ? [{ label: t("range"), value: pickProductField(product.range, typedLocale) }] : []),
    { label: t("status"), value: pickProductField(product.availability, typedLocale) },
    { label: t("pricing"), value: pickProductField(product.price, typedLocale) },
  ];

  return (
    <>
      <Nav variant="light" />
      <main className="brand-font min-h-screen flex-1 bg-black text-white">
        <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <Image
            src={product.heroImage}
            alt={pickProductField(product.heroAlt, typedLocale)}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
          <div className="relative mx-auto flex min-h-[calc(100vh-16rem)] max-w-7xl items-center">
            <div>
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
              >
                {product.name}
              </ScrollRevealHeading>
              <p className="mt-8 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                {pickProductField(product.tagline, typedLocale)}
              </p>
              <Link
                href="/contact"
                className="mt-10 inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
              >
                {tCommon("requestAccess")}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {galleryImages.length > 0 ? (
          <section className="px-5 py-20 sm:px-8 lg:py-28">
            <div className="mx-auto max-w-7xl">
              <ProductGallery images={galleryImages} productName={product.name} />
            </div>
          </section>
        ) : null}

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
              {pickProductField(product.sectionTitle, typedLocale)}
            </h2>
            <div className="space-y-7 text-base leading-8 text-white/62 sm:text-lg">
              <p>{pickProductField(product.description, typedLocale)}</p>
              {product.sectionExtra ? (
                <p>{pickProductField(product.sectionExtra, typedLocale)}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {product.capabilities.map((capability) => (
              <article
                key={pickProductField(capability.title, typedLocale)}
                className="border border-white/10 bg-white/[0.04] p-7 sm:p-8"
              >
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-white">
                  {pickProductField(capability.title, typedLocale)}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/56">
                  {pickProductField(capability.text, typedLocale)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">{tCommon("specs")}</p>
            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
              {product.slug === "valkyrie" ? t("specSheet") : `${product.name} — ${tCommon("specifications")}`}
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              {product.slug === "valkyrie"
                ? t("specSheetDescription")
                : pickProductField(product.tagline, typedLocale)}
            </p>
            <div className="mt-10 space-y-10">
              <SpecList title={tCommon("overview")} items={overviewItems} />
              <SpecList
                title={tCommon("specifications")}
                items={product.specifications.map((spec) => ({
                  label: pickProductField(spec.label, typedLocale),
                  value: pickProductField(spec.value, typedLocale),
                }))}
              />
              <SpecList
                title={tCommon("recommendedEquipment")}
                items={product.equipment.map((item) => ({
                  label: pickProductField(item.label, typedLocale),
                  value: pickProductField(item.value, typedLocale),
                }))}
              />
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 border border-white/10 bg-white p-7 text-black sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
              {t("requestProduct", { product: product.name })}
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:opacity-80"
            >
              {tCommon("contactSpectr")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <div className="bg-bg text-fg">
          <Footer />
        </div>
      </main>
    </>
  );
}

function SpecList({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">{title}</h3>
      <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2 py-4 text-left text-sm sm:grid-cols-[0.85fr_1.15fr] sm:gap-4">
            <dt className="text-white/56">{item.label}</dt>
            <dd className="text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
