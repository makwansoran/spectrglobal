import { type ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Props = {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
  /** Full-width profile block with divider (no fade-in hide) */
  variant?: "default" | "profile";
};

export function Section({ id, title, children, className = "", variant = "default" }: Props) {
  const { ref, visible } = useInView<HTMLElement>();
  const isProfile = variant === "profile";

  return (
    <section
      id={id}
      ref={ref}
      className={[
        "scroll-mt-28",
        isProfile
          ? "border-b border-line py-12 last:border-b-0 md:py-14"
          : visible
            ? "animate-fade-up"
            : "opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {title && <h2 className="section-title mb-6">{title}</h2>}
      {children}
    </section>
  );
}
