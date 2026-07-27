import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { PlatformPageView } from "@/components/platform-page";
import { buildPageMetadata } from "@/lib/metadata";
import { getPlatform, getPlatformSlugs } from "@/lib/platforms";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPlatformSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatform(slug);
  if (!platform) return {};

  return buildPageMetadata({
    title: platform.name,
    description: platform.heroTagline,
    path: `/platforms/${platform.slug}`,
  });
}

export default async function PlatformPage({ params }: Props) {
  const { slug } = await params;
  const platform = getPlatform(slug);
  if (!platform) notFound();

  return (
    <>
      <Nav />
      <PlatformPageView platform={platform} />
      <Footer />
    </>
  );
}
