"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ProductGalleryImage = {
  src: string;
  alt: string;
};

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductGalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (paused || images.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [images.length, paused]);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="relative h-[420px] overflow-hidden border border-white/10 bg-black sm:h-[520px]">
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      {images.length > 1 ? (
        <>
          <div className="mt-3 border border-white/10 bg-white/[0.04] p-2">
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => {
                const selected = index === activeIndex;

                return (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${productName} image ${index + 1}`}
                    aria-current={selected ? "true" : undefined}
                    className={`relative h-24 overflow-hidden border bg-black transition-opacity sm:h-28 ${
                      selected ? "border-white opacity-100" : "border-white/15 opacity-55 hover:opacity-100"
                    }`}
                  >
                    <Image src={image.src} alt="" fill className="object-cover" sizes="160px" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label={`Show previous ${productName} image`}
              className="grid h-11 w-11 place-items-center border border-white/15 text-lg text-white hover:border-white"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label={`Show next ${productName} image`}
              className="grid h-11 w-11 place-items-center border border-white/15 text-lg text-white hover:border-white"
            >
              &rarr;
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
