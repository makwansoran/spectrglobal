import Image from "next/image";

type HeroBrandLockupProps = {
  brand: string;
  revealDelay?: number;
  className?: string;
};

export function HeroBrandLockup({
  brand,
  className = "",
}: HeroBrandLockupProps) {
  return (
    <div
      className={`hero-brand-lockup flex items-center justify-center gap-3 ${
        className || "mx-auto mt-10"
      }`}
    >
      <span className="inline-flex shrink-0">
        <Image
          src="/spectr-logo.png"
          alt={brand}
          width={40}
          height={40}
          className="h-8 w-auto shrink-0 invert"
          priority
        />
      </span>
      <span className="brand-font text-sm font-semibold uppercase tracking-[0.34em] text-white">
        {brand}
      </span>
    </div>
  );
}
