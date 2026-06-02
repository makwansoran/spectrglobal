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
    title: "Payload delivery",
    text: "Configured around mission payload requirements and predefined field objectives.",
  },
  {
    title: "Terminal profiles",
    text: "Built for terminal mission execution with operator-controlled deployment workflows.",
  },
  {
    title: "Field support",
    text: "Procurement, setup guidance, and control-link requirements are specified around each mission.",
  },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getObject(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <Nav variant="light" />
      <main className="brand-font min-h-screen flex-1 bg-black text-white">
        <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
          <Image
            src="/valkyrie-hero.jpg"
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
                The platform supports aerial operations by aligning payload requirements, operator workflow, and field support around each mission.
              </p>
            </div>
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
