import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductLanding } from "@/components/product-landing/product-landing";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, pickProductField, products } from "@/lib/objects";
import { getProductLandingContent } from "@/lib/product-landing-content";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

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

  return buildPageMetadata({
    title: product.name,
    description: pickProductField(product.tagline, locale as Locale),
    path: localizedPath(locale, `/products/${slug}`),
    locale,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  const landingContent = getProductLandingContent(slug, typedLocale);

  if (!landingContent) {
    notFound();
  }

  return (
    <>
      <Nav variant="light" />
      <ProductLanding content={landingContent} />
      <div className="bg-bg text-fg">
        <Footer />
      </div>
    </>
  );
}
