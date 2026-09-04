import { integrations, integrationsSection } from "@/lib/integrations";

type LogoItem = {
  id: string;
  name: string;
  logo: string;
};

function LogoRow({
  items,
  reverse = false,
  duration,
}: {
  items: readonly LogoItem[];
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
              className={`logo-marquee__img${item.id === "yokogawa" ? " logo-marquee__img--on-dark" : ""}${item.logo.startsWith("/images/models/") ? " logo-marquee__img--model" : ""}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LogoMarquee({
  items = integrations,
  id = "integrations",
  headingId = "integrations-heading",
  heading = integrationsSection.eyebrow,
  body = integrationsSection.body,
  ariaLabel = "Integration partners",
  compact = false,
  duration = "70s",
}: {
  items?: readonly LogoItem[];
  id?: string;
  headingId?: string;
  heading?: string;
  body?: string;
  ariaLabel?: string;
  compact?: boolean;
  duration?: string;
}) {
  const useTwoRows = items.length > 8;
  const midpoint = Math.ceil(items.length / 2);
  const firstRow = useTwoRows ? items.slice(0, midpoint) : items;
  const secondRow = useTwoRows ? items.slice(midpoint) : [];
  const reverseDuration = `${Math.round(Number.parseFloat(duration) * 1.17)}s`;

  return (
    <section
      id={id}
      className={
        compact
          ? "scroll-mt-24 bg-white px-6 pb-[88px] pt-[64px]"
          : "scroll-mt-24 bg-white px-6 pb-[140px] pt-[128px]"
      }
      aria-labelledby={headingId}
    >
      <h2
        id={headingId}
        className="home-display mb-12 text-center sm:mb-16"
      >
        {heading}
      </h2>
      <p className="mx-auto mb-16 max-w-2xl text-center text-[17px] font-normal leading-[1.4] text-[#1E1F2B]">
        {body}
      </p>

      <div className="space-y-6" aria-label={ariaLabel}>
        <LogoRow items={firstRow} duration={duration} />
        {secondRow.length > 0 ? (
          <LogoRow items={secondRow} reverse duration={reverseDuration} />
        ) : null}
      </div>
    </section>
  );
}
