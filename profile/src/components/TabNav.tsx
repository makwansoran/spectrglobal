import { scrollToSection } from "../hooks/useScrollSpy";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  activeId: string;
  /** Always-visible chat control (pinned right) */
  chatTabId?: string;
};

function tabButtonClass(active: boolean) {
  return `whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition ${
    active ? "bg-ink text-white" : "text-muted hover:bg-canvas hover:text-ink"
  }`;
}

export function TabNav({ tabs, activeId, chatTabId = "chat" }: Props) {
  const sectionTabs = tabs.filter((t) => t.id !== chatTabId);
  const chatTab = tabs.find((t) => t.id === chatTabId);

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
