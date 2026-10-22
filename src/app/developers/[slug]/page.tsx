import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { DocsPageView } from "@/components/docs/docs-page";
import { getDocsPage, getDocsSlugs } from "@/lib/docs";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getDocsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocsPage(slug);
  if (!page) return {};

  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: `/developers/${page.slug}`,
  });
}

export default async function DevelopersDocsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getDocsPage(slug);
  if (!page || page.slug === "overview") notFound();

  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <DocsPageView page={page} />
      </main>
      <Footer />
    </>
  );
}
