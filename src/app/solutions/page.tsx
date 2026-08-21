import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { solutionsHub } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: solutionsHub.bannerTitle,
  description: solutionsHub.description,
  path: solutionsHub.path,
});

export default function SolutionsPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={solutionsHub} />
      </main>
      <Footer />
    </>
  );
}
