import type { FinnhubNewsItem } from "../../api/market";

export function FinnhubNews({ items }: { items: FinnhubNewsItem[] }) {
  if (!items.length) return null;

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.id} className="spectr-card p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-medium text-accent">{item.source}</span>
            {item.date && (
              <>
                <span>·</span>
                <time dateTime={item.date}>{item.date}</time>
              </>
            )}
          </div>
          <h3 className="mt-2 font-semibold text-ink">
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
          {item.summary && <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>}
        </li>
      ))}
    </ul>
  );
}
