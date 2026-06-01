"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ProductGalleryImage = {
  src: string;
  alt: string;
};

export function ProductGallery({ images }: { images: ProductGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [images.length]);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  return (
    <div className="bg-surface">
      <div className="relative h-[420px] overflow-hidden border border-border bg-white sm:h-[520px]">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show VALKYRIE image ${index + 1}`}
                aria-current={selected ? "true" : undefined}
                className={`relative h-20 overflow-hidden border bg-white transition-opacity ${
                  selected ? "border-fg opacity-100" : "border-border opacity-55 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Show previous VALKYRIE image"
            className="grid h-11 w-11 place-items-center border border-border text-lg text-fg hover:border-fg"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={goToNext}
            aria-label="Show next VALKYRIE image"
            className="grid h-11 w-11 place-items-center border border-border text-lg text-fg hover:border-fg"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
