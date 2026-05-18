import { NavLink } from "react-router-dom";
import { scrollToSection } from "../hooks/useScrollSpy";
import { profileTabHref } from "../lib/profileTabs";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  activeId: string;
  chatTabId?: string;
  /** When set, tabs navigate to sub-routes instead of scrolling. */
  basePath?: string;
};

function tabButtonClass(active: boolean) {
  return `whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition ${
    active ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"
  }`;
}

function TabLink({
  tab,
  basePath,
  chatTabId,
}: {
  tab: Tab;
  basePath: string;
  chatTabId: string;
}) {
  const to = profileTabHref(basePath, tab.id);
  const isOverview = tab.id === "overview";

  return (
    <li key={tab.id} className={tab.id === chatTabId ? "shrink-0" : undefined}>
      <NavLink
        to={to}
        end={isOverview}
        className={({ isActive }) =>
          `${tabButtonClass(isActive)}${tab.id === chatTabId ? " my-2 block" : ""}`.trim()
        }
      >
        {tab.label}
      </NavLink>
    </li>
  );
}

export function TabNav({ tabs, activeId, chatTabId = "chat", basePath }: Props) {
  const sectionTabs = tabs.filter((t) => t.id !== chatTabId);
  const chatTab = tabs.find((t) => t.id === chatTabId);

  if (basePath) {
    return (
      <nav
        className="sticky top-14 z-40 border-b border-line bg-white/95 backdrop-blur-sm"
        aria-label="Profile sections"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 md:px-6">
          <ul className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-2">
            {sectionTabs.map((tab) => (
              <TabLink key={tab.id} tab={tab} basePath={basePath} chatTabId={chatTabId} />
            ))}
          </ul>
          {chatTab && <TabLink tab={chatTab} basePath={basePath} chatTabId={chatTabId} />}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="sticky top-14 z-40 border-b border-line bg-white/95 backdrop-blur-sm"
      aria-label="Profile sections"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 md:px-6">
        <div className="min-w-0 flex-1 overflow-x-auto">
          <ul className="flex min-w-max gap-1 py-2">
            {sectionTabs.map((tab) => {
              const active = tab.id === activeId;
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(tab.id, 120)}
                    className={tabButtonClass(active)}
                    aria-current={active ? "true" : undefined}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {chatTab && (
          <button
            type="button"
            onClick={() => scrollToSection(chatTab.id, 120)}
            className={`my-2 shrink-0 ${tabButtonClass(activeId === chatTab.id)}`}
            aria-current={activeId === chatTab.id ? "true" : undefined}
          >
            {chatTab.label}
          </button>
        )}
      </div>
    </nav>
  );
}
