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

export default async function InvestmentPage({ params }: Props) {
  const { slug } = await params;
  const obj = getObject(slug);
  if (!obj) notFound();

  const remaining = 100 - obj.stock;

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">

        {/* Breadcrumb */}
        <div className="px-6 py-4 sm:px-10">
          <Link href="/investments" className="label text-muted hover:text-fg">
            ← Drones
          </Link>
        </div>

        {/* Hero split */}
        <div className="grid lg:grid-cols-[1fr_400px]">

          {/* Left: info */}
          <div className="p-8 lg:p-14">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.category}</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.use}</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.location}</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">{obj.flightTime} flight time</span>
            </div>
            <h1 className="display mt-6 text-6xl sm:text-8xl">{obj.name}</h1>
            <p className="mt-3 text-xl text-muted">{obj.tagline}</p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{obj.description}</p>

            <div className="mt-8 flex flex-wrap gap-2">
              {obj.highlights.map((h) => (
                <span key={h} className="border border-border px-3 py-1.5 text-xs">{h}</span>
              ))}
            </div>
          </div>

          {/* Right: visual + facts */}
          <div className="flex flex-col">
            <div className="flex-1">
              <ObjectVisual visual={obj.visual} className="h-60 w-full lg:h-full" />
            </div>
            <div className="grid grid-cols-2 divide-x">
              {([
                ["Price", obj.price],
                ["Availability", obj.availability],
                ["Range", obj.range],
                ["Flight time", obj.flightTime],
              ] as [string, string | number][]).map(([label, value]) => (
                <div key={label} className="px-5 py-4">
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
            <span className="label block">Current stock</span>
            <div className="mt-8 space-y-3">
              <div className="h-[3px] w-full bg-border">
                <div className="h-full bg-fg" style={{ width: `${obj.stock}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">{obj.stock}% available</span>
                <span>{remaining}% reserved or sold</span>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Stock levels update as orders are processed. Reserve {obj.name}
              today to lock in the listed price of {obj.price}.
            </p>
          </div>

          <div className="flex flex-col justify-between p-8 sm:p-12">
            <div>
              <span className="label block">Order this drone</span>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Tell us how you plan to use {obj.name} and our team will confirm
                availability, shipping, and the best setup for your mission.
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
                href="/investments"
                className="block w-full border border-border px-5 py-4 text-center text-sm text-muted hover:border-fg hover:text-fg"
              >
                Browse all drones
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {objects.filter((o) => o.category === obj.category && o.slug !== obj.slug).length > 0 && (
          <div className="px-6 pb-4 pt-12 sm:px-10">
            <span className="label mb-6 block">Other {obj.category} drones</span>
            <div className="grid gap-8 sm:grid-cols-3">
              {objects
                .filter((o) => o.category === obj.category && o.slug !== obj.slug)
                .slice(0, 3)
                .map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/investments/${rel.slug}`}
                    className="flex flex-col bg-bg p-6 hover:bg-surface"
                  >
                    <div className="mb-3 aspect-video border border-border">
                      <ObjectVisual visual={rel.visual} className="h-full w-full" />
                    </div>
                    <h3 className="display text-2xl">{rel.name}</h3>
                    <p className="mt-1 text-sm text-muted">{rel.tagline}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted">
                      <span>{rel.use}</span>
                      <span>{rel.price}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
