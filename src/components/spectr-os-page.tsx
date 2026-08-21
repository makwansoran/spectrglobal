import Image from "next/image";
import { GetStartedButton } from "@/components/get-started-button";
import { Reveal } from "@/components/reveal";
import { LogoMarquee } from "@/components/sections/logo-marquee";
import { spectrOsPage } from "@/lib/spectr-os-page";

export function SpectrOsPageView() {
  const page = spectrOsPage;

  return (
    <main id="main-content" className="relative flex-1">
      <section className="relative overflow-hidden">
        <div className="container-x grid items-end gap-12 pb-16 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pb-24 lg:pt-24">
          <Reveal>
            <p className="text-sm font-medium text-muted">{page.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(3.2rem,8vw,7rem)] text-fg">{page.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{page.heroBody}</p>
            <div className="mt-8">
              <GetStartedButton label="Get started" size="lg">
                Get started
              </GetStartedButton>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src="/images/products/spectr-os-ui.png"
                alt="Spectr OS interface"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <h2 className="display text-[clamp(2.2rem,5vw,4.5rem)] text-fg">{page.introTitle}</h2>
          <p className="text-lg leading-8 text-muted">{page.intro}</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container-x">
          <h2 className="display max-w-3xl text-[clamp(2.2rem,5vw,4.5rem)] text-fg">{page.featuresTitle}</h2>
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {page.features.map((feature, index) => (
              <li key={feature.id}>
                <Reveal delay={Math.min(index * 30, 180)}>
                  <article className="h-full rounded-2xl border border-border bg-surface p-6 sm:p-8">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="display mt-4 text-3xl text-fg sm:text-4xl">{feature.title}</h3>
                    <p className="mt-4 text-[15px] leading-7 text-muted">{feature.body}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LogoMarquee />

      <section className="pb-20 sm:pb-28">
        <div className="container-x">
          <div className="rounded-[1.75rem] bg-[#161513] px-8 py-12 text-white sm:px-12 sm:py-16">
            <h2 className="display max-w-3xl text-[clamp(2rem,4vw,3.8rem)]">{page.ctaTitle}</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">{page.ctaBody}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GetStartedButton label="Get started" size="lg">
                Get started
              </GetStartedButton>
              <GetStartedButton label="Request a demo" size="lg" variant="secondary" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                Request a demo
              </GetStartedButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
