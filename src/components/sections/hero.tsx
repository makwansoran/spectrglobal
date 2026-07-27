import { ArrowIcon, Button } from "@/components/button";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-28 pb-20 sm:pt-32">
      <div className="container-x">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="display fade-up text-4xl text-gradient sm:text-6xl lg:text-[4.25rem]">
            {hero.title}
          </h1>

          <div className="fade-up fade-up-2 mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
              <ArrowIcon />
            </Button>
            <Button href={hero.secondaryCta.href} size="lg">
              {hero.secondaryCta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
