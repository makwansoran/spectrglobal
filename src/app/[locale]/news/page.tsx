import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type NewsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  return buildPageMetadata({
    title: t("title"),
    description: t("intro"),
    path: localizedPath(locale, "/news"),
    locale,
  });
}

type NewsItem = {
  date: string;
  title: string;
  summary: string;
};

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "News" });
  const items = t.raw("items") as NewsItem[];

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        <section className="px-5 pb-16 pt-40 sm:px-8 lg:pt-48">
          <div className="mx-auto max-w-4xl">
            <span className="label">{t("eyebrow")}</span>
            <h1 className="brand-font mt-6 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-7xl">
              {t("title")}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted">{t("intro")}</p>
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <div className="mx-auto max-w-4xl">
            {items.length > 0 ? (
              <ul className="divide-y divide-border border-t border-border">
                {items.map((item) => (
                  <li key={item.title} className="grid gap-2 py-8 sm:grid-cols-[160px_1fr] sm:gap-8">
                    <time className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{item.date}</time>
                    <div>
                      <h2 className="brand-font text-2xl font-semibold tracking-[-0.03em]">{item.title}</h2>
                      <p className="mt-3 text-base leading-7 text-muted">{item.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="card p-10 text-center sm:p-16">
                <p className="text-lg text-muted">{t("empty")}</p>
                <div className="mt-6">
                  <Link href="/contact" className="pill pill--primary">
                    {t("contactCta")}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
