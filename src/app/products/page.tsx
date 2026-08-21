import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { productsHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: productsHub.bannerTitle,
  description: productsHub.description,
  path: productsHub.path,
});

export default function ProductsPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={productsHub} />
      </main>
      <Footer />
    </>
  );
}
