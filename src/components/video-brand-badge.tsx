import Image from "next/image";

export function VideoBrandBadge() {
  return (
    <div
      className="pointer-events-none absolute bottom-12 right-5 z-[5] rounded-md bg-black/95 p-2.5 shadow-lg ring-1 ring-white/10 sm:bottom-16 sm:right-8"
      aria-hidden="true"
    >
      <Image
        src="/spectr-logo.png"
        alt=""
        width={32}
        height={32}
        className="h-8 w-auto invert"
      />
    </div>
  );
}
