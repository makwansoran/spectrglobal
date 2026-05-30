import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { getObject, objects } from "@/lib/objects";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return objects.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getObject(slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getObject(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="flex-1 bg-bg">
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:pb-28 lg:pt-36">
          <div className="border border-border bg-surface">
            <ObjectVisual visual={product.visual} className="h-[420px] w-full grayscale lg:h-full" />
          </div>

          <div>
            <Link href="/products" className="label hover:text-fg">
              Products
            </Link>
            <h1 className="mt-6 text-5xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-7xl">
              {product.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 tracking-[-0.03em] text-fg">
              {product.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
              {product.description}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px border border-border bg-border text-sm">
              {[
                ["Category", product.category],
                ["Use", product.use],
                ["Flight", product.flightTime],
                ["Range", product.range],
                ["Status", product.availability],
                ["Pricing", product.price],
              ].map(([label, value]) => (
                <div key={label} className="bg-surface p-4">
                  <dt className="label">{label}</dt>
                  <dd className="mt-2 text-fg">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-2">
          <SpecList title="Specifications" items={product.specifications} />
          <SpecList title="Recommended Equipment" items={product.equipment} />
        </section>
      </main>
    </>
  );
}

function SpecList({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <section>
      <h2 className="label">{title}</h2>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2 py-4 text-sm sm:grid-cols-[170px_1fr]">
            <dt className="text-muted">{item.label}</dt>
            <dd className="text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
