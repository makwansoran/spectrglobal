import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { jobListings, pickJobField } from "@/lib/jobs";

type CareersPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: CareersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Careers" });
  return {
    title: t("title"),
    description: t("intro"),
  };
}

const focusKeys = ["aerospace", "software", "norway"] as const;

export default async function CareersPage({ params }: CareersPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Careers" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-black px-5 pb-20 pt-36 text-white sm:px-8 lg:pb-28 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
            <p className="mt-10 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">{t("intro")}</p>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              {t("buildTitle")}
            </h2>
            <div className="space-y-7 text-base leading-8 text-muted sm:text-lg">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {focusKeys.map((key) => (
              <article key={key} className="bg-surface p-7 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">{t(`focus.${key}.title`)}</h3>
                <p className="mt-5 text-sm leading-7 text-muted">{t(`focus.${key}.text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-bg px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
              {t("openRoles")}
            </h2>
            <div className="mt-10 space-y-6">
              {jobListings.map((job) => (
                <article key={job.slug} className="bg-surface p-7 sm:p-8">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <h3 className="text-3xl font-semibold tracking-[-0.055em] text-fg">
                        {pickJobField(job.title, typedLocale)}
                      </h3>
                      <p className="mt-3 text-sm text-muted">
                        {pickJobField(job.location, typedLocale)} · {pickJobField(job.type, typedLocale)}
                      </p>
                      <p className="mt-5 text-sm leading-7 text-muted">{pickJobField(job.summary, typedLocale)}</p>
                      <ul className="mt-5 space-y-2 text-sm leading-7 text-muted">
                        {pickJobField(job.responsibilities, typedLocale).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={`/contact?role=${job.slug}`}
                      className="inline-flex w-fit shrink-0 items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                    >
                      {t("applyCta")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-surface px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-6xl">
              {t("ctaTitle")}
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
            >
              {tCommon("contactSpectr")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
