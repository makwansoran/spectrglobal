import { BevelButton } from "@/components/bevel-button";
import { Link } from "@/i18n/navigation";
import type { ApplicationSlug } from "@/lib/applications";

type ApplicationCard = {
  slug: ApplicationSlug;
  title: string;
  text: string;
};

type HomeApplicationsProps = {
  title: string;
  learnMore: string;
  items: ApplicationCard[];
};

export function HomeApplications({ title, learnMore, items }: HomeApplicationsProps) {
  return (
    <section className="brand-font bg-black px-5 py-24 text-white sm:px-8 lg:px-16 lg:py-32">
      <div className="mx-auto w-full max-w-[88rem]">
        <h2 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.slug} className="flex flex-col border-t border-white/15 pt-8">
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
              <p className="mt-4 flex-1 text-base leading-7 text-white/65">{item.text}</p>
              <BevelButton
                href={`/applications/${item.slug}`}
                variant="inverse-secondary"
                className="mt-8 w-fit tracking-[0.16em]"
              >
                {learnMore}
                <span aria-hidden="true">→</span>
              </BevelButton>
            </article>
          ))}
        </div>
        <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
          <Link href="/autonomous-engine" className="hover:text-white/70">
            Autonomous Engine
          </Link>
          <span className="mx-3">·</span>
          <Link href="/centurion" className="hover:text-white/70">
            Centurion
          </Link>
        </p>
      </div>
    </section>
  );
}
