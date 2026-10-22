import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { DocsPageView } from "@/components/docs/docs-page";
import { getDocsPage } from "@/lib/docs";
import { buildPageMetadata } from "@/lib/metadata";

const page = getDocsPage("overview")!;

export const metadata: Metadata = buildPageMetadata({
  title: "Documentation",
  description: page.description,
  path: "/developers",
});

export default function DevelopersPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <DocsPageView page={page} />
      </main>
      <Footer />
    </>
  );
}
