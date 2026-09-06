import type { Metadata } from "next";
import { AboutPageView } from "@/components/about-page";
import { Footer } from "@/components/footer";
import { aboutPage } from "@/lib/about";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "About Spectr",
  description: aboutPage.belief,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutPageView />
      <Footer />
    </>
  );
}
