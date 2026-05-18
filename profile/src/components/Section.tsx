import { type ReactNode } from "react";
import { useInView } from "../hooks/useInView";

type Props = {
  id: string;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, children, className = "" }: Props) {
  const { ref, visible } = useInView<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-28 ${visible ? "animate-fade-up" : "opacity-0"} ${className}`}
    >
      {title && <h2 className="section-title mb-5">{title}</h2>}
      {children}
    </section>
  );
}
