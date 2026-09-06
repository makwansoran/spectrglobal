import { ContactUsExpandButton } from "@/components/sections/contact-us-expand-button";
import { GetStartedExpandButton } from "@/components/sections/get-started-expand-button";

export function HomeCtaSection() {
  return (
    <section
      id="get-started"
      className="scroll-mt-24 bg-white px-4 pb-20 pt-4 sm:px-6 sm:pb-[140px] sm:pt-8"
      aria-labelledby="get-started-heading"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 id="get-started-heading" className="home-display">
          Get Started
        </h2>
        <p className="mt-6 max-w-2xl text-[17px] font-normal leading-[1.4] text-[#1E1F2B]">
          Ready to run Spectr OS on your operation — or want to talk first.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <GetStartedExpandButton />
          <ContactUsExpandButton />
        </div>
      </div>
    </section>
  );
}
