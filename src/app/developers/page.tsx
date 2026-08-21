import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { developersHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: developersHub.bannerTitle,
  description: developersHub.description,
  path: developersHub.path,
});

export default function DevelopersPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={developersHub} />
      </main>
      <Footer />
    </>
  );
}
