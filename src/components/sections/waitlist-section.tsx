import Image from "next/image";
import Link from "next/link";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section
      id="spectros"
      className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:pb-[140px] lg:pt-[80px]"
      aria-labelledby="spectros-waitlist-heading"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,36rem)] lg:gap-16">
        <div className="max-w-xl">
          <h2
            id="spectros-waitlist-heading"
            className="home-display"
          >
            Be one of the first
            <br />
            to use spectrOs
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-7 text-[#6B6B72] sm:mt-5 sm:text-base">
            We&apos;re soon releasing. Join the waitlist and we&apos;ll email you when it&apos;s ready.
          </p>
          <div className="mt-6 sm:mt-8">
            <Link href="/waitlist" className="spectros-waitlist__join">
              Join waitlist
            </Link>
          </div>
        </div>

        <div className="rounded-[1.2rem] bg-[#F4F4F4] p-2 sm:rounded-[1.6rem] sm:bg-white sm:p-3">
          <div className="relative aspect-[16/10] min-h-[12.5rem] overflow-hidden rounded-2xl bg-black sm:aspect-[4/3] sm:min-h-[14rem]">
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
