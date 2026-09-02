import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { listResearchEssays, researchHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: researchHub.bannerTitle,
  description: researchHub.description,
  path: researchHub.path,
});

export default async function ResearchPage() {
  const posts = await listResearchEssays();
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={{ ...researchHub, posts }} />
      </main>
      <Footer />
    </>
  );
}
