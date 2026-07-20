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
    <article className="card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative min-h-[240px] overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-teal-50 lg:min-h-[360px]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10 lg:p-12">
          <span className="label">{category}</span>
          <h3 className="brand-font text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{name}</h3>
          <p className="max-w-md text-base leading-7 text-muted">{description}</p>
          {(primary || secondary) && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {primary ? (
                <Link href={primary.href} className="pill pill--primary">
                  {primary.label}
                </Link>
              ) : null}
              {secondary ? (
                <Link href={secondary.href} className="pill pill--secondary">
                  {secondary.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
