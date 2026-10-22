import type { Metadata } from "next";
import { ArgusPageView } from "@/components/argus-page";
import { Footer } from "@/components/footer";
import { argusPage } from "@/lib/argus-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: argusPage.name,
  description: argusPage.heroBody,
  path: "/argus",
});

export default function ArgusRoute() {
  return (
    <>
      <ArgusPageView />
      <Footer />
    </>
  );
}
