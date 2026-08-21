import Image from "next/image";
import Link from "next/link";
import { useCases, useCasesSection } from "@/lib/content";

export function UseCases() {
  return (
    <section id="use-cases" className="scroll-mt-24 bg-white px-4 pb-20 pt-16 sm:px-6 sm:pb-[140px] sm:pt-[128px]">
      <div className="mx-auto w-full max-w-[1400px]">
        <h2 className="m-0 font-normal text-[clamp(30px,4.4vw,46px)] leading-none tracking-[-0.02em] text-[#1E1F2B]">
          {useCasesSection.title}
        </h2>

        <ul className="m-0 mt-8 list-none p-0">
          {useCases.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-label={`${item.name}. ${item.description}`}
                className="group grid items-start gap-3 py-4 no-underline sm:grid-cols-[minmax(11rem,0.4fr)_minmax(0,1fr)] sm:gap-8 sm:py-3 sm:pb-14"
              >
                <div className="max-w-[16.5rem]">
                  <p className="m-0 text-[17px] leading-[1.4] text-[#1E1F2B]">{item.description}</p>
                  <p className="mt-3 m-0 text-[15px] leading-snug text-[#AAAAAA]">{item.index}</p>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                    <h3 className="m-0 min-w-0 overflow-hidden text-[clamp(2rem,10vw,6.25rem)] font-normal leading-[0.86] tracking-[-0.055em] text-[#1E1F2B] sm:whitespace-nowrap">
                      {item.name}
                    </h3>
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      width={176}
                      height={112}
                      className="h-[4.5rem] w-[7rem] shrink-0 object-cover sm:h-[5.5rem] sm:w-[9rem]"
                    />
                  </div>
                  <span className="mt-2 hidden shrink-0 text-[15px] leading-snug text-[#AAAAAA] sm:inline">
                    {item.index}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
