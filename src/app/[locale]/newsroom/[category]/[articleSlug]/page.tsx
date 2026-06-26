import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton } from "@/components/bevel-button";
import { routing, type Locale } from "@/i18n/routing";
import {
  articles,
  getArticle,
  getArticleBody,
  getArticleImageAlt,
  getArticleTitle,
} from "@/lib/articles";
import { getNewsroomCard, getNewsroomCardField } from "@/lib/newsroom";

type ArticleDetailPageProps = {
  params: Promise<{ locale: string; category: string; articleSlug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    articles.map((article) => ({
      locale,
      category: article.category,
      articleSlug: article.slug,
    })),
  );
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const { locale, category, articleSlug } = await params;
  const article = getArticle(category, articleSlug);

  if (!article) {
    return { title: "Newsroom" };
  }

  return {
    title: getArticleTitle(article, locale as Locale),
  };
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { locale, category, articleSlug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const article = getArticle(category, articleSlug);
  const card = getNewsroomCard(category);

  if (!article || !card) {
    notFound();
  }

  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-white text-fg">
        <section className="px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <BevelButton href={`/newsroom/${category}`} variant="secondary" className="w-fit">
              ← {tCommon("backToCategory", { category: getNewsroomCardField(card.title, typedLocale) })}
            </BevelButton>
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted">{article.date}</p>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl"
            >
              {getArticleTitle(article, typedLocale)}
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="px-5 pb-12 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative aspect-[16/9] overflow-hidden bg-neutral-950">
              <Image
                src={article.image}
                alt={getArticleImageAlt(article, typedLocale)}
                fill
                className="object-cover grayscale"
                sizes="(max-width: 1280px) 100vw, 1280px"
                priority
              />
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl space-y-8 text-base leading-8 text-muted sm:text-lg">
            {getArticleBody(article, typedLocale).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <div className="bg-bg text-fg">
          <Footer />
        </div>
      </main>
    </>
  );
}
