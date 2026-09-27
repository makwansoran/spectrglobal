import Image from "next/image";
import "./industrial-smart-system.css";

export function IndustrialSmartSystem() {
  return (
    <section
      id="industrial-smart-system"
      className="industrial-smart-system"
      aria-labelledby="industrial-smart-system-heading"
    >
      <div className="industrial-smart-system__grid">
        <h2 id="industrial-smart-system-heading" className="home-display industrial-smart-system__title">
          Spectr Industrial Smart System
        </h2>
        <div className="industrial-smart-system__media">
          <Image
            src="/images/products/spectr-os-materials.jpg"
            alt="Materials handling line with conveyors and sorting equipment"
            fill
            sizes="(max-width: 1024px) 100vw, 44rem"
            className="industrial-smart-system__image"
          />
        </div>
      </div>
    </section>
  );
}
