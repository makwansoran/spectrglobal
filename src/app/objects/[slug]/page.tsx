import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { getObject, objects } from "@/lib/objects";

export function generateStaticParams() {
  return objects.map((o) => ({ slug: o.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const obj = getObject(slug);
  return { title: obj?.name ?? "Drone" };
}

export default async function ObjectPage({ params }: Props) {
  const { slug } = await params;
  const obj = getObject(slug);
  if (!obj) notFound();

  const pct = obj.stock;
  const remaining = 100 - pct;

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">
        {/* Top strip */}
        <div className="px-6 py-4 sm:px-10">
          <Link href="/objects" className="label text-muted hover:text-fg">
            ← Catalog
          </Link>
        </div>

        {/* Hero */}
        <div className="grid lg:grid-cols-[1fr_420px]">
          <div className="px-6 py-16 sm:px-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.category}</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.use}</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.year}</span>
            </div>
            <h1 className="display mt-6 text-6xl sm:text-8xl">{obj.name}</h1>
            <p className="mt-4 text-xl text-muted">{obj.tagline}</p>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">{obj.description}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              {obj.highlights.map((h) => (
                <span key={h} className="border border-border px-3 py-1.5 text-xs">{h}</span>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="flex flex-col">
            <div className="flex-1">
              <ObjectVisual visual={obj.visual} className="h-64 w-full lg:h-full" />
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 divide-x">
              {[
                ["Flight time", obj.flightTime],
                ["Range", obj.range],
                ["Price", obj.price],
                ["Availability", obj.availability],
              ].map(([label, value]) => (
                <div key={String(label)} className="px-5 py-4">
                  <span className="label block">{label}</span>
                  <span className="mt-1 block text-lg">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stock + CTA */}
        <div className="grid sm:grid-cols-2">
          <div className="p-8 sm:p-12">
            <span className="label block">Stock level</span>
            <div className="mt-6 space-y-3">
              <div className="h-[3px] w-full bg-border">
                <div className="h-full bg-fg transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{pct}% available</span>
                <span>{remaining}% reserved or sold</span>
              </div>
            </div>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              This model is listed at {obj.price}. Availability can change quickly
              for business orders and preorder inventory.
            </p>
          </div>

          <div className="flex flex-col justify-between p-8 sm:p-12">
            <div>
              <span className="label block">Request this drone</span>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Submit your interest and a Spectr product specialist will respond
                with shipping timing, setup options, and recommended accessories.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <Link
                href="/contact"
                className="block w-full border border-fg bg-fg px-5 py-4 text-center text-sm text-bg hover:opacity-80"
              >
                Request {obj.name}
              </Link>
              <Link
                href="/objects"
                className="block w-full border border-border px-5 py-4 text-center text-sm text-muted hover:border-fg hover:text-fg"
              >
                Browse other drones
              </Link>
            </div>
          </div>
        </div>

        {/* Related drones */}
        <div className="px-6 pb-4 pt-12 sm:px-10">
          <span className="label mb-6 block">Other drones in {obj.category}</span>
          <div className="divide-y divide-border">
            {objects
              .filter((o) => o.category === obj.category && o.slug !== obj.slug)
              .slice(0, 3)
              .map((related) => (
                <Link
                  key={related.slug}
                  href={`/objects/${related.slug}`}
                  className="flex items-center justify-between py-5 hover:opacity-60"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="display text-2xl">{related.name}</span>
                    <span className="hidden text-sm text-muted sm:block">{related.tagline}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>{related.use}</span>
                    <span>{related.price}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </>
  );
}
