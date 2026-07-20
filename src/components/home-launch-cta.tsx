import { BevelButton } from "@/components/bevel-button";

type HomeLaunchCtaProps = {
  title: string;
  contactLabel: string;
};

export function HomeLaunchCta({ title, contactLabel }: HomeLaunchCtaProps) {
  return (
    <section className="brand-font bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="bevel-card relative overflow-hidden bg-[#f44200] px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,255,255,0.22),transparent_60%)]"
          />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-7xl lg:leading-[0.95]">
              {title}
            </h2>
            <div className="mt-10">
              <BevelButton href="/contact" variant="primary" className="w-fit tracking-[0.16em]">
                {contactLabel}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
