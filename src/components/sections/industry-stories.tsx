import Image from "next/image";
import Link from "next/link";
import { platforms } from "@/lib/platforms";

export function IndustryStories() {
  const stories = platforms[0].industries.slice(0, 8);

  return (
    <section className="py-8 sm:py-12">
      <div className="container-x">
        <div className="story-rail">
          {stories.map((story) => (
            <Link key={story.name} href="/platforms/spectr-os" className="story-card group">
              <article className="relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={story.image}
                    alt={story.imageAlt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 86vw, 24rem"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/70">
                      {story.name}
                    </p>
                    <p className="mt-2 line-clamp-4 text-lg leading-6 tracking-[-0.02em]">{story.description}</p>
                    <p className="mt-4 text-sm font-medium">Learn more</p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
