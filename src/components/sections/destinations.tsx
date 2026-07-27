import { ArrowIcon, Button } from "@/components/button";
import { Reveal } from "@/components/reveal";

const destinations = [
  {
    id: "droid",
    title: "Droid",
    description:
      "A general-purpose humanoid for warehouses and industrial floors as they are built today — no re-racking, no fixed conveyors, no dedicated cage.",
    href: "/robotics",
    cta: "Explore Droid",
  },
  {
    id: "spectr-c2",
    title: "Spectr C2",
    description:
      "A complete AI-native warehouse management system. Free for enterprises — unlimited users, locations, and volume, permanently.",
    href: "/wms",
    cta: "Explore Spectr C2",
  },
  {
    id: "company",
    title: "Company",
    description:
      "A Norwegian robotics company building for the work that cannot be done remotely — and giving away the software that makes the robots possible.",
    href: "/about",
    cta: "About Spectr",
  },
  {
    id: "news",
    title: "News",
    description:
      "Announcements, product releases, and progress from the Spectr team as we ship.",
    href: "/news",
    cta: "Read the news",
  },
] as const;

export function Destinations() {
  return (
    <section id="explore" className="section scroll-mt-20">
      <div className="container-x space-y-5">
        {destinations.map((item, index) => (
          <Reveal key={item.id} delay={index * 70}>
            <article
              id={item.id}
              className="card card-hover scroll-mt-24 px-8 py-10 sm:px-12 sm:py-12"
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="max-w-2xl">
                  <h2 className="display text-2xl text-gradient sm:text-3xl">{item.title}</h2>
                  <p className="mt-4 text-base leading-8 text-muted">{item.description}</p>
                </div>
                <Button href={item.href} size="lg" className="shrink-0 self-start lg:self-center">
                  {item.cta}
                  <ArrowIcon />
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
