import Image from "next/image";
import Link from "next/link";

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

export function BrandLink({
  href = "/",
  light = false,
}: {
  href?: string;
  light?: boolean;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 hover:opacity-80">
      <LogoMark invert={light} className="h-8 w-8" />
      <Wordmark className={light ? "text-white" : "text-[#0a2540]"} />
    </Link>
  );
}
