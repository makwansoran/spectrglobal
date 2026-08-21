import { JoinTeamImage } from "@/components/careers/join-team-image";

export function JoinTheTeam() {
  return (
    <section className="bg-[#F9F9F9] px-4 pb-[140px] pt-4 sm:px-6" aria-labelledby="join-the-team-heading">
      <JoinTeamImage href="/careers" minHeightClassName="min-h-[26rem] sm:min-h-[38rem]">
        <h2
          id="join-the-team-heading"
          className="max-w-2xl text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white"
        >
          Join the team, we are growing fast.
        </h2>
        <span className="mt-6 inline-flex w-fit items-center justify-center border border-white bg-white px-[22px] py-[11px] text-sm font-semibold text-[#0A0A0A] transition-colors duration-150 group-hover:bg-white/90">
          Open careers →
        </span>
      </JoinTeamImage>
    </section>
  );
}
