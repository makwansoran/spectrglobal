import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import { OrganizationJsonLd } from "@/components/json-ld";
import { ScrollToTop } from "@/components/scroll-to-top";
import { defaultOgImage, localeAlternates } from "@/lib/metadata";
import { routing, type Locale } from "@/i18n/routing";
import "../globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL("https://www.spectr.no"),
    title: { default: t("siteName"), template: `%s — ${t("siteName")}` },
    description: t("description"),
    alternates: localeAlternates("", locale),
    openGraph: {
      title: t("siteName"),
      description: t("description"),
      url: locale === routing.defaultLocale ? "https://www.spectr.no" : `https://www.spectr.no/${locale}`,
      siteName: t("siteName"),
      type: "website",
      locale: locale === "no" ? "nb_NO" : "en_US",
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: t("siteName"),
      description: t("description"),
      images: [defaultOgImage.url],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", type: "image/x-icon" },
        { url: "/favicon.png", type: "image/png", sizes: "256x256" },
      ],
      shortcut: "/favicon.ico",
      apple: "/spectr-logo.png",
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geist.variable} ${geistMono.variable} ${syne.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <ScrollToTop />
          {children}
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export type { Locale };
