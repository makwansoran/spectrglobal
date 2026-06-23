import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { LandingChapter } from "@/components/landing-chapter";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";
import { pickProductField, products } from "@/lib/objects";
import type { Locale } from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />

      <main
        id="main-content"
        className="flex-1 lg:h-screen lg:snap-y lg:snap-proximity lg:overflow-y-auto lg:scroll-smooth"
      >
        {/* Hero — unchanged */}
        <div className="relative overflow-hidden bg-bg">
          <section className="relative z-10 flex min-h-screen snap-start items-center bg-black text-white">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src="/landing-hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
            <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-5 py-32 text-center sm:px-8 lg:py-36">
              <div className="relative mx-auto flex flex-col items-center">
                <ScrollRevealHeading
                  as="h1"
                  revealOnMount
                  className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl"
                >
                  {t("hero")}
                </ScrollRevealHeading>
              </div>
            </div>
          </section>
        </div>

        {/* Mission statement — large fade-up text */}
        <section className="brand-font flex min-h-screen snap-start items-center bg-black px-5 py-28 text-white sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[88rem]">
            <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
              {t("missionEyebrow")}
            </Reveal>
            <Reveal
              as="h2"
              delay={120}
              className="mt-8 max-w-5xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              {t("missionStatement")}
            </Reveal>
            <Reveal delay={260}>
              <Link
                href="/about"
                className="mt-12 inline-flex items-center gap-3 border-b border-white/40 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
              >
                {tCommon("learnMore")}
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Product chapters — full-screen pinned with parallax media */}
        <LandingChapter
          index="01"
          eyebrow={t("reconEyebrow")}
          title={t("reconTitle")}
          description={t("reconDescription")}
          cta={t("reconCta")}
          href="/products/recon"
          image="/recon-hero.png"
          alt="RECON autonomous ISR platform over mountain terrain"
          priority
        />

        <LandingChapter
          index="02"
          eyebrow={t("centurionEyebrow")}
          title={t("centurionTitle")}
          description={t("centurionDescription")}
          cta={t("centurionCta")}
          href="/products/centurion"
          image="/centurion-laptop-mockup.png"
          alt="CENTURION command platform"
        />

        {/* Family of systems — grid */}
        <section className="brand-font snap-start bg-bg px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[88rem]">
            <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              {t("familyEyebrow")}
            </Reveal>
            <Reveal
              as="h2"
              delay={100}
              className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-fg sm:text-6xl lg:text-7xl"
            >
              {t("familyTitle")}
            </Reveal>

            <div className="mt-16 grid gap-6 md:grid-cols-2">
              {products.map((product, idx) => (
                <Reveal key={product.slug} delay={idx * 120}>
                  <Link
                    href={`/products/${product.slug}`}
                    className="group block overflow-hidden border border-border bg-surface transition-colors hover:border-fg/40"
                  >
                    <div className="relative h-80 overflow-hidden sm:h-96">
                      <Image
                        src={product.heroImage}
                        alt={pickProductField(product.heroAlt, typedLocale)}
                        fill
                        className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 44vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-7 sm:p-9">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
                          {pickProductField(product.category, typedLocale)}
                        </p>
                        <h3 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                          {product.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 p-7 sm:p-9">
                      <p className="max-w-md text-sm leading-7 text-muted">
                        {pickProductField(product.tagline, typedLocale)}
                      </p>
                      <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-fg transition-transform duration-300 group-hover:translate-x-1">
                        {tCommon("viewProduct")}
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sovereign capability — split media + text */}
        <section className="brand-font relative flex min-h-screen snap-start items-end overflow-hidden bg-black text-white">
          <Image
            src="/norway-operations.png"
            alt=""
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20" />
          <div className="relative z-10 w-full px-5 pb-16 sm:px-8 lg:px-16 lg:pb-24">
            <div className="mx-auto max-w-[88rem]">
              <Reveal as="p" className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">
                {t("norwayEyebrow")}
              </Reveal>
              <Reveal
                as="h2"
                delay={120}
                className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl"
              >
                {t("norwayTitle")}
              </Reveal>
              <Reveal as="p" delay={220} className="mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                {t("norwayDescription")}
              </Reveal>
              <Reveal delay={320}>
                <Link
                  href="/security"
                  className="mt-9 inline-flex items-center gap-3 border-b border-white/40 pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:border-white"
                >
                  {tCommon("learnMore")}
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="brand-font flex min-h-[80vh] snap-start items-center bg-bg px-5 py-28 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[88rem]">
            <Reveal
              as="h2"
              className="max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-fg sm:text-7xl lg:text-8xl"
            >
              {t("ctaTitle")}
            </Reveal>
            <Reveal delay={180}>
              <Link
                href="/contact"
                className="mt-12 inline-flex w-fit items-center gap-3 bg-fg px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
              >
                {tCommon("contactSpectr")}
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
