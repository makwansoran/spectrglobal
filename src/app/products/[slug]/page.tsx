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
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.6fr)] lg:items-stretch">
            <ProductGallery images={product.gallery} />
            <aside className="brand-font flex min-h-[320px] items-center justify-center bg-bg p-7 text-center sm:p-10 lg:p-12">
              <div className="mx-auto max-w-4xl">
                <h2 className="mb-8 text-5xl font-semibold leading-[0.92] tracking-[-0.075em] text-fg sm:text-7xl">
                  {product.name}
                </h2>
                <ScrollRevealHeading
                  as="h2"
                  className="text-2xl font-medium leading-[1.25] tracking-[-0.03em] text-fg sm:text-3xl lg:text-4xl"
                >
                  {product.description}
                </ScrollRevealHeading>
              </div>
            </aside>
          </div>

          <details className="group mt-8">
            <summary className="inline-flex cursor-pointer list-none items-center gap-4 border border-border bg-surface px-5 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-fg marker:hidden hover:border-fg [&::-webkit-details-marker]:hidden">
              Specs
              <span className="font-mono text-xs transition-transform group-open:rotate-180" aria-hidden="true">
                ↓
              </span>
            </summary>
            <div className="mt-4 grid gap-10 border border-border bg-surface p-6 sm:p-8 lg:grid-cols-3">
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
