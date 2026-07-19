import Image from "next/image";

type BigPictureItem = {
  text: string;
  emphasis?: boolean;
};

type HomeBigPictureProps = {
  title: string;
  items: BigPictureItem[];
  imageAlt: string;
};

export function HomeBigPicture({ title, items, imageAlt }: HomeBigPictureProps) {
  return (
    <section className="brand-font relative overflow-hidden bg-[#efefef]">
      <div className="relative mx-auto flex w-full max-w-[84rem] flex-col lg:min-h-[40rem] lg:flex-row lg:items-stretch lg:justify-end">
        <div className="relative mx-auto w-full max-w-md px-5 pt-10 sm:px-8 lg:absolute lg:inset-y-0 lg:left-0 lg:mx-0 lg:max-w-none lg:w-[58%] lg:px-0 lg:pt-0">
          <div className="relative aspect-[397/477] w-full lg:absolute lg:inset-0 lg:aspect-auto">
            <Image
              src="/big-picture-flare.webp"
              alt={imageAlt}
              fill
              className="object-contain object-center lg:object-cover lg:object-left"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority={false}
            />
          </div>
        </div>

        <div className="relative z-10 w-full px-5 pb-16 pt-8 sm:px-8 lg:w-1/2 lg:max-w-[41.25rem] lg:px-0 lg:py-24 lg:pr-8">
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
                <Image
                  src="/icons/big-picture-mark.svg"
                  alt=""
                  width={38}
                  height={38}
                  className="mt-1 shrink-0"
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
