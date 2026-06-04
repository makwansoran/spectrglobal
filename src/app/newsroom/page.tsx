import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Newsroom" };

const newsroomCards = [
  {
    title: "Media Coverage",
    action: "Read the Latest",
    href: "/newsroom",
    image: "/operations-hq.jpg",
    alt: "Spectr operator workspace for media coverage",
    featured: true,
  },
  {
    title: "Press Releases",
    action: "Browse Press Releases",
    href: "/newsroom",
    image: "/norway-operations.png",
    alt: "Spectr operations in Norway",
  },
  {
    title: "Blog",
    action: "Read More",
    href: "/newsroom",
    image: "/valkyrie-hero.png",
    alt: "VALKYRIE aircraft in flight",
  },
  {
    title: "From The CEO",
    action: "Read More",
    href: "/newsroom",
    image: "/hero-fjord.png",
    alt: "Norwegian landscape behind Spectr company updates",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <Nav />
      <main className="brand-font flex-1 bg-black text-white">
        <section className="px-5 pb-12 pt-36 sm:px-8 lg:pb-16 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3">
              <Image
                src="/spectr-logo.png"
                alt="Spectr"
                width={36}
                height={36}
                className="h-9 w-auto invert"
                priority
              />
              <span className="text-sm font-semibold uppercase tracking-[0.34em] text-white">Spectr</span>
            </div>
            <div className="mt-24 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <h1 className="text-6xl font-semibold leading-[0.86] tracking-[-0.075em] text-white sm:text-8xl lg:text-[10rem]">
                Newsroom
              </h1>
              <p className="max-w-xl text-base leading-8 text-white/62 sm:text-lg">
                Company updates, media coverage, founder notes, and product stories from Spectr.
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28">
          <div className="mx-auto grid max-w-7xl gap-px bg-white/12 lg:grid-cols-2">
            {newsroomCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group relative min-h-[420px] overflow-hidden bg-neutral-950 ${
                  card.featured ? "lg:min-h-[620px]" : ""
                }`}
              >
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover opacity-70 grayscale transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
                <div
                  className={`relative flex min-h-[420px] flex-col justify-between p-7 sm:p-9 lg:p-10 ${
                    card.featured ? "lg:min-h-[620px]" : ""
                  }`}
                >
                  <div className="flex justify-end">
                    <span className="font-mono text-3xl leading-none text-white/70 transition-transform duration-300 group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                  <div>
                    <h2 className="max-w-xl text-4xl font-semibold leading-none tracking-[-0.06em] text-white sm:text-6xl">
                      {card.title}
                    </h2>
                    <p className="mt-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/74">
                      {card.action}
                      <span aria-hidden="true">→</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-px bg-white/12 lg:grid-cols-4">
              {[
                "Press Releases",
                "Media Coverage",
                "From The CEO",
                "Blog",
              ].map((item) => (
                <Link key={item} href="/newsroom" className="group bg-black p-7 transition-colors hover:bg-white hover:text-black sm:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/44 transition-colors group-hover:text-black/44">
                    Newsroom
                  </p>
                  <h3 className="mt-12 text-2xl font-semibold tracking-[-0.045em] sm:text-3xl">
                    {item}
                  </h3>
                  <span className="mt-8 inline-block font-mono text-2xl leading-none transition-transform group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-6xl">
              For media and qualified operational inquiries.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-white/56 sm:text-base lg:text-right">
              Contact Spectr for company information, product context, and deployment qualification requests.
            </p>
          </div>
        </section>
        <div className="bg-bg text-fg">
          <Footer />
        </div>
      </main>
    </>
  );
}
