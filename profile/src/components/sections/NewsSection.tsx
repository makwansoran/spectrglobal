import type { CompanyProfile } from "../../types/company";

export function NewsSection({ company }: { company: CompanyProfile }) {
  if (!company.news.length) return null;

  return (
    <ul className="space-y-4">
      {company.news.map((item) => (
        <li key={item.id} className="spectr-card p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-medium text-accent">{item.source}</span>
            <span>·</span>
            <time dateTime={item.date}>{item.date}</time>
          </div>
          <h3 className="mt-2 font-semibold text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{item.summary}</p>
        </li>
      ))}
    </ul>
  );
}
