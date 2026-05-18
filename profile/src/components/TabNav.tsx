import { NavLink } from "react-router-dom";
import { profileTabHref } from "../lib/profileTabs";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  basePath: string;
  chatTabId?: string;
};

function tabClass(active: boolean) {
  return `rounded-md px-2.5 py-1 text-xs font-medium transition ${
    active ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"
  }`;
}

export function TabNav({ tabs, basePath }: Props) {
  return (
    <nav className="border-b border-line bg-white" aria-label="Profile sections">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <ul className="flex flex-wrap items-center gap-1 py-2">
          {tabs.map((tab) => {
            const isOverview = tab.id === "overview";
            return (
              <li key={tab.id}>
                <NavLink
                  to={profileTabHref(basePath, tab.id)}
                  end={isOverview}
                  className={({ isActive }) => tabClass(isActive)}
                >
                  {tab.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
