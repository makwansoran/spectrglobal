import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
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

  return (
    <>
      <Nav />
      <main className="flex-1 bg-bg">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-36">
          <div className="max-w-4xl">
            <Link href="/products" className="label hover:text-fg">
              Products
            </Link>
            <ScrollRevealHeading
              as="h1"
              revealOnMount
              className="mt-6 text-5xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-7xl"
            >
              {product.name}
            </ScrollRevealHeading>
            <p className="mt-6 max-w-2xl text-xl leading-8 tracking-[-0.03em] text-fg">
              {product.tagline}
            </p>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
              {product.description}
            </p>
          </div>

          <div className="mt-12 border border-border bg-surface">
            <ObjectVisual visual={product.visual} className="h-[420px] w-full grayscale sm:h-[520px]" />
          </div>

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.05em] text-fg sm:text-4xl">Specs</h2>
            <div className="mt-8 space-y-12">
              <SpecList
                title="Overview"
                items={[
                  { label: "Category", value: product.category },
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
          <div key={item.label} className="py-4 text-sm">
            <dt className="text-muted">{item.label}</dt>
            <dd className="mt-2 text-fg">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
