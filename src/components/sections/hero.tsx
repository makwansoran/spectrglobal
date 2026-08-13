import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="theme-light relative flex min-h-[100svh] flex-col overflow-hidden bg-bg text-fg">
      <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-28 sm:px-8">
        <h1 className="brand-font max-w-3xl text-center text-[clamp(1.15rem,2.8vw,1.75rem)] font-semibold leading-snug tracking-[-0.02em] text-fg">
          {hero.title}
        </h1>
      </div>
    </section>
  );
}
