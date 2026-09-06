import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { OfferingsPageView } from "@/components/offerings-page";
import { buildPageMetadata } from "@/lib/metadata";
import { offeringsPage } from "@/lib/offerings";

export const metadata: Metadata = buildPageMetadata({
  title: offeringsPage.title,
  description: offeringsPage.body,
  path: "/offerings",
});

export default function OfferingsRoute() {
  return (
    <>
      <OfferingsPageView />
      <Footer />
    </>
  );
}
