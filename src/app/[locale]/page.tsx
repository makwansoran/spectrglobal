import { getTranslations, setRequestLocale } from "next-intl/server";
import { AutonomousEngineSection } from "@/components/autonomous-engine-section";
import { BevelButton } from "@/components/bevel-button";
import { Footer } from "@/components/footer";
import {
  HeroBrandLockup,
} from "@/components/hero-brand-lockup";
import { Nav } from "@/components/nav";
import { Reveal } from "@/components/reveal";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { ScrollVideoBackground } from "@/components/scroll-video-background";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tNav = await getTranslations({ locale, namespace: "Nav" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const heroText = t("hero");
  const brandLockupDelay = heroText.replace(/\s/g, "").length * 14 + 80;

  return (
    <>
      <Nav />

      <main
        id="main-content"
        data-scroll-root
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
              <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center">
                <ScrollRevealHeading
                  as="h1"
                  revealOnMount
                  className="mx-auto max-w-4xl text-4xl font-semibold leading-[0.98] text-white sm:text-6xl lg:text-7xl"
                >
                  {heroText}
                </ScrollRevealHeading>
                <HeroBrandLockup
                  brand={tNav("brand")}
                  revealDelay={brandLockupDelay}
                />
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
            <ScrollRevealHeading
              as="h2"
              className="mt-8 max-w-5xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              {t("missionStatement")}
            </ScrollRevealHeading>
            <Reveal delay={260}>
              <BevelButton href="/about" variant="inverse-primary" className="mt-12 tracking-[0.18em]">
                {tCommon("learnMore")}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </Reveal>
          </div>
        </section>

        <AutonomousEngineSection title={t("autonomousEngineTitle")} cta={tNav("getStarted")} />

        {/* Sovereign capability — split media + text */}
        <ScrollVideoBackground
          src="/norway-sovereign.mp4"
          brandOverlay
          className="brand-font relative flex min-h-screen snap-start items-end overflow-hidden bg-black text-white"
        >
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
                <BevelButton href="/security" variant="inverse-primary" className="mt-9 tracking-[0.18em]">
                  {tCommon("learnMore")}
                  <span aria-hidden="true">→</span>
                </BevelButton>
              </Reveal>
            </div>
          </div>
        </ScrollVideoBackground>

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
              <BevelButton href="/contact" size="lg" className="mt-12 w-fit">
                {tCommon("contactSpectr")}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </Reveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
