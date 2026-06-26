import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";

type BevelButtonVariant = "primary" | "secondary" | "inverse-primary" | "inverse-secondary";

type BevelButtonSize = "sm" | "lg" | "form" | "icon";

type BevelButtonBaseProps = {
  variant?: BevelButtonVariant;
  size?: BevelButtonSize;
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

export function bevelButtonClassName({
  variant = "primary",
  size = "sm",
  className = "",
}: Pick<BevelButtonBaseProps, "variant" | "size" | "className">) {
  const sizeClass =
    size === "lg"
      ? "bevel-button-lg"
      : size === "form"
        ? "bevel-button-form"
        : size === "icon"
          ? "bevel-button-icon"
          : "bevel-button-sm";

  return ["bevel-button", `bevel-button-${variant}`, sizeClass, className].filter(Boolean).join(" ");
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
          {children}
        </a>
      );
    }

    if (href.startsWith("#")) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
