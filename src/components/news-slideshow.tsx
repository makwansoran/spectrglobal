"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { latestNewsStories } from "@/lib/news-stories";

export function NewsSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStory = latestNewsStories[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % latestNewsStories.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + latestNewsStories.length) % latestNewsStories.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % latestNewsStories.length);
  };

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_400px]">
      <article className="h-[420px] overflow-hidden bg-fg p-6 text-bg sm:p-8 lg:p-10">
        <div className="flex h-full flex-col justify-between gap-10">
          <div>
            <h3 className="max-w-4xl overflow-hidden text-2xl font-semibold leading-[1.05] tracking-[-0.05em] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:text-4xl lg:text-5xl">
              {activeStory.title}
            </h3>
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

      <div className="grid h-[420px] grid-rows-3 gap-2">
        {latestNewsStories.map((story, index) => {
          const selected = index === activeIndex;

          return (
            <button
              key={story.title}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-current={selected ? "true" : undefined}
              className={`group overflow-hidden p-5 text-left transition-colors hover:bg-surface ${
                selected ? "bg-surface" : ""
              }`}
            >
              <span className="block overflow-hidden text-xl font-semibold leading-tight tracking-[-0.045em] text-fg transition-transform [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] group-hover:translate-x-1">
                {story.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
