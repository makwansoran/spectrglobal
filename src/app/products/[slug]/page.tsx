import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { ProductPageView } from "@/components/product-page";
import { getProductPage, getProductSlugs } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getProductPage(slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.bannerTitle,
    description: page.listingDescription,
    path: page.href,
  });
}

export default async function ProductRoute({ params }: Props) {
  const { slug } = await params;
  const page = getProductPage(slug);
  if (!page) notFound();

  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <ProductPageView page={page} />
      </main>
      <Footer />
    </>
  );
}
