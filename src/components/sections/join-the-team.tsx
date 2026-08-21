import { JoinTeamImage } from "@/components/careers/join-team-image";

export function JoinTheTeam() {
  return (
    <section className="bg-[#F9F9F9] px-4 pb-[140px] pt-4 sm:px-6" aria-labelledby="join-the-team-heading">
      <JoinTeamImage href="/careers" minHeightClassName="min-h-[26rem] sm:min-h-[38rem]">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">Careers</p>
        <h2
          id="join-the-team-heading"
          className="mt-3 max-w-2xl text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white transition-opacity group-hover:opacity-90"
        >
          Join the team, we are growing fast.
        </h2>
        <p className="mt-5 text-sm font-medium text-white/85">
          Open careers
          <span aria-hidden="true"> →</span>
        </p>
      </JoinTeamImage>
    </section>
  );
}
