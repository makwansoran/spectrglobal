import Image from "next/image";

export function VideoBrandBadge() {
  return (
    <div
      className="pointer-events-none absolute bottom-5 right-5 z-[5] flex items-center gap-2.5 rounded-md bg-black/95 px-3 py-2.5 shadow-lg ring-1 ring-white/10 sm:bottom-8 sm:right-8"
      aria-hidden="true"
    >
      <Image
        src="/spectr-logo.png"
        alt=""
        width={28}
        height={28}
        className="h-7 w-auto invert"
      />
      <span className="brand-font text-xs font-semibold uppercase tracking-[0.34em] text-white">Spectr</span>
    </div>
  );
}
