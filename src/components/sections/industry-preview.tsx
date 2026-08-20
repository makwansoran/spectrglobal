export function IndustryPreview() {
  return (
    <section className="industry-preview" aria-labelledby="industry-preview-title">
      <div className="industry-preview__media">
        <video
          className="industry-preview__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/industries-preview.mp4" type="video/mp4" />
        </video>
        <div className="industry-preview__scrim" aria-hidden="true" />
        <h2 id="industry-preview-title" className="industry-preview__title">
          AI system for Industry
        </h2>
      </div>
    </section>
  );
}
