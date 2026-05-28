import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { objects } from "@/lib/objects";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-px px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          {objects.map((product) => (
            <article key={product.slug} className="group border border-border bg-surface">
              <div className="grid min-h-full lg:grid-cols-[0.9fr_1.1fr]">
                <div className="border-b border-border bg-bg/40 lg:border-b-0 lg:border-r">
                  <ObjectVisual visual={product.visual} className="h-72 w-full grayscale" />
                </div>
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="label">{product.category}</p>
                      <h2 className="mt-5 text-3xl font-semibold tracking-[-0.05em]">{product.name}</h2>
                    </div>
                    <span className="font-mono text-sm text-muted">{product.price}</span>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>

                  <dl className="mt-8 grid grid-cols-2 gap-px border border-border bg-border text-sm">
                    {[
                      ["Use", product.use],
                      ["Flight", product.flightTime],
                      ["Range", product.range],
                      ["Status", product.availability],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-surface p-4">
                        <dt className="label">{label}</dt>
                        <dd className="mt-2 text-fg">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {product.highlights.map((highlight) => (
                      <span key={highlight} className="border border-border px-3 py-1.5 text-xs text-muted">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    <SpecList title="Specifications" items={product.specifications} />
                    <SpecList title="Recommended Equipment" items={product.equipment} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

function SpecList({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <section>
      <h3 className="label">{title}</h3>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2 py-3 text-sm sm:grid-cols-[150px_1fr]">
            <dt className="text-muted">{item.label}</dt>
            <dd className="text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
