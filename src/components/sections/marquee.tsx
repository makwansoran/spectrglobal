import { marqueeCaption, marqueeItems } from "@/lib/content";

export function Marquee() {
  return (
    <section className="border-y border-border py-10" aria-label={marqueeCaption}>
      <p className="container-x text-center font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {marqueeCaption}
      </p>
      <div className="marquee mt-7">
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee__track" aria-hidden={copy === 1}>
            {marqueeItems.map((item) => (
              <span
                key={item}
                className="brand-font whitespace-nowrap text-xl font-medium tracking-tight text-fg/30 sm:text-2xl"
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
