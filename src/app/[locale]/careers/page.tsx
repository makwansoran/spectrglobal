import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type CareersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return buildPageMetadata({
    title: t("title"),
    description: t("intro"),
    path: localizedPath(locale, "/careers"),
    locale,
  });
}

type Value = {
  title: string;
  text: string;
};

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Careers" });
  const values = t.raw("values") as Value[];

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

        <section className="px-5 pb-16 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="card p-7">
                <h2 className="brand-font text-xl font-semibold tracking-[-0.02em]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="card p-10 text-center sm:p-16">
              <h2 className="brand-font text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{t("openTitle")}</h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">{t("openText")}</p>
              <div className="mt-8">
                <Link href="/contact" className="pill pill--primary">
                  {t("cta")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
