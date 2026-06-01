import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ProductGallery } from "@/components/product-gallery";
import { ScrollRevealHeading } from "@/components/scroll-reveal-heading";
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

  const overviewItems = [
    { label: "Category", value: product.category },
    { label: "Use", value: product.use },
    { label: "Flight", value: product.flightTime },
    { label: "Range", value: product.range },
    { label: "Status", value: product.availability },
    { label: "Pricing", value: product.price },
  ];

  return (
    <>
      <Nav />
      <main className="flex-1 bg-bg">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-36">
          <div className="max-w-4xl">
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="text-5xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-7xl"
            >
              {product.name}
            </ScrollRevealHeading>
            <p className="mt-6 max-w-2xl text-xl leading-8 tracking-[-0.03em] text-fg">
              {product.tagline}
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-stretch">
            <ProductGallery images={product.gallery} />
            <aside className="brand-font flex min-h-[320px] items-center bg-surface p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl">
                  {product.description}
                </p>
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {product.name}, Spectr
                </p>
              </div>
            </aside>
          </div>

          <details className="group mt-8 border border-border bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 text-left text-2xl font-semibold tracking-[-0.045em] text-fg marker:hidden sm:p-8 [&::-webkit-details-marker]:hidden">
              Specs
              <span className="font-mono text-sm transition-transform group-open:rotate-180" aria-hidden="true">
                ↓
              </span>
            </summary>
            <div className="grid gap-10 border-t border-border p-6 sm:p-8 lg:grid-cols-3">
              <SpecList title="Overview" items={overviewItems} />
              <SpecList title="Specifications" items={product.specifications} />
              <SpecList title="Recommended Equipment" items={product.equipment} />
            </div>
          </details>
        </section>
        <Footer />
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
          <div key={item.label} className="grid gap-2 py-4 text-left text-sm sm:grid-cols-[0.85fr_1.15fr] sm:gap-4">
            <dt className="text-muted">{item.label}</dt>
            <dd className="text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
