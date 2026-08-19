import Image from "next/image";
import Link from "next/link";
import { platforms } from "@/lib/platforms";

export function ProductSuite() {
  const features = platforms[0].features;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <h2 className="display max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)] text-fg">
          Do it all with Spectr.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href="/platforms/spectr-os"
              className="group overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 1280px) 50vw, 22rem"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium tracking-[-0.02em] text-fg">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
