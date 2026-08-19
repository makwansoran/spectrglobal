import { partnerQuotes } from "@/lib/content";

const logos = [...partnerQuotes.map((quote) => quote.company), ...partnerQuotes.map((quote) => quote.company)];

export function LogoMarquee() {
  return (
    <section className="py-10 sm:py-14" aria-label="Partners">
      <div className="logo-marquee">
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
