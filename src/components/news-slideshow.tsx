"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { newsStories } from "@/lib/news-stories";

export function NewsSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStory = newsStories[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % newsStories.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + newsStories.length) % newsStories.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % newsStories.length);
  };

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
      <article className="min-h-[420px] bg-fg p-6 text-bg sm:p-8 lg:p-10">
        <div className="flex h-full flex-col justify-between gap-12">
          <div>
            <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-[0.18em] text-white/45">
              <span>{String(activeIndex + 1).padStart(2, "0")} / {String(newsStories.length).padStart(2, "0")}</span>
              <span>{activeStory.meta}</span>
            </div>
            <h3 className="mt-10 max-w-4xl text-3xl font-semibold leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
              {activeStory.title}
            </h3>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-white/62 sm:text-base">
              {activeStory.summary}
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/newsroom"
              className="inline-flex w-fit items-center gap-3 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-black hover:opacity-80"
            >
              Visit Newsroom
              <span aria-hidden="true">→</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Show previous news item"
                className="grid h-11 w-11 place-items-center bg-white/10 text-lg text-white/80 hover:bg-white hover:text-black"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Show next news item"
                className="grid h-11 w-11 place-items-center bg-white/10 text-lg text-white/80 hover:bg-white hover:text-black"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-2">
        {newsStories.map((story, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={story.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={selected ? "true" : undefined}
              className={`group p-5 text-left transition-colors hover:bg-surface ${
                selected ? "bg-surface" : ""
              }`}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-4 block text-2xl font-semibold leading-tight tracking-[-0.05em] text-fg transition-transform group-hover:translate-x-1">
                {story.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
