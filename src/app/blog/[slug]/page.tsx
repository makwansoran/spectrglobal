import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { HubArticleView } from "@/components/hub-article";
import { blogPosts, getBlogPost } from "@/lib/hubs";
import { buildPageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return buildPageMetadata({
    title: post.title,
    description: post.dek,
    path: post.href,
  });
}

export default async function BlogPostRoute({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <HubArticleView post={post} bannerTitle="Blog" backHref="/blog" backLabel="All posts" />
      </main>
      <Footer />
    </>
  );
}
