import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { newsItems, newsSection } from "@/lib/content";

export function News() {
  return (
    <section id="news" className="section scroll-mt-24 border-t border-border">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="brand-font text-[2rem] font-normal tracking-tight text-fg sm:text-[2.75rem]">
              {newsSection.title}
            </h2>
            <Link
              href={newsSection.viewAllHref}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted hover:text-fg"
            >
              {newsSection.viewAllLabel} →
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {newsItems.map((item, index) => (
            <li key={item.id}>
              <Reveal delay={index * 80}>
                <article className="bevel-panel bevel-panel-muted overflow-hidden">
                  <Link href={item.href} className="group block">
                    <div className="bevel-panel-image relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 40rem"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                    <div className="p-6 sm:p-7">
                      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                        {item.source}, {item.date}
                      </p>
                      <h3 className="brand-font mt-3 text-xl tracking-tight text-fg transition-opacity group-hover:opacity-70 sm:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p>
                      <span className="mt-5 inline-block text-sm text-fg/80">↳ {item.cta}</span>
                    </div>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
