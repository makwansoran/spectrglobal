type LogoMarkProps = {
  className?: string;
  title?: string;
};

/**
 * The Spectr mark: two overlapping rings, the inner one offset so the
 * overlap reads as a crescent. Drawn as vector so it stays crisp and
 * inherits the surrounding text colour.
 */
export function LogoMark({ className = "h-7 w-7", title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <ellipse cx="45" cy="50" rx="40" ry="45" strokeWidth="9" />
      <ellipse cx="62" cy="50" rx="26" ry="38" strokeWidth="8" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`brand-font text-[0.95rem] font-semibold uppercase tracking-[0.32em] ${className}`}
    >
      Spectr
    </span>
  );
}
