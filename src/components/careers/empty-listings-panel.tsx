import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { JoinTeamImage } from "@/components/careers/join-team-image";
import { emptyListingsCopy, hiringAreas } from "@/lib/careers";

export function EmptyListingsPanel() {
  return (
    <JoinTeamImage minHeightClassName="min-h-[34rem] sm:min-h-[42rem]">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium text-white/80">{emptyListingsCopy.join}</p>
          <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
            {emptyListingsCopy.headline}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80">{emptyListingsCopy.body}</p>
          <CareersApplyButton href="/careers/apply" variant="on-dark" className="mt-8">
            Send an application
          </CareersApplyButton>
        </div>
        <div className="lg:border-l lg:border-white/20 lg:pl-12">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/70">
            Areas we hire into
          </h3>
          <ul className="mt-5 divide-y divide-white/15 border-t border-white/15">
            {hiringAreas.map((area) => (
              <li key={area.id} className="py-3.5 text-sm leading-6 text-white/90">
                <span className="font-medium text-white">{area.name}</span>
                {" — "}
                {area.summary}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </JoinTeamImage>
  );
}
