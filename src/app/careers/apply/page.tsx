import type { Metadata } from "next";
import { CareerApplyForm } from "@/components/careers/career-apply-form";
import { emptyListingsCopy } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Apply",
  description: emptyListingsCopy.body,
  path: "/careers/apply",
});

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area = "" } = await searchParams;

  return (
    <main id="main-content" className="flex-1">
      <section className="px-6 py-14 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h1 className="m-0 text-[clamp(42px,6vw,58px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
              Apply
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[#6B6B72]">{emptyListingsCopy.body}</p>
          </div>
          <CareerApplyForm defaultArea={area} />
        </div>
      </section>
    </main>
  );
}
