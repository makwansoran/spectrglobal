import Image from "next/image";
import Link from "next/link";
import "./waitlist-section.css";

type HomeProductFieldProps = {
  id: string;
  headingId: string;
  title: string;
  lede: string;
  image: string;
  imageAlt: string;
  ctaHref: string;
  ctaLabel: string;
};

export function HomeProductField({
  id,
  headingId,
  title,
  lede,
  image,
  imageAlt,
  ctaHref,
  ctaLabel,
}: HomeProductFieldProps) {
  return (
    <section
      id={id}
      className="bg-white px-4 pb-16 sm:px-6 sm:pb-20 lg:pb-[80px]"
      aria-labelledby={headingId}
    >
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="spectros-waitlist__panel spectros-waitlist__panel--product min-w-0">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="spectros-waitlist__image"
            sizes="(max-width: 1024px) 100vw, 44rem"
            quality={90}
          />
        </div>

        <div className="spectros-waitlist__product-copy min-w-0">
          <h2 id={headingId} className="home-display spectros-waitlist__title--product">
            {title}
          </h2>
          <p className="spectros-waitlist__lede spectros-waitlist__lede--product">{lede}</p>
          <div className="spectros-waitlist__cta">
            <Link href={ctaHref} className="spectros-waitlist__join">
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
