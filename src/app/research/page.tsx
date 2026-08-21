import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { researchHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: researchHub.bannerTitle,
  description: researchHub.description,
  path: researchHub.path,
});

export default function ResearchPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={researchHub} />
      </main>
      <Footer />
    </>
  );
}
