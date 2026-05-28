"use client";

import Link from "next/link";
import { useState } from "react";
import { Nav } from "@/components/nav";
import { ObjectVisual } from "@/components/object-visual";
import { type DroneCategory, type DroneUse, objects, sectors, stages } from "@/lib/objects";

export function ObjectsClient() {
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
        {/* Header */}
        <div className="px-6 py-14 sm:px-10">
          <h1 className="display text-5xl sm:text-6xl">Catalog</h1>
          <p className="mt-4 max-w-xl text-muted">
            {objects.length} drone models across creator, FPV, survey, and industrial use.
            Select any model to compare specs, pricing, and availability.
          </p>
        </div>

        {/* Filters */}
        <div className="sticky top-[72px] z-40 flex flex-wrap gap-x-8 gap-y-2 bg-bg/95 px-6 py-4 backdrop-blur sm:px-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label mr-1">Category</span>
            <FilterButton active={sector === "All"} onClick={() => setSector("All")}>All</FilterButton>
            {sectors.map((s) => (
              <FilterButton key={s} active={sector === s} onClick={() => setSector(s as DroneCategory)}>
                {s}
              </FilterButton>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="label mr-1">Use</span>
            <FilterButton active={stage === "All"} onClick={() => setStage("All")}>All</FilterButton>
            {stages.map((s) => (
              <FilterButton key={s} active={stage === s} onClick={() => setStage(s as DroneUse)}>
                {s}
              </FilterButton>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="px-6 py-3 sm:px-10">
          <span className="label">{filtered.length} drones</span>
        </div>

        {/* List */}
        <div className="divide-y divide-border px-6 sm:px-10">
          {filtered.map((obj, i) => (
            <Link
              key={obj.slug}
              href={`/objects/${obj.slug}`}
              className="group relative grid items-center gap-4 py-7 md:grid-cols-[40px_200px_1fr_auto]"
            >
              {/* Index */}
              <span className="label hidden md:block">{String(i + 1).padStart(2, "0")}</span>

              {/* Name */}
              <div>
                <span className="display text-3xl">{obj.name}</span>
              </div>

              {/* Tagline + stock */}
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted">{obj.tagline}</span>
                <div className="mt-1 h-[2px] w-full max-w-xs bg-border">
                  <div
                    className="h-full bg-fg"
                    style={{ width: `${obj.stock}%` }}
                  />
                </div>
                <span className="label mt-0.5">{obj.stock}% stock level</span>
              </div>

              {/* Meta */}
              <div className="flex flex-col items-end gap-1 text-right text-xs text-muted">
                <span className="rounded-full border border-border px-2 py-0.5">{obj.category}</span>
                <span className="rounded-full border border-border px-2 py-0.5">{obj.use}</span>
                <span>{obj.price}</span>
                <span>{obj.availability}</span>
              </div>

              {/* Hover visual */}
              <div className="pointer-events-none absolute left-[260px] top-1/2 z-10 -translate-y-1/2 border border-border bg-bg opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                <ObjectVisual visual={obj.visual} className="h-32 w-52" />
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="py-20 text-center text-muted">
              No drones match this filter.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`border px-2.5 py-1 text-xs transition-colors ${
        active ? "border-fg bg-fg text-bg" : "border-border text-muted hover:border-fg hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}
