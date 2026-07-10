import { type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
};

export function Reveal({ children, as: Tag = "div", className = "" }: RevealProps) {
  return <Tag className={className}>{children}</Tag>;
}
