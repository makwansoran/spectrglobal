import Image from "next/image";

export function VideoBrandBadge() {
  return (
    <div
      className="pointer-events-none absolute bottom-16 right-5 z-[5] -translate-x-full p-2.5 sm:bottom-20 sm:right-8"
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
