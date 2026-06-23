"use client";

import Image from "next/image";

export function EarthVideo() {
  return (
    <Image
      src="/norway-operations.png"
      alt="Norwegian operations and aerial systems development"
      fill
      className="object-cover grayscale"
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
    />
  );
}
