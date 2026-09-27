import Image from "next/image";
import Link from "next/link";
import { useCases } from "@/lib/content";
import "./industrial-smart-system.css";

export function IndustrialSmartSystem() {
  return (
    <section
      id="industrial-smart-system"
      className="industrial-smart-system"
      aria-labelledby="industrial-smart-system-heading"
    >
      <div className="industrial-smart-system__inner">
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

        <ul className="industrial-smart-system__list">
          {useCases.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-label={`${item.name}. ${item.description}`}
                className="industrial-smart-system__row"
              >
                <div className="industrial-smart-system__copy">
                  <p className="industrial-smart-system__description">{item.description}</p>
                  <p className="industrial-smart-system__index">{item.index}</p>
                </div>

                <h3 className="home-display industrial-smart-system__name">{item.name}</h3>

                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  width={176}
                  height={112}
                  className="industrial-smart-system__thumb"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
