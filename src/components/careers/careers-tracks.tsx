"use client";

import { useState } from "react";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { hiringTracks, type HiringTrackId } from "@/lib/careers";

export function CareersTracks() {
  const [activeId, setActiveId] = useState<HiringTrackId>(hiringTracks[0].id);
  const active = hiringTracks.find((track) => track.id === activeId) ?? hiringTracks[0];

  return (
    <section className="border-t border-[#D2D2CE] py-16 sm:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-6">
        <div className="flex flex-wrap gap-1 border-b border-[#D2D2CE]">
          {hiringTracks.map((track) => {
            const selected = track.id === active.id;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => setActiveId(track.id)}
                className={`relative px-4 py-3 text-[13px] tracking-[-0.01em] transition-colors ${
                  selected ? "font-medium text-[#0A0A0A]" : "text-[#6B6B72] hover:text-[#0A0A0A]"
                }`}
              >
                {selected ? (
                  <span aria-hidden="true" className="absolute inset-x-4 top-0 h-px bg-[#0A0A0A]" />
                ) : null}
                {track.name}
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h2 className="m-0 text-[clamp(30px,4vw,46px)] font-semibold leading-[1.12] tracking-[-0.015em] text-[#0A0A0A]">
              {active.headline}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#6B6B72]">{active.body}</p>
          </div>
          <div className="lg:justify-self-end">
            <p className="text-sm text-[#6B6B72]">{active.name}</p>
            <div className="mt-4">
              <CareersApplyButton href={`/careers/apply?area=${active.id}`}>Apply Now →</CareersApplyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
