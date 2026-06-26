"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BevelButton, bevelButtonClassName } from "@/components/bevel-button";

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
                    className={`${bevelButtonClassName({
                      variant: "inverse-secondary",
                      className: "bevel-button flush relative h-24 w-full overflow-hidden sm:h-28",
                    })} ${selected ? "opacity-100" : "opacity-55 hover:opacity-100"}`}
                  >
                    <Image src={image.src} alt="" fill className="object-cover" sizes="160px" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <BevelButton
              type="button"
              size="icon"
              variant="inverse-secondary"
              onClick={goToPrevious}
              aria-label={`Show previous ${productName} image`}
            >
              &larr;
            </BevelButton>
            <BevelButton
              type="button"
              size="icon"
              variant="inverse-secondary"
              onClick={goToNext}
              aria-label={`Show next ${productName} image`}
            >
              &rarr;
            </BevelButton>
          </div>
        </>
      ) : null}
    </div>
  );
}
