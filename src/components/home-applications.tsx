import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ApplicationSlug } from "@/lib/applications";

type ApplicationCard = {
  slug: ApplicationSlug;
  title: string;
  text: string;
  imageSrc: string;
  href: string;
};

type HomeApplicationsProps = {
  title: string;
  items: ApplicationCard[];
};

export function HomeApplications({ title, items }: HomeApplicationsProps) {
  return (
    <section className="brand-font bg-[#efefef] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto w-full max-w-[90rem]">
        <h2 className="mx-auto max-w-4xl text-center text-4xl font-semibold leading-[1.05] tracking-[-0.05em] text-fg sm:text-5xl lg:text-[3.625rem] lg:leading-[1.1]">
          {title}
        </h2>

        <div className="mt-14 -mx-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
          <ul className="flex w-max list-none gap-4 p-0 lg:w-full lg:justify-between">
            {items.map((item) => (
              <li key={item.slug} className="shrink-0 lg:min-w-0 lg:flex-1">
                <Link
                  href={item.href}
                  className="bevel-card group relative block h-[26.875rem] w-[min(20.25rem,78vw)] overflow-hidden bg-black text-white transition-opacity duration-200 hover:opacity-90 lg:h-[28rem] lg:w-full"
                >
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 78vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/70" />
                  <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                    <h3 className="text-2xl font-semibold tracking-[-0.05em] sm:text-[2.25rem]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[16rem] text-base leading-6 text-white/85 sm:text-lg sm:leading-7">
                      {item.text}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
