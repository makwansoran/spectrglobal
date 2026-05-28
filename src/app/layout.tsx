import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Syne } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: { default: "Spectr", template: "%s — Spectr" },
  description: "Mission-ready UAV, drone, and jammer products for field operators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${syne.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
