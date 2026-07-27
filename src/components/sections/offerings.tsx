import Link from "next/link";
import { offerings } from "@/lib/content";

export function Offerings() {
  return (
    <section id="offerings" className="scroll-mt-24">
      <div className="offerings-rail" aria-label="Offerings">
        {offerings.map((item) => (
          <Link key={item.id} href={item.href} className="offering-card group">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{item.label}</p>
            <h3 className="brand-font mt-8 max-w-[16rem] text-2xl leading-snug tracking-tight text-fg transition-opacity group-hover:opacity-70 sm:text-[1.65rem]">
              {item.title}
            </h3>
            <p className="mt-auto pt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              ← →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
