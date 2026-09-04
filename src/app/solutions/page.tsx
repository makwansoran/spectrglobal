import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { SolutionsPageView } from "@/components/solutions-page";
import { solutionsPage } from "@/lib/solutions-page";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: solutionsPage.bannerTitle,
  description: solutionsPage.description,
  path: solutionsPage.path,
});

export default function SolutionsPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <SolutionsPageView />
      </main>
      <Footer />
    </>
  );
}
