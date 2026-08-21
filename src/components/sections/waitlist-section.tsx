import Image from "next/image";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section
      id="spectros"
      className="bg-[#F9F9F9] px-4 pb-[140px] pt-[80px] sm:px-6"
      aria-labelledby="spectros-waitlist-heading"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,36rem)] lg:gap-16">
        <div className="max-w-xl">
          <h2
            id="spectros-waitlist-heading"
            className="m-0 text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#0A0A0A]"
          >
            Be one of the first
            <br />
            to use spectrOs
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-[#6B6B72]">
            We&apos;re soon releasing. Join the waitlist and we&apos;ll email you when it&apos;s ready.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
        </div>

        <div className="rounded-[1.4rem] bg-white p-2 sm:rounded-[1.6rem] sm:p-3">
          <div className="relative aspect-[4/3] min-h-[14rem] overflow-hidden rounded-2xl bg-black">
            <Image
              src="/images/products/spectros-waitlist.png"
              alt="spectrOs running on a laptop"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 36rem"
              quality={90}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
