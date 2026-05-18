import type { CommodityProfile } from "../../types/commodity";

export function CommodityAboutSection({ commodity }: { commodity: CommodityProfile }) {
  if (!commodity.about?.trim()) return null;
  return <p className="max-w-3xl text-base leading-relaxed text-muted">{commodity.about}</p>;
}
