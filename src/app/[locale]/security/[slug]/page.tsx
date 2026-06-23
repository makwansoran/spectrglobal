import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { routing, type Locale } from "@/i18n/routing";
import { getSecurityPrinciple, pickSecurityField, securityPrinciples } from "@/lib/security-principles";

type SecurityPrinciplePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    securityPrinciples.map((principle) => ({ locale, slug: principle.slug })),
  );
}

export async function generateMetadata({ params }: SecurityPrinciplePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const principle = getSecurityPrinciple(slug);

  if (!principle) {
    return { title: "Security" };
  }

  return {
    title: pickSecurityField(principle.title, locale as Locale),
    description: pickSecurityField(principle.text, locale as Locale),
  };
}

export default async function SecurityPrinciplePage({ params }: SecurityPrinciplePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const principle = getSecurityPrinciple(slug);

  if (!principle) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-bg text-fg">
        <section className="px-5 pb-16 pt-36 sm:px-8 lg:pb-24 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="max-w-5xl text-5xl font-semibold leading-[0.9] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl"
            >
              {pickSecurityField(principle.title, typedLocale)}
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto max-w-4xl space-y-8 text-base leading-8 text-muted sm:text-lg">
            {pickSecurityField(principle.paragraphs, typedLocale).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
