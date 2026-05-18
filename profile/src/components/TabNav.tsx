import { scrollToSection } from "../hooks/useScrollSpy";

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  activeId: string;
};

export function TabNav({ tabs, activeId }: Props) {
  return (
    <nav
      className="sticky top-14 z-40 border-b border-line bg-white/95 backdrop-blur-sm"
      aria-label="Profile sections"
    >
      <div className="mx-auto max-w-7xl overflow-x-auto px-4 md:px-6">
        <ul className="flex min-w-max gap-1 py-2">
          {tabs.map((tab) => {
            const active = tab.id === activeId;
            return (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(tab.id, 120)}
                  className={`whitespace-nowrap rounded px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-ink text-white"
                      : "text-muted hover:bg-canvas hover:text-ink"
                  }`}
                  aria-current={active ? "true" : undefined}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
