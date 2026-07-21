import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ProductInfoPage,
  type ProductInfoContent,
} from "@/components/product-info-page";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type SpectrRtsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SpectrRtsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SpectrRts" });
  return buildPageMetadata({
    title: t("title"),
    description: t("tagline"),
    path: localizedPath(locale, "/research"),
    locale,
  });
}

export default async function SpectrRtsPage({ params }: SpectrRtsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "SpectrRts" });

  const content: ProductInfoContent = {
    title: t("title"),
    tagline: t("tagline"),
    learnMore: t("learnMore"),
    nav: {
      capabilities: t("nav.capabilities"),
      architecture: t("nav.architecture"),
      applications: t("nav.applications"),
      faqs: t("nav.faqs"),
      getStarted: t("nav.getStarted"),
    },
    capabilities: {
      title: t("capabilities.title"),
      items: t.raw("capabilities.items") as ProductInfoContent["capabilities"]["items"],
    },
    architecture: {
      title: t("architecture.title"),
      items: t.raw("architecture.items") as ProductInfoContent["architecture"]["items"],
    },
    applications: {
      title: t("applications.title"),
      items: t.raw("applications.items") as ProductInfoContent["applications"]["items"],
    },
    banner: {
      title: t("banner.title"),
      description: t("banner.description"),
      cta: t("banner.cta"),
    },
    faqs: {
      title: t("faqs.title"),
      items: t.raw("faqs.items") as ProductInfoContent["faqs"]["items"],
    },
    getStarted: {
      title: t("getStarted.title"),
      primary: t.raw("getStarted.primary") as ProductInfoContent["getStarted"]["primary"],
      secondary: t.raw("getStarted.secondary") as ProductInfoContent["getStarted"]["secondary"],
    },
  };

  return <ProductInfoPage content={content} />;
}
