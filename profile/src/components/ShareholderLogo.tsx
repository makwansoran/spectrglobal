import { useState } from "react";
import type { ShareholderStake } from "../types/company";
import { shareholderInitials, shareholderLogoUrl } from "../lib/ownership";

type Props = {
  stake: ShareholderStake;
  size?: "sm" | "md";
  color?: string;
};

export function ShareholderLogo({ stake, size = "md", color }: Props) {
  const [failed, setFailed] = useState(false);
  const url = shareholderLogoUrl(stake);
  const dim = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (url && !failed) {
    return (
      <img
        src={url}
        alt=""
        className={`${dim} shrink-0 rounded-full border border-line bg-white object-contain p-1`}
        onError={() => setFailed(true)}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`${dim} flex shrink-0 items-center justify-center rounded-full border border-line font-semibold text-white`}
      style={{ backgroundColor: color || "#64748b" }}
      aria-hidden
    >
      {shareholderInitials(stake.name)}
    </span>
  );
}
