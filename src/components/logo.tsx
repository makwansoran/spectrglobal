import Image from "next/image";

type LogoMarkProps = {
  className?: string;
  /** Use white mark on dark surfaces (navbar). Default is black for light pages. */
  invert?: boolean;
  title?: string;
};

export function LogoMark({ className = "h-7 w-7", invert = false, title }: LogoMarkProps) {
  return (
    <Image
      src={invert ? "/spectr-logo-white.png" : "/spectr-logo-black.png"}
      alt={title ?? "Spectr"}
      width={112}
      height={112}
      className={`object-contain ${className}`}
      priority={invert}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`brand-font text-[0.95rem] font-semibold uppercase tracking-[0.32em] ${className}`}
    >
      Spectr
    </span>
  );
}
