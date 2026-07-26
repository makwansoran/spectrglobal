import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      <h2 className="display text-3xl text-gradient sm:text-4xl lg:text-[2.85rem]">{title}</h2>
      {subtitle ? <p className="mt-5 text-base leading-7 text-muted">{subtitle}</p> : null}
    </Reveal>
  );
}
