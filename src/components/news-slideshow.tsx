import Link from "next/link";
import { newsStories } from "@/lib/news-stories";

export function NewsSlideshow() {
  const [leadStory, secondStory, thirdStory] = newsStories;
  const featureStories = [
    { label: "PT — 01 / 02", title: "Rebuild field autonomy" },
    { label: "PT — 02 / 02", title: "Rebuild mission systems" },
  ];

  return (
    <section className="border-y border-border py-12 sm:py-16">
      <div className="flex items-start justify-between gap-8 border-b border-border pb-8">
        <h2 className="text-4xl font-semibold leading-none tracking-[-0.06em] text-fg sm:text-6xl">
          News &amp; Insights
        </h2>
        <Link
          href="/newsroom"
          className="mt-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-fg underline-offset-8 hover:underline"
        >
          All articles
        </Link>
      </div>

      <div className="grid border-b border-border lg:grid-cols-[1.1fr_0.9fr]">
        <article className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:pr-10">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">5/5/2026</p>
          <h3 className="mt-8 max-w-4xl text-3xl font-semibold leading-[1.02] tracking-[-0.055em] text-fg sm:text-5xl">
            {leadStory.title}
          </h3>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            {leadStory.summary}
          </p>
          <Link
            href="/newsroom"
            className="mt-10 inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg underline-offset-8 hover:underline"
          >
            Read more
          </Link>
        </article>

        <div className="lg:pl-10">
          {[secondStory, thirdStory].map((story, index) => (
            <article key={story.title} className="border-b border-border py-8 last:border-b-0">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {index === 0 ? "12/09/2025" : "10/21/2025"}
              </p>
              <h3 className="mt-6 text-2xl font-semibold leading-[1.05] tracking-[-0.05em] text-fg sm:text-3xl">
                {story.title}
              </h3>
              <Link
                href="/newsroom"
                className="mt-8 inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg underline-offset-8 hover:underline"
              >
                Read more
              </Link>
            </article>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        {featureStories.map((story, index) => (
          <article
            key={story.label}
            className={`py-8 ${index === 0 ? "border-b border-border lg:border-b-0 lg:border-r lg:pr-10" : "lg:pl-10"}`}
          >
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">{story.label}</p>
            <h3 className="mt-6 text-3xl font-semibold leading-none tracking-[-0.055em] text-fg sm:text-5xl">
              {story.title}
            </h3>
            <Link
              href="/newsroom"
              className="mt-8 inline-flex w-fit items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-fg underline-offset-8 hover:underline"
            >
              Read more
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
