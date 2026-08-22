import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { WaitlistForm } from "@/components/sections/waitlist-form";
import { buildPageMetadata } from "@/lib/metadata";

const description =
  "Join the Spectr OS waitlist. Tell us who you are, where you work, and what you will use it for — we will email you when it is ready.";

export const metadata: Metadata = buildPageMetadata({
  title: "Waitlist",
  description,
  path: "/waitlist",
});

export default function WaitlistPage() {
  return (
    <>
      <main id="main-content" className="flex-1 bg-white">
        <section className="px-6 py-14 lg:py-20" aria-labelledby="waitlist-heading">
          <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a8f94]">
                Spectr OS
              </p>
              <h1
                id="waitlist-heading"
                className="mt-3 m-0 text-[clamp(42px,6vw,58px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]"
              >
                Join the waitlist
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-[#6B6B72]">
                We&apos;re soon releasing. Leave your details and we&apos;ll email you when Spectr OS is
                ready to run on your floor.
              </p>
            </div>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
