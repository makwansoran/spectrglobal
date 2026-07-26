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
    <section className="relative pt-36 pb-16 lg:pt-44">
      <div className={`container-x ${centered ? "text-center" : ""}`}>
        <h1
          className={`display fade-up text-4xl text-gradient sm:text-6xl ${
            centered ? "mx-auto max-w-4xl" : "max-w-3xl"
          }`}
        >
          {title}
        </h1>
        {intro ? (
          <p
            className={`fade-up fade-up-2 mt-7 text-base leading-8 text-muted sm:text-lg ${
              centered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {intro}
          </p>
        ) : null}
        {children ? (
          <div
            className={`fade-up fade-up-3 mt-10 ${
              centered ? "flex flex-col items-center" : ""
            }`}
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
