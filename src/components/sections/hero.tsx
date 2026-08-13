import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-28 sm:px-8">
        <h1 className="brand-font max-w-[16ch] text-center text-[clamp(2.75rem,8vw,6.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-fg">
          <span className="block">{hero.title}</span>
          <span className="mt-1 block sm:mt-2">{hero.titleLine2}</span>
        </h1>
      </div>
    </section>
  );
}
