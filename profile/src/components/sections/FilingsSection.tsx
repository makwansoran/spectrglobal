import type { CompanyProfile } from "../../types/company";

export function FilingsSection({ company }: { company: CompanyProfile }) {
  if (!company.filings.length) return null;

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-canvas text-xs uppercase tracking-wider text-muted">
            <th className="px-4 py-3 font-medium">Document</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Jurisdiction</th>
          </tr>
        </thead>
        <tbody>
          {company.filings.map((f) => (
            <tr key={f.id} className="border-b border-line last:border-0 hover:bg-canvas/80">
              <td className="px-4 py-3 font-medium text-ink">
                {f.url ? (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {f.title}
                  </a>
                ) : (
                  f.title
                )}
              </td>
              <td className="px-4 py-3 text-muted">{f.type}</td>
              <td className="px-4 py-3 font-mono text-muted">{f.date}</td>
              <td className="px-4 py-3 text-muted">{f.jurisdiction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
