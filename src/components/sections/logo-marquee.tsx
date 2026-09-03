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
      className="scroll-mt-24 bg-white px-6 pb-[140px] pt-[128px]"
      aria-labelledby="integrations-heading"
    >
      <h2
        id="integrations-heading"
        className="home-display mb-12 text-center sm:mb-16"
      >
        {integrationsSection.eyebrow}
      </h2>
      <p className="mx-auto mb-16 max-w-2xl text-center text-[17px] font-normal leading-[1.4] text-[#1E1F2B]">
        {integrationsSection.body}
      </p>

      <div className="space-y-6" aria-label="Integration partners">
        <LogoRow items={firstRow} duration="70s" />
        <LogoRow items={secondRow} reverse duration="82s" />
      </div>
    </section>
  );
}
