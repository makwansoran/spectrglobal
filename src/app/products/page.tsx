import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { objects } from "@/lib/objects";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto grid max-w-7xl gap-16 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          {objects.map((product) => (
            <article key={product.slug} className="group border border-border bg-surface">
              <div className="flex flex-col">
                <div className="p-6 sm:p-8">
                  <p className="label">{product.category}</p>
                  <h2 className="mt-5 text-4xl font-semibold leading-none tracking-[-0.05em] sm:text-5xl">
                    <Link href={`/products/${product.slug}`} className="hover:text-muted">
                      {product.name}
                    </Link>
                  </h2>

                  <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>
                </div>

                <div className="border-y border-border bg-bg/40">
                  <ObjectVisual visual={product.visual} className="h-80 w-full grayscale sm:h-[460px]" />
                </div>

                <div className="p-6 text-center sm:p-8">
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] text-fg">Specs</h3>
                  <div className="mt-8 space-y-10">
                    <SpecList
                      title="Overview"
                      items={[
                        { label: "Use", value: product.use },
                        { label: "Flight", value: product.flightTime },
                        { label: "Range", value: product.range },
                        { label: "Status", value: product.availability },
                        { label: "Pricing", value: product.price },
                      ]}
                    />
                    <SpecList title="Specifications" items={product.specifications} />
                    <SpecList title="Recommended Equipment" items={product.equipment} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
        <Footer />
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
          <div key={item.label} className="py-3 text-sm">
            <dt className="text-muted">{item.label}</dt>
            <dd className="mt-2 text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
