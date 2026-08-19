import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/sections/hero";
import { platforms } from "@/lib/platforms";

const featuredSolutions = platforms[0].features.slice(0, 3);

export default function HomePage() {
  return (
    <>
      <main id="main-content" className="flex-1">
        <Hero />

        <div className="feature-story-list mx-auto max-w-7xl px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
          <div className="feature-story-list__intro">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Spectr OS / Core capabilities
            </p>
            <h2 className="brand-font mt-4 max-w-3xl text-[clamp(2.4rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.06em] text-fg">
              Intelligence that moves with the operation.
            </h2>
          </div>

          {featuredSolutions.map((feature, index) => (
            <section
              key={feature.title}
              className={`feature-story group relative overflow-hidden ${index % 2 === 1 ? "feature-story--reverse" : ""}`}
            >
              <div className="feature-story__content">
                <div className="feature-story__copy">
                  <div className="flex items-center gap-4">
                    <span className="feature-story__index">0{index + 1}</span>
                    <span className="feature-story__rule" aria-hidden="true" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Spectr OS
                    </span>
                  </div>
                  <h2 className="brand-font mt-5 text-[clamp(2.5rem,5vw,5rem)] leading-[0.94] tracking-[-0.06em] text-fg">
                    {feature.title}
                  </h2>
                  <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg">
                    {feature.description}
                  </p>
                  <Link href="/platforms/spectr-os" className="feature-story__link">
                    Explore Spectr OS <span aria-hidden="true">↗</span>
                  </Link>
                </div>

                <div className="feature-story__media">
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
