import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Newsroom" };

const stories = [
  {
    category: "Company",
    title: "Spectr expands field-ready aerial systems roadmap",
    summary:
      "A look at the development priorities behind ATTACK, RECON, and JAMMER as mission requirements evolve.",
    date: "May 2026",
  },
  {
    category: "Operations",
    title: "Designing UAV platforms around operator workflow",
    summary:
      "How range, payload flexibility, launch time, and recovery planning shape Spectr product decisions.",
    date: "April 2026",
  },
  {
    category: "Product",
    title: "Inside the next phase of counter-UAS support",
    summary:
      "Updates on controlled-environment jammer capabilities, compliance planning, and qualified deployment support.",
    date: "March 2026",
  },
];

export default function NewsroomPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="border-b border-border px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-7xl">
            <p className="label">Resources</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              Newsroom.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted sm:text-lg">
              Announcements, product notes, and field perspectives from the Spectr team.
            </p>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="divide-y divide-border border-y border-border">
              {stories.map((story) => (
                <article key={story.title} className="grid gap-6 py-8 lg:grid-cols-[220px_1fr] lg:gap-12">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">{story.category}</p>
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">{story.date}</p>
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold tracking-[-0.05em] text-fg">{story.title}</h2>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">{story.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
