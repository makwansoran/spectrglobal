import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  intro?: string;
  align?: "left" | "center";
  children?: ReactNode;
};

export function PageHeader({ title, intro, align = "left", children }: PageHeaderProps) {
  const centered = align === "center";

  return (
    <section className="relative pb-14 pt-16 lg:pb-20 lg:pt-24">
      <div className={`container-x ${centered ? "text-center" : ""}`}>
        <h1
          className={`display fade-up text-[clamp(2.8rem,7vw,6.2rem)] text-fg ${
            centered ? "mx-auto max-w-4xl" : "max-w-4xl"
          }`}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className={`fade-up fade-up-2 mt-7 text-lg leading-8 text-muted ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {intro}
          </p>
        ) : null}
        {children ? (
          <div className={`fade-up fade-up-3 mt-10 ${centered ? "flex flex-col items-center" : ""}`}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
