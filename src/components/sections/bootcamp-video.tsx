"use client";

import { useRef, useState } from "react";

type BootcampVideoProps = {
  src: string;
  title: string;
};

export function BootcampVideo({ src, title }: BootcampVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function playCourse() {
    const video = videoRef.current;
    if (!video) return;
    void video.play();
  }

  return (
    <div className="bootcamp-video">
      <video
        ref={videoRef}
        className="bootcamp-video__media"
        controls={started}
        playsInline
        preload="none"
        title={title}
        onPlay={() => setStarted(true)}
      >
        <source src={src} type="video/mp4" />
      </video>

      {!started ? (
        <button type="button" className="bootcamp-video__play" onClick={playCourse} aria-label={`Play ${title}`}>
          <span className="bootcamp-video__play-icon" aria-hidden="true" />
          <span className="bootcamp-video__play-label">Play course</span>
        </button>
      ) : null}
    </div>
  );
}
