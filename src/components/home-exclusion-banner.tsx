import { BevelButton } from "@/components/bevel-button";

type HomeExclusionBannerProps = {
  text: string;
  cta: string;
  href?: string;
};

export function HomeExclusionBanner({
  text,
  cta,
  href = "/security",
}: HomeExclusionBannerProps) {
  return (
    <section className="brand-font bg-[#f8f8f8] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="bevel-card flex flex-col gap-8 bg-black px-6 py-10 text-white sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <p className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.04em] sm:text-4xl lg:text-5xl">
            {text}
          </p>
          <BevelButton href={href} variant="inverse-primary" className="w-fit shrink-0 tracking-[0.16em]">
            {cta}
            <span aria-hidden="true">→</span>
          </BevelButton>
        </div>
      </div>
    </section>
  );
}
