import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton, bevelButtonClassName } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  getArticleExcerpt,
  getArticleImageAlt,
  getArticleTitle,
  getArticlesByCategory,
} from "@/lib/articles";
import { getNewsroomCard, getNewsroomCardField, newsroomCards } from "@/lib/newsroom";

type NewsroomCategoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    newsroomCards.map((card) => ({ locale, slug: card.slug })),
  );
}

export async function generateMetadata({ params }: NewsroomCategoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const card = getNewsroomCard(slug);

  if (!card) {
    return { title: "Newsroom" };
  }

  return {
    title: getNewsroomCardField(card.title, locale as Locale),
    description: getNewsroomCardField(card.description, locale as Locale),
  };
}

export default async function NewsroomCategoryPage({ params }: NewsroomCategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const card = getNewsroomCard(slug);

  if (!card) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "Newsroom" });
  const articles = getArticlesByCategory(slug);

  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-white text-fg">
        <section className="px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <BevelButton href="/newsroom" variant="secondary" className="w-fit">
              ← {t("title")}
            </BevelButton>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-8 text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl"
            >
              {getNewsroomCardField(card.title, typedLocale)}
            </ScrollRevealHeading>
          </div>
        </section>
        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl space-y-10">
            {articles.length === 0 ? (
              <p className="text-base leading-8 text-muted">{t("noArticles")}</p>
            ) : (
              articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/newsroom/${slug}/${article.slug}`}
                  className="group block"
                >
                  <article>
                    <div className="grid min-h-[170px] gap-5 sm:grid-cols-[220px_1fr] sm:items-center">
                      <div className="relative min-h-[150px] overflow-hidden bg-neutral-950 sm:h-[150px] sm:min-h-0">
                        <Image
                          src={article.image}
                          alt={getArticleImageAlt(article, typedLocale)}
                          fill
                          className="object-cover grayscale"
                          sizes="(max-width: 640px) 100vw, 220px"
                        />
                      </div>
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{article.date}</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.045em] text-fg sm:text-3xl">
                          {getArticleTitle(article, typedLocale)}
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                          {getArticleExcerpt(article, typedLocale)}
                        </p>
                        <span
                          className={bevelButtonClassName({
                            variant: "primary",
                            className: "mt-4 pointer-events-none",
                          })}
                        >
                          {t("readArticle")}
                          <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </div>
                    <span className="mt-6 block h-px w-full bg-border" />
                  </article>
                </Link>
              ))
            )}
          </div>
        </section>
        <div className="bg-bg text-fg">
          <Footer />
        </div>
      </main>
    </>
  );
}
