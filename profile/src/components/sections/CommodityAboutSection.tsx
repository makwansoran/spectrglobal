import type { CommodityProfile } from "../../types/commodity";

export function CommodityAboutSection({ commodity }: { commodity: CommodityProfile }) {
  const hasAbout = Boolean(commodity.about?.trim());
  const hasFacts = commodity.keyFacts.length > 0;
  if (!hasAbout && !hasFacts) return null;

  return (
    <div className="space-y-6">
      {hasAbout && (
        <p className="max-w-3xl text-base leading-relaxed text-muted">{commodity.about}</p>
      )}
      {hasFacts && (
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {commodity.keyFacts.map((f) => (
            <div key={f.label}>
              <dt className="section-label mb-0.5">{f.label}</dt>
              <dd className="text-sm font-medium text-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
