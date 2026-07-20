import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { buildPageMetadata, localizedPath } from "@/lib/metadata";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return buildPageMetadata({
    title: t("title"),
    description: t("heroIntro"),
    path: localizedPath(locale, "/about"),
    locale,
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const narrative = t.raw("teamNarrative") as string[];
  const team = t.raw("teamMembers") as { name: string; role: string }[];

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="brand-font bg-[#f8f8f8] px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-[55rem]">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">{t("eyebrow")}</p>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-4 text-5xl font-semibold leading-[0.95] tracking-[-0.05em] text-fg sm:text-7xl lg:text-8xl"
            >
              {t("title")}
            </ScrollRevealHeading>
            <div className="mt-10 space-y-6 text-lg leading-8 text-fg sm:text-xl sm:leading-9">
              {narrative.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="brand-font bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-[90rem] gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <article key={member.name} className="border-t border-[#d4d4d4] pt-6">
                <div className="bevel-card mb-6 aspect-[4/5] bg-[#efefef]" aria-hidden="true" />
                <h2 className="text-2xl font-semibold tracking-[-0.03em] text-fg">{member.name}</h2>
                <p className="mt-2 text-base text-muted">{member.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="brand-font bg-[#f8f8f8] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-fg sm:text-5xl">
              {t("ctaTitle")}
            </h2>
            <div className="flex flex-wrap gap-3">
              <BevelButton href="/contact" className="w-fit tracking-[0.16em]">
                {tCommon("contactUs")}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
