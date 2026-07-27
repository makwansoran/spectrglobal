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

        <ul className="mt-12 grid gap-0 border border-border md:grid-cols-2">
          {newsItems.map((item, index) => (
            <li
              key={item.id}
              className={`border-border p-7 sm:p-9 ${index > 0 ? "border-t md:border-t-0 md:border-l" : ""}`}
            >
              <Reveal delay={index * 80}>
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  {item.source}, {item.date}
                </p>
                <h3 className="brand-font mt-4 text-xl tracking-tight text-fg sm:text-2xl">
                  <Link href={item.href} className="hover:opacity-70">
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted">{item.summary}</p>
                <Link href={item.href} className="mt-6 inline-block text-sm text-fg/80 hover:text-fg">
                  ↳ {item.cta}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
