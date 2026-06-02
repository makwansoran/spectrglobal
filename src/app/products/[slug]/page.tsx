import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
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

const valkyrieCapabilities = [
  {
    title: "Cost-effective",
    text: "Cheap to field and sustain relative to comparable mission platforms, without sacrificing operational readiness.",
  },
  {
    title: "Highly effective",
    text: "Built for terminal mission execution, payload delivery, and operator-controlled deployment workflows.",
  },
  {
    title: "Long range",
    text: "Configured for long-range operation so teams can cover distance without redesigning the platform per mission.",
  },
];

const valkyriePayloads = [
  {
    title: "Spectr mission payload",
    text: "In-house payload option built around qualified mission requirements and operator-controlled deployment.",
  },
  {
    title: "Spectr observation payload",
    text: "In-house sensor payload for field awareness, target confirmation, and operational context before deployment.",
  },
  {
    title: "Spectr training payload",
    text: "In-house inert payload for operator training, handling workflows, and field readiness validation.",
  },
];

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
      <Nav variant="light" />
      <main className="brand-font min-h-screen flex-1 bg-black text-white">
        <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <Image
            src="/valkyrie-hero.png"
            alt="VALKYRIE UAV over mountain terrain"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />
          <div className="relative mx-auto flex min-h-[calc(100vh-16rem)] max-w-7xl items-center">
            <div>
              <ScrollRevealHeading
                as="h1"
                revealOnMount
                className="max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] sm:text-8xl lg:text-[9.5rem]"
              >
                {product.name}
              </ScrollRevealHeading>
              <p className="mt-8 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                {product.tagline}
              </p>
              <Link
                href="/contact"
                className="mt-10 inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
              >
                Request Access
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
              Built for terminal mission profiles.
            </h2>
            <div className="space-y-7 text-base leading-8 text-white/62 sm:text-lg">
              <p>{product.description}</p>
              <p>
                VALKYRIE is cheap to field, highly effective in mission execution, and built for long-range operation — aligning payload requirements, operator workflow, and field support around each deployment.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 grid max-w-7xl gap-4 lg:grid-cols-3">
            {valkyriePayloads.map((payload) => (
              <article key={payload.title} className="border border-white/10 bg-white/[0.04] p-7 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-white">{payload.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/56">{payload.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
            {valkyrieCapabilities.map((capability) => (
              <article key={capability.title} className="border border-white/10 bg-white/[0.04] p-7 sm:p-8">
                <h3 className="text-3xl font-semibold tracking-[-0.055em] text-white">{capability.title}</h3>
                <p className="mt-5 text-sm leading-7 text-white/56">{capability.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">Specs</p>
            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
              VALKYRIE Specification Sheet
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Full platform overview, dimensions, operating profile, and recommended equipment for VALKYRIE.
            </p>
            <div className="mt-10 space-y-10">
              <SpecList title="Overview" items={overviewItems} />
              <SpecList title="Specifications" items={product.specifications} />
              <SpecList title="Recommended Equipment" items={product.equipment} />
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 border border-white/10 bg-white p-7 text-black sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
              Request access to {product.name}.
            </h2>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-3 bg-black px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:opacity-80"
            >
              Contact Spectr
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
        <div className="bg-bg text-fg">
          <Footer />
        </div>
      </main>
    </>
  );
}

function SpecList({ title, items }: { title: string; items: { label: string; value: string }[] }) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white/48">{title}</h3>
      <dl className="mt-4 divide-y divide-white/10 border-y border-white/10">
        {items.map((item) => (
          <div key={item.label} className="grid gap-2 py-4 text-left text-sm sm:grid-cols-[0.85fr_1.15fr] sm:gap-4">
            <dt className="text-white/56">{item.label}</dt>
            <dd className="text-white">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
