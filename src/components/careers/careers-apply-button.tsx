import Link from "next/link";

export function CareersApplyButton({
  href = "/careers/apply",
  children = "Apply Now →",
  variant = "solid",
  className = "",
}: {
  href?: string;
  children?: string;
  variant?: "solid" | "outline" | "on-dark";
  className?: string;
}) {
  const styles =
    variant === "outline"
      ? "border-[#0A0A0A] bg-white text-[#0A0A0A] hover:bg-[#F3F3F3]"
      : variant === "on-dark"
        ? "border-white bg-white text-[#0A0A0A] hover:bg-white/90"
        : "border-[#0A0A0A] bg-[#0A0A0A] text-white hover:bg-[#262626]";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center border px-[22px] py-[11px] text-sm font-semibold transition-colors duration-150 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
