import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { IndustryPageView } from "@/components/industry-page";
import { buildPageMetadata } from "@/lib/metadata";
import { getIndustryPage, getIndustrySlugs } from "@/lib/use-cases";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getIndustrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.bannerTitle,
    description: page.listingDescription,
    path: page.href,
  });
}

export default async function UseCaseRoute({ params }: Props) {
  const { slug } = await params;
  const page = getIndustryPage(slug);
  if (!page) notFound();

  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <IndustryPageView page={page} />
      </main>
      <Footer />
    </>
  );
}
