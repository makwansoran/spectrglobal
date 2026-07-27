import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden="true">
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/videos/hero-northern-lights.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bg" />
      </div>

      <div className="container-x relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 pb-24 pt-28">
        <h1 className="display fade-up mx-auto max-w-5xl text-center text-[2.35rem] text-white sm:text-6xl lg:text-[4.5rem]">
          <span className="block">{hero.title}</span>
          <span className="mt-1 block font-normal opacity-90 sm:mt-2">{hero.titleLine2}</span>
        </h1>

        <div className="fade-up fade-up-3 absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/75">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]">Scroll to Explore</span>
          <span className="scroll-cue" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path
                d="M8 3v10m0 0 4-4m-4 4L4 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
