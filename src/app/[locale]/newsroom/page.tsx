import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { BevelButton, bevelButtonClassName } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getNewsroomCardField, newsroomCards, newsroomHref } from "@/lib/newsroom";

type NewsroomPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: NewsroomPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Newsroom" });
  return { title: t("title") };
}

export default async function NewsroomPage({ params }: NewsroomPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Newsroom" });

  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-[#f8f8f8] text-fg">
        <section className="px-5 pb-12 pt-36 sm:px-8 lg:pb-16 lg:pt-44">
          <div className="mx-auto max-w-[90rem]">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="text-6xl font-semibold leading-[0.86] tracking-[-0.075em] text-fg sm:text-8xl lg:text-[10rem]"
            >
              {t("title")}
            </ScrollRevealHeading>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-[90rem] gap-8 lg:grid-cols-2">
            {newsroomCards.map((card) => (
              <Link
                key={card.slug}
                href={newsroomHref(card.slug)}
                className="group flex min-h-[420px] flex-col overflow-hidden bg-white"
              >
                <div className="relative min-h-[300px] overflow-hidden bg-neutral-950">
                  <Image
                    src={card.image}
                    alt={getNewsroomCardField(card.alt, typedLocale)}
                    fill
                    className="object-cover grayscale transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-7 sm:p-9 lg:p-10">
                  <h2 className="flex max-w-xl items-center gap-4 text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-5xl">
                    {getNewsroomCardField(card.title, typedLocale)}
                    <span
                      className="font-mono text-3xl leading-none text-muted transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </h2>
                  <span className="mt-10 block w-full">
                    <span
                      className={bevelButtonClassName({
                        variant: "primary",
                        className: "pointer-events-none",
                      })}
                    >
                      {getNewsroomCardField(card.action, typedLocale)}
                      <span aria-hidden="true">→</span>
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-white px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-fg sm:text-5xl">
              {t("mediaCta")}
            </h2>
            <BevelButton href="/contact" className="w-fit tracking-[0.16em]">
              {t("contact")}
              <span aria-hidden="true">→</span>
            </BevelButton>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
