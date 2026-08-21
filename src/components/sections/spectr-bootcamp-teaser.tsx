import Link from "next/link";
import { spectrBootcamp } from "@/lib/content";

export function SpectrBootcampTeaser() {
  return (
    <section
      className="bg-white px-4 pb-[140px] pt-[80px] sm:px-6"
      aria-labelledby="bootcamp-teaser-heading"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,36rem)] lg:gap-16">
        <div className="max-w-xl">
          <p className="m-0 text-[15px] leading-snug tracking-[-0.01em] text-[#AAAAAA]">
            {spectrBootcamp.eyebrow}
          </p>
          <h2
            id="bootcamp-teaser-heading"
            className="mt-6 m-0 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#0A0A0A]"
          >
            Learn to create
            <br />
            your own AI.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-[#6B6B72] sm:mt-5 sm:text-base">
            {spectrBootcamp.body}
          </p>
        </div>

        <Link href={spectrBootcamp.href} className="group block focus-visible:outline-offset-4">
          <div className="rounded-[1.4rem] bg-[#F4F4F4] p-2 sm:rounded-[1.6rem] sm:bg-white sm:p-3">
            <div className="relative aspect-[4/3] min-h-[14rem] overflow-hidden rounded-2xl bg-[#E8E8E8]">
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-10">
                <span className="inline-flex w-fit items-center justify-center border border-[#0A0A0A] bg-white px-[22px] py-[11px] text-sm font-semibold text-[#0A0A0A] transition-colors duration-150 group-hover:bg-[#F4F4F4]">
                  {spectrBootcamp.cta}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
