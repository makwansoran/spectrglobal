import { JoinTeamImage } from "@/components/careers/join-team-image";

export function JoinTheTeam() {
  return (
    <section className="bg-white px-4 pb-[140px] pt-[80px] sm:px-6" aria-labelledby="join-the-team-heading">
      <div className="mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,36rem)] lg:gap-16">
        <h2
          id="join-the-team-heading"
          className="home-display max-w-xl"
        >
          Join the team.
          <br />
          We are growing fast.
        </h2>

        <JoinTeamImage
          href="/careers"
          minHeightClassName="aspect-[4/3] min-h-[14rem]"
          sizes="(max-width: 1024px) 100vw, 36rem"
        >
          <span className="inline-flex w-fit items-center justify-center border border-white bg-white px-[22px] py-[11px] text-sm font-semibold text-[#0A0A0A] transition-colors duration-150 group-hover:bg-white/90">
            Open careers →
          </span>
        </JoinTeamImage>
      </div>
    </section>
  );
}
