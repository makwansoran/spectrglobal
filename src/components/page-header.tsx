import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, intro, children }: PageHeaderProps) {
  return (
    <section className="relative pt-36 pb-16 lg:pt-44">
      <div className="container-x">
        <span className="eyebrow fade-up">{eyebrow}</span>
        <h1 className="display fade-up fade-up-2 mt-7 max-w-3xl text-4xl text-gradient sm:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="fade-up fade-up-3 mt-7 max-w-2xl text-base leading-8 text-muted sm:text-lg">
            {intro}
          </p>
        ) : null}
        {children ? <div className="fade-up fade-up-4 mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
