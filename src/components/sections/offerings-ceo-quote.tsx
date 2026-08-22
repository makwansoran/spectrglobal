import Image from "next/image";
import Link from "next/link";
import { offeringsCeoQuote } from "@/lib/content";
import { blogPosts, researchEssays, type HubPost } from "@/lib/hubs";

function InsightCards({
  heading,
  posts,
  indexLabel,
}: {
  heading: string;
  posts: HubPost[];
  indexLabel: string;
}) {
  return (
    <div className="mt-24">
      <h2 className="m-0 overflow-hidden text-[clamp(2rem,10vw,6.25rem)] font-normal leading-[0.86] tracking-[-0.055em] text-[#1E1F2B] sm:whitespace-nowrap">
        {heading}
      </h2>
      <ul className="mt-8 m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
        {posts.slice(0, 3).map((post, index) => (
          <li key={post.slug}>
            <Link
              href={post.href}
              className="bevel-panel-tr-bl group flex h-full flex-col overflow-hidden bg-[#F4F4F2] text-inherit no-underline transition-opacity duration-200 hover:opacity-90"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#E8E8E4]">
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#AAAAAA]">
                  {indexLabel} {String(index + 1).padStart(2, "0")} · {post.date}
                </p>
                <h3 className="mt-3 m-0 text-[1.15rem] font-medium leading-snug tracking-[-0.03em] text-[#1E1F2B]">
                  {post.title}
                </h3>
                <p className="mt-2 mb-0 flex-1 text-[14px] leading-6 text-[#6A6A72]">{post.dek}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function OfferingsCeoQuote() {
  return (
    <section className="border-t border-[#D2D2CE] bg-white px-6 py-[128px]" aria-label="From the CEO">
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="m-0 text-[15px] leading-snug tracking-[-0.01em] text-[#AAAAAA]">From the CEO</p>

        <blockquote className="mt-10 m-0 max-w-[58rem]">
          <p className="m-0 text-[clamp(28px,3.8vw,48px)] font-normal leading-[1.18] tracking-[-0.03em] text-[#1E1F2B]">
            {offeringsCeoQuote.quote}
          </p>
          <footer className="mt-12">
            <p className="m-0 text-[17px] font-medium leading-snug text-[#1E1F2B]">
              {offeringsCeoQuote.attribution}
            </p>
            <p className="mt-1 m-0 text-[15px] leading-snug text-[#AAAAAA]">{offeringsCeoQuote.role}</p>
          </footer>
        </blockquote>

        <InsightCards heading="Blog" posts={blogPosts} indexLabel="Post" />
        <InsightCards heading="Research" posts={researchEssays} indexLabel="Essay" />
      </div>
    </section>
  );
}
