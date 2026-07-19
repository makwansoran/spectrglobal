import Image from "next/image";

export type CapabilityCard = {
  key: string;
  title: string;
  text: string;
  secondaryTitle?: string;
  secondaryText?: string;
  imageSrc?: string;
};

type HomeCapabilityGridProps = {
  rows: CapabilityCard[][];
};

export function HomeCapabilityGrid({ rows }: HomeCapabilityGridProps) {
  return (
    <section className="brand-font bg-[#efefef] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[90rem] rounded-lg bg-black px-6 py-16 text-white sm:px-10 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-16 lg:gap-24">
          {rows.map((row, rowIndex) => (
            <ul
              key={rowIndex}
              className="grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-3"
            >
              {row.map((item, itemIndex) => {
                const lastInRow = itemIndex === row.length - 1;
                return (
                  <li
                    key={item.key}
                    className={`flex flex-col items-center border-white/10 px-0 py-10 text-center md:px-6 md:py-0 ${
                      lastInRow
                        ? "border-b-0 md:border-r-0"
                        : "border-b md:border-b-0 md:border-r"
                    }`}
                  >
                    <div className="mb-9 flex h-[90px] w-full items-start justify-center overflow-hidden">
                      {item.imageSrc ? (
                        <Image
                          src={item.imageSrc}
                          alt=""
                          width={153}
                          height={90}
                          className="h-auto max-h-[90px] w-auto object-contain"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-full w-full max-w-[153px] items-center justify-center border border-dashed border-white/20 bg-white/[0.03]"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                            Image
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl font-normal tracking-[-0.06em] text-[#f8f8f8] sm:text-[1.5rem]">
                      {item.title}
                    </h3>
                    <p className="mt-3 mb-6 max-w-sm text-lg leading-[1.35] tracking-[-0.05em] text-[#f8f8f8]/80">
                      {item.text}
                    </p>

                    {item.secondaryTitle && item.secondaryText ? (
                      <div className="mt-auto w-full">
                        <p className="text-base tracking-[-0.03em] text-white/55">
                          {item.secondaryTitle}
                        </p>
                        <p className="mt-1 text-base tracking-[-0.03em] text-[#5e5e5e]">
                          {item.secondaryText}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
