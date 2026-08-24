import Link from "next/link";
import "./waitlist-section.css";

export function WaitlistSection() {
  return (
    <section
      id="spectros"
      className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:pb-[140px] lg:pt-[100px]"
      aria-labelledby="industry-preview-title"
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <h1 id="industry-preview-title" className="home-display min-w-0">
          AI system
          <br />
          for Industry
        </h1>

        <div className="min-w-0 max-w-xl">
          <h2 id="spectros-waitlist-heading" className="home-display">
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
      </div>
    </section>
  );
}
