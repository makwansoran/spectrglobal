import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { PlatformPageView } from "@/components/platform-page";
import { SpectrEdgePageView } from "@/components/spectr-edge-page";
import { SpectrOsPageView } from "@/components/spectr-os-page";
import { buildPageMetadata } from "@/lib/metadata";
import { getPlatform, getPlatformSlugs } from "@/lib/platforms";
import { spectrEdgePage } from "@/lib/spectr-edge-page";
import { spectrOsPage } from "@/lib/spectr-os-page";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPlatformSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "spectr-os") {
    return buildPageMetadata({
      title: spectrOsPage.name,
      description: spectrOsPage.heroBody,
      path: "/platforms/spectr-os",
    });
  }

  if (slug === "spectr-edge") {
    return buildPageMetadata({
      title: spectrEdgePage.name,
      description: spectrEdgePage.heroTagline,
      path: "/platforms/spectr-edge",
    });
  }

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

  if (slug === "spectr-os") {
    return (
      <>
        <SpectrOsPageView />
        <Footer />
      </>
    );
  }

  if (slug === "spectr-edge") {
    return (
      <>
        <SpectrEdgePageView />
        <Footer />
      </>
    );
  }

  const platform = getPlatform(slug);
  if (!platform) notFound();

  return (
    <>
      <PlatformPageView platform={platform} />
      <Footer />
    </>
  );
}
