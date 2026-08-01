"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClassName } from "@/components/button";
import { useGetStarted, type GetStartedTab } from "@/components/get-started-context";

type GetStartedButtonProps = {
  tab?: GetStartedTab;
  label?: string;
  children?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "icon" | "form";
  variant?: "primary" | "secondary" | "accent" | "ghost";
  /** When true, opens the Get Started sidebar instead of going to /login. */
  openSidebar?: boolean;
  href?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type">;

export function GetStartedButton({
  tab = "contact",
  label = "Get Started",
  children,
  className = "",
  size = "md",
  variant = "primary",
  openSidebar = false,
  href = "/login",
  onClick,
  ...props
}: GetStartedButtonProps) {
  const { openGetStarted } = useGetStarted();
  const classes = buttonClassName({ variant, size, className, children: children ?? label });

  if (openSidebar) {
    return (
      <button
        type="button"
        className={classes}
        onClick={(event) => {
          onClick?.(event);
          openGetStarted(tab);
        }}
        {...props}
      >
        {children ?? label}
      </button>
    );
  }

  return (
    <Link href={href} className={classes} onClick={onClick as never}>
      {children ?? label}
    </Link>
  );
}
