import { Button } from "@/components/button";
import { GetStartedButton } from "@/components/get-started-button";
import { LogoMark, Wordmark } from "@/components/logo";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-5 pb-16 pt-28 sm:gap-10 sm:px-8">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <Wordmark className="text-fg" />
        </div>

        <h1 className="brand-font max-w-3xl text-center text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em] text-fg">
          {hero.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <GetStartedButton size="lg" />
          <Button href="/platforms/spectr-os" size="lg" className="btn-login">
            Spectr OS
          </Button>
        </div>
      </div>
    </section>
  );
}
