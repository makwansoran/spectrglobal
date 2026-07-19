type Capability = {
  title: string;
  text: string;
};

type HomeCapabilityGridProps = {
  items: Capability[];
};

export function HomeCapabilityGrid({ items }: HomeCapabilityGridProps) {
  return (
    <section className="brand-font border-y border-border bg-bg px-5 py-20 sm:px-8 lg:px-16 lg:py-28">
      <div className="mx-auto grid w-full max-w-[88rem] gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.title}>
            <h3 className="text-2xl font-semibold tracking-[-0.04em] text-fg sm:text-3xl">
              {item.title}
            </h3>
            <p className="mt-4 max-w-sm text-base leading-7 text-muted">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
