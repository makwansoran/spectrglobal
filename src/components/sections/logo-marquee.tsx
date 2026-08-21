import { integrations, integrationsSection } from "@/lib/integrations";

function LogoRow({
  items,
  reverse = false,
  duration,
}: {
  items: typeof integrations;
  reverse?: boolean;
  duration: string;
}) {
  const loop = [...items, ...items];

  return (
    <div className="logo-marquee">
      <div
        className={`logo-marquee__track ${reverse ? "logo-marquee__track--reverse" : ""}`}
        style={{ animationDuration: duration }}
      >
        {loop.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="logo-marquee__item"
            aria-hidden={index >= items.length}
          >
            <img
              src={item.logo}
              alt={index >= items.length ? "" : item.name}
              className={`logo-marquee__img${item.id === "yokogawa" ? " logo-marquee__img--on-dark" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoMarquee() {
  const midpoint = Math.ceil(integrations.length / 2);
  const firstRow = integrations.slice(0, midpoint);
  const secondRow = integrations.slice(midpoint);

  return (
    <section
      id="integrations"
      className="scroll-mt-24 bg-[#F9F9F9] px-6 pb-[140px] pt-[128px]"
      aria-labelledby="integrations-heading"
    >
      <h2
        id="integrations-heading"
        className="m-0 mb-6 text-center text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]"
      >
        {integrationsSection.eyebrow}
      </h2>
      <p className="mx-auto mb-16 max-w-2xl text-center text-[17px] leading-7 text-[#5B5B5B]">
        {integrationsSection.body}
      </p>

      <div className="space-y-6" aria-label="Integration partners">
        <LogoRow items={firstRow} duration="70s" />
        <LogoRow items={secondRow} reverse duration="82s" />
      </div>
    </section>
  );
}
