import { NavSearch } from "./NavSearch";

type Props = {
  /** Scroll to live chat on company / commodity profile */
  onChatClick?: () => void;
  chatActive?: boolean;
};

export function SiteHeader({ onChatClick, chatActive = false }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-plt-black">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:gap-4 md:px-6">
        <a
          href="/index.html"
          className="inline-flex shrink-0 items-center gap-2.5 text-white no-underline hover:opacity-90"
        >
          <img
            src="/assets/brand/spectr-mark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 brightness-0 invert"
            decoding="async"
          />
          <span className="hidden text-lg font-medium tracking-tight sm:inline">Spectr</span>
        </a>
        <NavSearch />
        {onChatClick && (
          <button
            type="button"
            onClick={onChatClick}
            className={`ml-auto shrink-0 rounded border px-4 py-1.5 text-sm font-semibold transition ${
              chatActive
                ? "border-white bg-white text-plt-black"
                : "border-white/40 bg-white/10 text-white hover:border-white/70 hover:bg-white/20"
            }`}
            aria-current={chatActive ? "page" : undefined}
          >
            Chat
          </button>
        )}
      </div>
    </header>
  );
}
