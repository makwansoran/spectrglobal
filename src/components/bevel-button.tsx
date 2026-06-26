import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

const BEVEL_START_PATH =
  "M.5 36c0 1.1.9 2 2 2H10V0C7.88 0 5.85.84 4.35 2.34L2.66 4.03A7.36 7.36 0 0 0 .5 9.24z";
const BEVEL_END_PATH = "M8 38H0V0h8c1.1 0 2 .9 2 2v34c0 1.1-.9 2-2 2";

type BevelButtonVariant = "primary" | "secondary" | "inverse-primary" | "inverse-secondary";

type BevelButtonBaseProps = {
  variant?: BevelButtonVariant;
  size?: "sm" | "lg" | "form";
  className?: string;
  children: ReactNode;
};

type BevelButtonAsLink = BevelButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BevelButtonBaseProps> & {
    href: string;
    external?: boolean;
  };

type BevelButtonAsButton = BevelButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BevelButtonBaseProps> & {
    href?: undefined;
    external?: never;
  };

export type BevelButtonProps = BevelButtonAsLink | BevelButtonAsButton;

function BevelMarks() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 38"
        className="bevel-button-mark bevel-button-mark-start"
        data-bevel="start"
        aria-hidden="true"
      >
        <path fill="currentColor" d={BEVEL_START_PATH} />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 38"
        className="bevel-button-mark bevel-button-mark-end"
        data-bevel="end"
        aria-hidden="true"
      >
        <path fill="currentColor" d={BEVEL_END_PATH} />
      </svg>
    </>
  );
}

function bevelButtonClassName({
  variant = "primary",
  size = "sm",
  className = "",
}: Pick<BevelButtonBaseProps, "variant" | "size" | "className">) {
  const sizeClass =
    size === "lg"
      ? "bevel-button-lg px-6 py-4 text-xs uppercase tracking-[0.16em]"
      : size === "form"
        ? "bevel-button-form px-8 py-4 text-sm font-medium normal-case tracking-normal"
        : "bevel-button-sm text-xs uppercase tracking-[0.16em]";

  return [
    "bevel-button group",
    `bevel-button-${variant}`,
    sizeClass,
    "inline-flex items-center gap-3 font-semibold [&>:not(.bevel-button-mark)]:relative [&>:not(.bevel-button-mark)]:z-[1]",
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function BevelButton({
  variant = "primary",
  size = "sm",
  className = "",
  children,
  ...props
}: BevelButtonProps) {
  const classes = bevelButtonClassName({ variant, size, className });

  if ("href" in props && props.href) {
    const { href, external, ...anchorProps } = props;

    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...anchorProps}>
          <BevelMarks />
          {children}
        </a>
      );
    }

    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          <BevelMarks />
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        <BevelMarks />
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} {...buttonProps}>
      <BevelMarks />
      {children}
    </button>
  );
}
