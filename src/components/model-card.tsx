import Image from "next/image";
import { Link } from "@/i18n/navigation";

type ModelCardProps = {
  category: string;
  name: string;
  description: string;
  image?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  priority?: boolean;
};

export function ModelCard({
  category,
  name,
  description,
  image,
  primary,
  secondary,
  priority = false,
}: ModelCardProps) {
  return (
    <article className="card relative isolate min-h-[420px] overflow-hidden sm:min-h-[460px]">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
          priority={priority}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 via-surface to-teal-400/10" />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 p-6 sm:p-7">
        <span className="label text-white/55">{category}</span>
        <h3 className="brand-font text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
          {name}
        </h3>
        <p className="text-sm leading-6 text-white/70 sm:text-[0.95rem] sm:leading-7">{description}</p>
        {(primary || secondary) && (
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {primary ? (
              <Link href={primary.href} className="pill pill--primary text-sm">
                {primary.label}
              </Link>
            ) : null}
            {secondary ? (
              <Link
                href={secondary.href}
                className="pill border border-white/20 bg-white/10 text-sm text-white hover:bg-white/16"
              >
                {secondary.label}
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
