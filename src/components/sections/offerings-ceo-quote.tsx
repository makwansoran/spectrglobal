import { offeringsCeoQuote } from "@/lib/content";

export function OfferingsCeoQuote() {
  return (
    <section className="border-t border-[#D2D2CE] bg-white px-6 py-[128px]" aria-label="From the CEO">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="m-0 text-[15px] leading-snug tracking-[-0.01em] text-[#AAAAAA]">From the CEO</p>

        <blockquote className="mt-10 m-0 max-w-[58rem]">
          <p className="m-0 text-[clamp(28px,3.8vw,48px)] font-normal leading-[1.18] tracking-[-0.03em] text-[#1E1F2B]">
            {offeringsCeoQuote.quote}
          </p>
          <footer className="mt-12">
            <p className="m-0 text-[17px] font-medium leading-snug text-[#1E1F2B]">
              {offeringsCeoQuote.attribution}
            </p>
            <p className="mt-1 m-0 text-[15px] leading-snug text-[#AAAAAA]">{offeringsCeoQuote.role}</p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
