import { ArrowIcon, Button } from "@/components/button";

export function SpectrOsSection() {
  return (
    <section id="features" className="section scroll-mt-24">
      <div className="container-x flex flex-col items-center text-center">
        <h2 className="brand-font text-[clamp(3rem,12vw,8rem)] font-normal leading-[0.9] tracking-[-0.05em] text-fg">
          SPECTR OS
        </h2>
        <div className="mt-10">
          <Button href="/platforms/spectr-os" size="lg">
            Learn more
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
