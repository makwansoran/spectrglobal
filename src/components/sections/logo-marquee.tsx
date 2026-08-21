import { partnerQuotes } from "@/lib/content";

const logos = [...partnerQuotes.map((quote) => quote.company), ...partnerQuotes.map((quote) => quote.company)];

export function LogoMarquee() {
  return (
    <section
      className="bg-[#F9F9F9] px-6 pb-[140px] pt-[128px]"
      aria-label="Partners"
    >
      <div className="logo-marquee">
        <h2 className="m-0 mb-16 text-center text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
          Integrations
        </h2>

        <div className="logo-marquee__track">
          {logos.map((name, index) => (
            <p
              key={`${name}-${index}`}
              className="display shrink-0 px-8 text-2xl tracking-[-0.03em] text-fg/55 sm:px-12 sm:text-3xl"
            >
              {name}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
