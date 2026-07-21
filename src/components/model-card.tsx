import Image from "next/image";
import { Link } from "@/i18n/navigation";

export type TryNeon = "yellow" | "purple" | "green";

type ModelCardProps = {
  category: string;
  name: string;
  description: string;
  image?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string; neon?: TryNeon; size?: "sm" | "md" };
  priority?: boolean;
};

const neonClass: Record<TryNeon, string> = {
  yellow: "pill--neon-yellow",
  purple: "pill--neon-purple",
  green: "pill--neon-green",
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
    <article className="card relative isolate min-h-[380px] overflow-hidden sm:min-h-[420px]">
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
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

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2.5 p-5 sm:p-6">
        <h3 className="brand-font text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          {name}
        </h3>
        <p className="text-sm leading-6 text-white/70">{description}</p>
        {(primary || secondary) && (
          <div className="mt-1 flex flex-wrap items-center gap-2.5">
            {primary ? (
              <Link href={primary.href} className="pill pill--primary">
                {primary.label}
              </Link>
            ) : null}
            {secondary ? (
              <Link
                href={secondary.href}
                className={[
                  "pill",
                  secondary.neon ? neonClass[secondary.neon] : "pill--on-media",
                  secondary.size === "sm" ? "pill--sm" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
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
