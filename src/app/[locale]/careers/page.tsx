import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import type { Locale } from "@/i18n/routing";
import { jobListings, pickJobField } from "@/lib/jobs";
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
        <section className="brand-font bg-[#f8f8f8] px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-[55rem]">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-fg sm:text-7xl lg:text-8xl"
            >
              {t("title")}
            </ScrollRevealHeading>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-fg sm:text-xl sm:leading-9">{t("intro")}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">{t("paragraph1")}</p>
            <BevelButton href="#open-roles" className="mt-10 w-fit tracking-[0.16em]">
              {t("seeOpenRoles")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>

        <section id="open-roles" className="brand-font bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-[90rem]">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-fg sm:text-5xl">{t("openRoles")}</h2>
            <div className="mt-10 divide-y divide-[#d4d4d4] border-y border-[#d4d4d4]">
              {jobListings.map((job) => (
                <article key={job.slug} className="flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-fg sm:text-3xl">
                      {pickJobField(job.title, typedLocale)}
                    </h3>
                    <p className="mt-3 text-sm text-muted">
                      {pickJobField(job.location, typedLocale)} · {pickJobField(job.type, typedLocale)}
                    </p>
                    <p className="mt-5 text-base leading-7 text-muted">{pickJobField(job.summary, typedLocale)}</p>
                  </div>
                  <BevelButton href={`/contact?role=${job.slug}`} className="w-fit shrink-0 tracking-[0.16em]">
                    {t("applyCta")}
                    <span aria-hidden="true">→</span>
                  </BevelButton>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-[#f8f8f8] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-fg sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <BevelButton href="/contact" className="w-fit tracking-[0.16em]">
              {tCommon("contactUs")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
