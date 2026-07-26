import { ArrowIcon, Button } from "@/components/button";
import { LogoMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { closingCta } from "@/lib/content";

export function ClosingCta() {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="card card-glow relative overflow-hidden px-6 py-20 text-center sm:px-12 lg:py-28">
            <div
              className="pointer-events-none absolute inset-x-0 -top-1/2 h-full bg-[radial-gradient(ellipse_at_center,rgba(61,77,255,0.12),transparent_65%)]"
              aria-hidden="true"
            />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <LogoMark className="h-10 w-10 text-fg/40" />
              <h2 className="display mt-9 text-3xl text-gradient sm:text-5xl">{closingCta.title}</h2>
              <p className="mt-6 text-base leading-8 text-muted">{closingCta.subtitle}</p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href={closingCta.primary.href} size="lg">
                  {closingCta.primary.label}
                  <ArrowIcon />
                </Button>
                <Button href={closingCta.secondary.href} size="lg">
                  {closingCta.secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
