import Image from "next/image";
import Link from "next/link";
import { UseCaseCta } from "@/components/use-case-cta";
import type { HubPost } from "@/lib/hubs";
import "./use-case-page.css";

export function HubArticleView({
  post,
  bannerTitle,
  backHref,
  backLabel,
}: {
  post: HubPost;
  bannerTitle: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <article className="uc-page">
      <div className="uc-hero">
        <Image src={post.image} alt={post.imageAlt} fill priority className="uc-hero__image" sizes="100vw" />
      </div>
      <header className="uc-banner">
        <div className="uc-banner__inner">
          <h1>{bannerTitle}</h1>
        </div>
      </header>
      <div className="uc-wrap hub-article">
        <p className="hub-article__meta">{post.date}</p>
        <h2>{post.title}</h2>
        {post.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          <Link href={backHref}>{backLabel} →</Link>
        </p>
      </div>
      <section className="uc-cta">
        <div className="uc-wrap">
          <div className="uc-cta__box">
            <h2>Get started with Spectr OS</h2>
            <p>Free for enterprise customers — permanently.</p>
            <UseCaseCta />
          </div>
        </div>
      </section>
    </article>
  );
}
