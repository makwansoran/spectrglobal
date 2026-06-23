import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EarthVideo } from "@/components/earth-video";
import { Footer } from "@/components/footer";
import { HalftoneBackground } from "@/components/halftone-background";
import { Nav } from "@/components/nav";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
import { Link } from "@/i18n/navigation";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });

  return (
    <>
      <Nav />

      <main
        id="main-content"
        className="flex-1 lg:h-screen lg:snap-y lg:snap-proximity lg:overflow-y-auto lg:scroll-smooth"
      >
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
                  className="mx-auto max-w-3xl text-3xl font-semibold leading-[0.98] text-white sm:text-5xl lg:text-6xl"
                >
                  {t("hero")}
                </ScrollRevealHeading>
              </div>
            </div>
          </section>
        </div>

        <section className="brand-font flex min-h-[82vh] snap-start flex-col bg-black lg:flex-row">
          <Link
            href="/products/valkyrie"
            className="group relative min-h-[41vh] flex-1 overflow-hidden bg-black text-white transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.35] lg:min-h-[82vh]"
          >
            <Image
              src="/valkyrie-hero.png"
              alt="VALKYRIE aircraft flying over mountain terrain"
              fill
              className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
                  {t("valkyrieTitle")}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                  {t("valkyrieDescription")}
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center gap-3 border border-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                {t("valkyrieCta")}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>

          <Link
            href="/products/centurion"
            className="group relative min-h-[41vh] flex-1 overflow-hidden bg-black text-white transition-[flex] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.35] lg:min-h-[82vh]"
          >
            <Image
              src="/centurion-laptop-mockup.png"
              alt="CENTURION command dashboard on laptop"
              fill
              className="object-cover object-center transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <div className="relative flex min-h-[41vh] flex-col justify-between p-7 sm:p-10 lg:min-h-[82vh] lg:p-12">
              <div className="max-w-3xl">
                <h2 className="text-4xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-6xl lg:text-7xl">
                  {t("centurionTitle")}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-white/68 sm:text-base">
                  {t("centurionDescription")}
                </p>
              </div>
              <span className="mt-10 inline-flex w-fit items-center gap-3 border border-transparent px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors group-hover:border-white">
                {t("centurionCta")}
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </Link>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div>
            <div className="grid overflow-hidden border-x border-b border-border lg:grid-cols-2">
              <div className="relative min-h-[360px] overflow-hidden bg-black sm:min-h-[420px] lg:min-h-[520px]">
                <EarthVideo />
              </div>

              <div className="flex min-h-[360px] flex-col justify-between bg-surface p-7 sm:min-h-[420px] sm:p-10 lg:min-h-[520px] lg:p-12">
                <div className="max-w-xl">
                  <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-fg sm:text-5xl lg:text-6xl">
                    {t("norwayTitle")}
                  </h2>
                  <p className="mt-6 text-base leading-8 text-muted sm:text-lg">
                    {t("norwayDescription")}
                  </p>
                </div>

                <div className="mt-10 flex flex-col items-start gap-5 sm:mt-12">
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg transition-colors hover:border-fg"
                  >
                    {tCommon("learnMore")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div>
            <div className="relative flex min-h-[420px] overflow-hidden border-y border-border bg-white px-5 py-20 text-center sm:px-8 lg:min-h-[520px] lg:py-28">
              <div className="pointer-events-none absolute inset-0">
                <HalftoneBackground />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.46)_0,rgba(255,255,255,0.74)_48%,rgba(255,255,255,0.98)_100%)]" />
              </div>
              <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center">
                <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-fg sm:text-7xl lg:text-8xl">
                  {t("newsroomTitle")}
                </h2>
                <Link
                  href="/newsroom"
                  className="mt-12 inline-flex w-fit items-center gap-3 bg-fg px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-bg hover:opacity-80"
                >
                  {t("newsroomCta")}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-bg">
          <div>
            <div className="relative min-h-[520px] overflow-hidden bg-neutral-900 text-white">
              <Image
                src="/hero-fjord.png"
                alt=""
                fill
                className="object-cover grayscale"
                sizes="100vw"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-neutral-900/65" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />

              <div className="relative mx-auto flex min-h-[520px] w-full max-w-[88rem] flex-col justify-between px-5 py-7 sm:px-8 sm:py-10 lg:px-16 lg:py-12">
                <div>
                  <div className="max-w-4xl">
                    <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] sm:text-7xl lg:text-8xl">
                      {t("investorTitle")}
                    </h2>
                    <p className="mt-8 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                      {t("investorDescription")}
                    </p>
                  </div>

                  <Link
                    href="/investor"
                    className="mt-12 inline-flex w-fit items-center gap-3 border border-transparent px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:border-white"
                  >
                    {t("investorCta")}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="brand-font snap-start bg-black text-white">
          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-24">
            <div className="max-w-4xl">
              <h2 className="text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-white sm:text-7xl lg:text-8xl">
                {t("careersTitle")}
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
                {t("careersDescription")}
              </p>
            </div>
            <Link
              href="/careers"
              className="inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
            >
              {t("careersCta")}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
