import type { Metadata } from "next";
import { ArrowIcon, Button } from "@/components/button";
import { openRoles } from "@/lib/careers";
import { buildPageMetadata } from "@/lib/metadata";

const listingCount = openRoles.length;
const listingWord = listingCount === 1 ? "listing" : "listings";
const description = `We have ${listingCount} ${listingWord} open. Create an account or log in to apply.`;

export const metadata: Metadata = buildPageMetadata({
  title: "Careers",
  description,
  path: "/careers",
});

export default function CareersPage() {
  return (
    <main id="main-content" className="flex-1 bg-white">
      <section className="px-6 py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1100px]">
          <h1 className="m-0 text-[clamp(42px,6vw,58px)] font-semibold tracking-[-0.04em] text-[#0A0A0A]">
            Careers
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#6B6B72]">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/careers/login">
              Log in
              <ArrowIcon />
            </Button>
            <Button href="/careers/signup" variant="secondary">
              Create an account
            </Button>
          </div>
          <p className="mt-6 text-sm text-[#6B6B72]">After you sign in you land on the careers dashboard, then open a position to apply.</p>
        </div>
      </section>
    </main>
  );
}
