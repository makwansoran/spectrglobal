import { type ElementType, type ReactNode } from "react";

type ScrollRevealHeadingProps = {
  as?: "h1" | "h2" | "h3";
  className?: string;
  children: ReactNode;
  delay?: number;
  revealOnMount?: boolean;
};

export function ScrollRevealHeading({
  as: Tag = "h2",
  className = "",
  children,
}: ScrollRevealHeadingProps) {
  const Component = Tag as ElementType;

  return (
    <Component className={`${Tag === "h3" ? "block" : "inline-block"} ${className}`}>
      {children}
    </Component>
  );
}
