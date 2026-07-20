import Image from "next/image";
import { Link } from "@/i18n/navigation";

type ModelCardProps = {
  category: string;
  name: string;
  description: string;
  image?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export function ModelCard({ category, name, description, image, primary, secondary }: ModelCardProps) {
  return (
    <article className="card relative isolate min-h-[520px] overflow-hidden sm:min-h-[600px] lg:min-h-[680px]">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/25 via-surface to-teal-400/10" />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 p-7 sm:p-10 lg:max-w-2xl lg:p-12">
        <span className="label text-white/55">{category}</span>
        <h3 className="brand-font text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          {name}
        </h3>
        <p className="max-w-xl text-base leading-7 text-white/70">{description}</p>
        {(primary || secondary) && (
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {primary ? (
              <Link href={primary.href} className="pill pill--primary">
                {primary.label}
              </Link>
            ) : null}
            {secondary ? (
              <Link
                href={secondary.href}
                className="pill border border-white/20 bg-white/10 text-white hover:bg-white/16"
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
