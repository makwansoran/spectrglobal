"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CareersApplyButton } from "@/components/careers/careers-apply-button";
import { EmptyListingsPanel } from "@/components/careers/empty-listings-panel";
import { hiringAreas, hiringLocations, openRoles, type CareerRole } from "@/lib/careers";

const teams = ["All teams", ...hiringAreas.map((area) => area.name)] as const;
const locations = ["All locations", ...hiringLocations] as const;

type TeamFilter = (typeof teams)[number];
type LocationFilter = (typeof locations)[number];

export function OpenRolesBoard() {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState<TeamFilter>("All teams");
  const [location, setLocation] = useState<LocationFilter>("All locations");

  const roles = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return openRoles.filter((role) => {
      const matchesQuery =
        !needle ||
        role.title.toLowerCase().includes(needle) ||
        role.team.toLowerCase().includes(needle) ||
        role.location.toLowerCase().includes(needle);
      const matchesTeam = team === "All teams" || role.team === team;
      const matchesLocation = location === "All locations" || role.location === location;
      return matchesQuery && matchesTeam && matchesLocation;
    });
  }, [query, team, location]);

  return (
    <div>
      <form
        className="grid gap-3 border-y border-[#D2D2CE] py-6 sm:grid-cols-[1fr_12rem_14rem] sm:items-end"
        onSubmit={(event) => event.preventDefault()}
        role="search"
        aria-label="Search open positions"
      >
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B72]">Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Role, team, or location"
            className="mt-2 w-full border border-[#D2D2CE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A]"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B72]">Team</span>
          <select
            value={team}
            onChange={(event) => setTeam(event.target.value as TeamFilter)}
            className="mt-2 w-full appearance-none border border-[#D2D2CE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A]"
          >
            {teams.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#6B6B72]">Location</span>
          <select
            value={location}
            onChange={(event) => setLocation(event.target.value as LocationFilter)}
            className="mt-2 w-full appearance-none border border-[#D2D2CE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0A0A0A]"
          >
            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </form>

      <p className="py-5 text-sm text-[#6B6B72]">
        {roles.length} open {roles.length === 1 ? "role" : "roles"}
        {query || team !== "All teams" || location !== "All locations" ? " matching these filters" : ""}.
      </p>

      {roles.length > 0 ? (
        <ul className="divide-y divide-[#D2D2CE] border-y border-[#D2D2CE]">
          {roles.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}
        </ul>
      ) : (
        <EmptyListingsPanel />
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#D2D2CE] pt-8">
        <p className="max-w-xl text-sm leading-6 text-[#6B6B72]">
          Filters work against posted requisitions. Speculative applications are open now — we read them.
        </p>
        <CareersApplyButton href="/careers/apply">Send an application</CareersApplyButton>
      </div>
    </div>
  );
}

function RoleRow({ role }: { role: CareerRole }) {
  return (
    <li>
      <Link
        href={role.href}
        className="grid gap-2 py-5 transition-colors hover:bg-white sm:grid-cols-[1.4fr_0.8fr_0.8fr_auto] sm:items-center sm:gap-6"
      >
        <span className="font-medium text-[#0A0A0A]">{role.title}</span>
        <span className="text-sm text-[#6B6B72]">{role.team}</span>
        <span className="text-sm text-[#6B6B72]">{role.location}</span>
        <span className="text-sm text-[#0A0A0A]">Apply →</span>
      </Link>
    </li>
  );
}
