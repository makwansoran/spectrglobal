import { requireAdminSession } from "@/lib/auth/local-session";
import { AdminShell } from "@/components/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();
  return <AdminShell username={session.username}>{children}</AdminShell>;
}
