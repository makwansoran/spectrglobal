import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { GetStartedShell } from "@/components/get-started-shell";
import { MarketingChrome } from "@/components/marketing-chrome";
import { OrganizationJsonLd } from "@/components/json-ld";
import { ScrollToTop } from "@/components/scroll-to-top";
import { defaultOgImage } from "@/lib/metadata";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const essaySerif = Source_Serif_4({ variable: "--font-essay-serif", subsets: ["latin"] });
const essayMono = IBM_Plex_Mono({
  variable: "--font-essay-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Spectr OS`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: site.url },
  openGraph: {
    title: `${site.name} — Spectr OS`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_GB",
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Spectr OS`,
    description: site.description,
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${essaySerif.variable} ${essayMono.variable} theme-white h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
        >
          Skip to content
        </a>
        <OrganizationJsonLd />
        <ScrollToTop />
        <MarketingChrome>
          <GetStartedShell>{children}</GetStartedShell>
        </MarketingChrome>
      </body>
    </html>
  );
}
