export function isAppChromePath(pathname: string) {
  return (
    pathname === "/app" ||
    pathname.startsWith("/app/") ||
    pathname === "/login" ||
    pathname === "/check-email" ||
    pathname.startsWith("/mfa") ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/careers/login" ||
    pathname === "/careers/dashboard" ||
    pathname.startsWith("/careers/dashboard/") ||
    pathname.startsWith("/careers/positions") ||
    pathname === "/careers/apply" ||
    pathname.startsWith("/careers/apply/")
  );
}
