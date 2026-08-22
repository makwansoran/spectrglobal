"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PREVIEW =
  "One OS across logistics, manufacturing, energy, mining, and every physical operation that needs a truthful model.";

export function IndustriesExpandButton() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (open) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [open]);

  return (
    <div
      className={`industries-expand ${open ? "industries-expand--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href="/platforms/spectr-os"
        className="industries-expand__shell"
        aria-expanded={open}
        aria-label="Industries"
      >
        <span className="industries-expand__label">Industries</span>

        <div className="industries-expand__body" aria-hidden={!open}>
          <div className="industries-expand__preview">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="metadata"
            >
              <source src="/videos/industries-preview.mp4" type="video/mp4" />
            </video>
          </div>
          <p className="industries-expand__text">{PREVIEW}</p>
        </div>
      </Link>
    </div>
  );
}
