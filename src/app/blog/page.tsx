import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { HubPageView } from "@/components/hub-page";
import { blogHub, listBlogPosts } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: blogHub.bannerTitle,
  description: blogHub.description,
  path: blogHub.path,
});

export default async function BlogPage() {
  const posts = await listBlogPosts();
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubPageView page={{ ...blogHub, posts }} />
      </main>
      <Footer />
    </>
  );
}
