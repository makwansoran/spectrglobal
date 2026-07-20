import Image from "next/image";

type BigPictureItem = {
  text: string;
  emphasis?: boolean;
};

type HomeBigPictureProps = {
  title: string;
  items: BigPictureItem[];
  imageAlt: string;
  imageSrc?: string;
};

export function HomeBigPicture({ title, items, imageAlt, imageSrc }: HomeBigPictureProps) {
  return (
    <section className="brand-font bg-[#efefef] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="mx-auto grid w-full max-w-[90rem] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="bevel-card relative aspect-[4/3] w-full max-w-xl overflow-hidden bg-black lg:max-w-none">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority={false}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-white/[0.04]"
              role="img"
              aria-label={imageAlt}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30">
                Image
              </span>
            </div>
          )}
        </div>

        <div className="w-full">
          <h2 className="text-4xl font-semibold leading-none tracking-[-0.05em] text-fg sm:text-5xl lg:text-[3rem]">
            {title}
          </h2>

          <ul className="mt-10 list-none space-y-0 p-0">
            {items.map((item, index) => (
              <li
                key={item.text}
                className={`flex items-start gap-4 border-b border-[#d4d4d4] py-6 ${
                  index === 0 ? "border-t-0 pt-2" : ""
                } ${index === items.length - 1 ? "border-b-0 pb-0" : ""}`}
              >
                <span
                  aria-hidden="true"
                  className="mt-1.5 inline-block h-3 w-3 shrink-0 bg-[#f44200]"
                  style={{
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                />
                <p
                  className={`text-xl leading-snug tracking-[-0.05em] text-fg sm:text-2xl ${
                    item.emphasis ? "font-semibold" : "font-normal"
                  }`}
                >
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
