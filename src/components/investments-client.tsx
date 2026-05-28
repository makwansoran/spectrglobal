"use client";

import Link from "next/link";
import { useState } from "react";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { type DroneCategory, type DroneUse, objects, sectors, stages } from "@/lib/objects";

export function InvestmentsClient() {
  const [sector, setSector] = useState<DroneCategory | "All">("All");
  const [stage, setStage] = useState<DroneUse | "All">("All");

  const filtered = objects.filter(
    (o) =>
      (sector === "All" || o.category === sector) &&
      (stage === "All" || o.use === stage),
  );

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">

        <div className="px-6 py-16 sm:px-10">
          <h1 className="display text-5xl sm:text-7xl">Drones</h1>
          <p className="mt-4 max-w-xl text-muted">
            Shop camera, FPV, survey, and industrial drones for creative work,
            inspections, mapping, and commercial teams.
          </p>
        </div>

        {objects.length > 0 && (
          <div className="sticky top-[72px] z-40 flex flex-wrap gap-3 bg-bg/95 px-6 pb-4 backdrop-blur sm:px-10">
            <span className="label self-center">Category</span>
            <FilterBtn active={sector === "All"} onClick={() => setSector("All")}>All</FilterBtn>
            {sectors.map((s) => (
              <FilterBtn key={s} active={sector === s} onClick={() => setSector(s as DroneCategory)}>{s}</FilterBtn>
            ))}
            <div className="mx-2 hidden w-px bg-border sm:block" />
            <span className="label self-center">Use</span>
            <FilterBtn active={stage === "All"} onClick={() => setStage("All")}>All</FilterBtn>
            {stages.map((s) => (
              <FilterBtn key={s} active={stage === s} onClick={() => setStage(s as DroneUse)}>{s}</FilterBtn>
            ))}
          </div>
        )}

        <div className="grid gap-8 px-6 pb-20 sm:grid-cols-2 sm:px-10 lg:grid-cols-3">
          {filtered.map((obj) => (
            <Link
              key={obj.slug}
              href={`/investments/${obj.slug}`}
              className="group flex flex-col hover:opacity-80"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-surface">
                <ObjectVisual visual={obj.visual} className="h-full w-full" />
              </div>
              <div className="flex flex-1 flex-col pt-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted">{obj.category}</span>
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs text-muted">{obj.use}</span>
                  <span className="ml-auto text-xs text-muted">{obj.year}</span>
                </div>
                <h2 className="display mt-2 text-3xl">{obj.name}</h2>
                <p className="mt-1 text-sm text-muted">{obj.tagline}</p>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-muted">
                    <span>{obj.stock}% stock level</span>
                    <span>{obj.price}</span>
                  </div>
                  <div className="h-[2px] w-full bg-border">
                    <div className="h-full bg-fg" style={{ width: `${obj.stock}%` }} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {objects.length === 0 && (
          <div className="px-6 pb-24 sm:px-10">
            <p className="text-muted">Drones will appear here once they are added.</p>
          </div>
        )}

        {objects.length > 0 && filtered.length === 0 && (
          <div className="py-24 text-center text-muted">No drones match this filter.</div>
        )}

      </main>
    </>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1 text-xs transition-colors ${
        active ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-fg hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
