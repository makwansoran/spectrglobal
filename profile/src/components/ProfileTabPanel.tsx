import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  description?: string;
};

/** Single tab view (replaces stacked scroll sections). */
export function ProfileTabPanel({ title, children, description }: Props) {
  return (
    <div className="border-t border-line py-12 md:py-14">
      <header className="mb-8">
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>}
      </header>
      {children}
    </div>
  );
}
