import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_COOKIE, readDemoSession } from "@/lib/demo-auth";

export async function getLocalSession() {
  const jar = await cookies();
  return readDemoSession(jar.get(DEMO_COOKIE)?.value);
}

export async function requireAdminSession() {
  const session = await getLocalSession();
  if (!session || session.role !== "admin") redirect("/login?next=/admin");
  return session;
}
